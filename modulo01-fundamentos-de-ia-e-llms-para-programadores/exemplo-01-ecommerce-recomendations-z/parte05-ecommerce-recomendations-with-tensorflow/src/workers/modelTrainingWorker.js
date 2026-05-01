/**
 * Web Worker de treinamento e recomendação (TensorFlow.js no navegador)
 * -----------------------------------------------------------------------
 * Este arquivo roda numa *thread separada* da página principal: treinar rede
 * neural é pesado; assim a UI não trava. A comunicação com a aba é só via
 * postMessage / onmessage (ver handlers no final do arquivo).
 *
 * Fluxo resumido:
 * 1) Recebe usuários → monta "contexto" (ranges, índices de categoria/cor).
 * 2) Codifica produtos e usuários em vetores numéricos (features).
 * 3) Gera pares (vetor usuário + vetor produto) com rótulo 1 ou 0 (comprou?).
 * 4) Treina uma rede densa (classificação binária com sigmoid na saída).
 * 5) Para recomendar: codifica o usuário, concatena com cada produto, predict,
 *    ordena pelo score.
 */

import 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js';
import { workerEvents } from '../events/constants.js';

/** Guarda o último contexto de normalização / índices após o treino (inferência). */
let _globalCtx = {};
/** Modelo treinado em memória do worker (null até trainModel concluir). */
let _model = null;

/**
 * Pesos por tipo de feature: somam ideia de "importância relativa" na entrada.
 * Categoria e cor entram como one-hot ponderado; preço e idade como escalares normalizados.
 * Valores são escolhidos como exemplo didático (não são os únicos possíveis).
 */
const WEIGHTS = {
    category: 0.4,
    color: 0.3,
    price: 0.2,
    age: 0.1,
};

// 🔢 Normalize continuous values (price, age) to 0–1 range
// Why? Keeps all features balanced so no one dominates training
// Formula: (val - min) / (max - min)
// Example: price=129.99, minPrice=39.99, maxPrice=199.99 → 0.56

/**
 * Min-max para intervalo [0, 1]. Evita divisão por zero se min === max.
 * @param value valor original
 * @param min menor valor observado no dataset (para aquela dimensão)
 * @param max maior valor observado
 */
const normalize = (value, min, max) => (value - min) / ((max - min) || 1);

/**
 * One-hot clássico (um 1 e o resto 0), convertido para float32 e multiplicado por `weight`.
 * Assim cada "bit" da categoria/cor contribui com intensidade proporcional ao peso global.
 */
const oneHotWeighted = (index, length, weight) => 
    tf.oneHot(index, length).cast('float32').mul(weight);

/**
 * Monta o contexto usado por `encodeProduct` e `encodeUser`: um único lugar com min/max,
 * vocabulários de cor/categoria e sinais derivados — assim treino e inferência usam as
 * mesmas regras de normalização.
 *
 * Calcula em especial:
 * - Faixas min/max de idade e preço (para encaixar valores em [0, 1]).
 * - Conjuntos únicos de cores e categorias e mapas estáveis nome → índice (one-hot).
 * - `productAvgAgeNorm`: para cada produto, média de idade entre quem já comprou;
 *   se não houver compras, usa a média global entre minAge e maxAge (`midAge`).
 *
 * `dimentions`: comprimento fixo de um vetor de produto (2 escalares + quantidade de
 * categorias + quantidade de cores). O nome do campo mantém um typo histórico (“dimentions”).
 *
 * @param {object[]} products Catálogo completo.
 * @param {object[]} users Lista de usuários com histórico de compras.
 */
function makeContext(products, users) {
    const ages = users.map(u => u.age); // pega a idade de cada usuário
    const prices = products.map(p => p.price); // pega o preço de cada produto

    const minAge = Math.min(...ages); // pega a idade mínima de todos os usuários
    const maxAge = Math.max(...ages); // pega a idade máxima de todos os usuários

    const minPrice = Math.min(...prices); // pega o preço mínimo de todos os produtos
    const maxPrice = Math.max(...prices); // pega o preço máximo de todos os produtos

    const colors = [...new Set(products.map(p => p.color))]; // pega as cores de todos os produtos
    const categories = [...new Set(products.map(p => p.category))]; // pega as categorias de todos os produtos

    // Mapa nome(cor) → índice para one-hot (ordem importa: deve ser a mesma em todo o treino)
    const colorsIndex = Object.fromEntries(
        colors.map((color, index) => {
            return [color, index];
        })); // cria um mapa nome → índice para one-hot (ordem importa: deve ser a mesma em todo o treino)

    // Mapa nome(categoria) → índice para one-hot (ordem importa: deve ser a mesma em todo o treino)
    const categoriesIndex = Object.fromEntries(
        categories.map((category, index) => {
            return [category, index];
        })); // cria um mapa nome → índice para one-hot (ordem importa: deve ser a mesma em todo o treino)

    // Idade média dos compradores de cada produto (personalização / sinal demográfico)
    const midAge = (minAge + maxAge) / 2; // pega a idade média de todos os usuários
    const ageSums = {}; // cria um objeto para armazenar a soma das idades dos compradores de cada produto
    const ageCounts = {}; // cria um objeto para armazenar o número de compradores de cada produto

    users.forEach(user => {
        user.purchases.forEach(p => {
            ageSums[p.name] = (ageSums[p.name] || 0) + user.age; // soma a idade do comprador do produto
            ageCounts[p.name] = (ageCounts[p.name] || 0) + 1; // incrementa o número de compradores do produto
        });
    }); // calcula a idade média dos compradores de cada produto

    const productAvgAgeNorm = Object.fromEntries(
        products.map(product => {
            const avg = ageCounts[product.name] ? // verifica se o produto tem compradores
                ageSums[product.name] / ageCounts[product.name] :
                midAge;

            return [product.name, normalize(avg, minAge, maxAge)]; // normaliza a idade média do comprador do produto
        })
    ); // cria um objeto com o nome do produto e a idade média dos compradores do produto normalizada

    return {
        products, // produtos do catálogo
        users, // usuários do sistema
        colorsIndex, // mapa nome → índice para one-hot (ordem importa: deve ser a mesma em todo o treino)
        categoriesIndex, // mapa nome → índice para one-hot (ordem importa: deve ser a mesma em todo o treino)
        productAvgAgeNorm, // idade média dos compradores de cada produto
        minAge, // idade mínima de todos os usuários
        maxAge, // idade máxima de todos os usuários
        minPrice, // preço mínimo de todos os produtos
        maxPrice, // preço máximo de todos os produtos
        numCategories: categories.length, // número de categorias de todos os produtos
        numColors: colors.length, // número de cores de todos os produtos
        // dimensão do vetor: preço(1) + idade(1) + one-hot categoria + one-hot cor
        dimentions: 2 + categories.length + colors.length,
    };
}

/**
 * Transforma um produto em um tensor 1D: [preço*, idade média dos compradores*, one-hot categoria*, one-hot cor*].
 * *Valores já ponderados por WEIGHTS (exceto a estrutura one-hot que recebe o peso via oneHotWeighted).
 */
function encodeProduct(product, context) {
    const price = tf.tensor1d([
        normalize(
            product.price,
            context.minPrice,
            context.maxPrice
        ) * WEIGHTS.price
    ]);

    const age = tf.tensor1d([
        (
            context.productAvgAgeNorm[product.name] ?? 0.5
        ) * WEIGHTS.age
    ]); // cria um tensor 1D com a idade média dos compradores do produto ponderada pelo peso WEIGHTS.age

    const category = oneHotWeighted(
        context.categoriesIndex[product.category],
        context.numCategories,
        WEIGHTS.category
    ); // cria um tensor 1D com a categoria do produto ponderada pelo peso WEIGHTS.category

    const color = oneHotWeighted(
        context.colorsIndex[product.color],
        context.numColors,
        WEIGHTS.color
    ); // cria um tensor 1D com a cor do produto ponderada pelo peso WEIGHTS.color

    return tf.concat1d(
        [price, age, category, color]
    ); // cria um tensor 1D com o preço, idade, categoria e cor do produto ponderados pelos pesos WEIGHTS.price, WEIGHTS.age, WEIGHTS.category e WEIGHTS.color
}

/**
 * Perfil do usuário como vetor da mesma dimensão que um produto:
 * - Se tem compras: média dos vetores dos produtos comprados (tf.stack + mean) → "centro" do gosto.
 * - Se não tem compras (cold start): só idade importa; preço/categoria/cor zerados.
 */
function encodeUser(user, context) {
    if (user.purchases.length) {
        /**
         * Se o usuário tem compras, cria um vetor com o preço, idade, categoria e cor do usuário ponderados pelos pesos WEIGHTS.price, WEIGHTS.age, WEIGHTS.category e WEIGHTS.color
         */
        return tf.stack(
            user.purchases.map(
                product => encodeProduct(product, context) // codifica o produto no mesmo espaço de features usado no treino
            )
        ) // cria um tensor 1D com o preço, idade, categoria e cor do usuário ponderados pelos pesos WEIGHTS.price, WEIGHTS.age, WEIGHTS.category e WEIGHTS.color
        .mean(0) // calcula a média dos vetores dos produtos comprados
        .reshape([
            1,
            context.dimentions
        ]); // cria um tensor 1D com o preço, idade, categoria e cor do usuário ponderados pelos pesos WEIGHTS.price, WEIGHTS.age, WEIGHTS.category e WEIGHTS.color
    }

    /**
     * Se o usuário não tem compras, cria um vetor com o preço, idade, categoria e cor do usuário ponderados pelos pesos WEIGHTS.price, WEIGHTS.age, WEIGHTS.category e WEIGHTS.color
     */
    return tf.concat1d(
        [
            tf.zeros([1]), // preço ignorado
            tf.tensor1d([
                normalize(user.age, context.minAge, context.maxAge)
                * WEIGHTS.age
            ]), // cria um tensor 1D com a idade do usuário ponderada pelo peso WEIGHTS.age
            tf.zeros([context.numCategories]), // categoria ignorada
            tf.zeros([context.numColors]), // cor ignorada

        ]
    ).reshape([1, context.dimentions]); // cria um tensor 1D com o preço, idade, categoria e cor do usuário ponderados pelos pesos WEIGHTS.price, WEIGHTS.age, WEIGHTS.category e WEIGHTS.color
}

/**
 * Monta o dataset supervisionado: para cada usuário com histórico, para cada produto do catálogo,
 * uma linha de entrada = concat(vetor usuário, vetor produto) e rótulo 1 se comprou, 0 caso contrário.
 * Isso vira classificação binária: "este par (u,p) é um match?"
 */
function createTrainingData(context) {
    const inputs = [];
    const labels = [];
    context.users
        .filter(u => u.purchases.length)
        .forEach(user => {
            const userVector = encodeUser(user, context).dataSync();
            context.products.forEach(product => {
                const productVector = encodeProduct(product, context).dataSync();

                const label = user.purchases.some(
                    purchase => purchase.name === product.name ?
                        1 :
                        0
                );
                inputs.push([...userVector, ...productVector]);
                labels.push(label);
            });
        }); // cria um tensor 1D com o preço, idade, categoria e cor do usuário ponderados pelos pesos WEIGHTS.price, WEIGHTS.age, WEIGHTS.category e WEIGHTS.color

    return {
        xs: tf.tensor2d(inputs), // cria um tensor 2D com os vetores de entrada
        ys: tf.tensor2d(labels, [labels.length, 1]), // cria um tensor 2D com os rótulos de saída
        // cada linha: dimensão do usuário + dimensão do produto (mesmo tamanho cada metade)
        inputDimention: context.dimentions * 2, // tamanho da entrada da rede neural
    }; // retorna o dataset de treinamento
}

// ====================================================================
// 📌 Exemplo de como um usuário é ANTES da codificação
// ====================================================================
/*
const exampleUser = {
    id: 201,
    name: 'Rafael Souza',
    age: 27,
    purchases: [
        { id: 8, name: 'Boné Estiloso', category: 'acessórios', price: 39.99, color: 'preto' },
        { id: 9, name: 'Mochila Executiva', category: 'acessórios', price: 159.99, color: 'cinza' }
    ]
};
*/

// ====================================================================
// 📌 Após a codificação, o modelo NÃO vê nomes ou palavras.
// Ele vê um VETOR NUMÉRICO (todos normalizados entre 0–1).
// Exemplo: [preço_normalizado, idade_normalizada, cat_one_hot..., cor_one_hot...]
//
// Suponha categorias = ['acessórios', 'eletrônicos', 'vestuário']
// Suponha cores      = ['preto', 'cinza', 'azul']
//
// Para Rafael (idade 27, categoria: acessórios, cores: preto/cinza),
// o vetor poderia ficar assim:
//
// [
//   0.45,            // peso do preço normalizado
//   0.60,            // idade normalizada
//   1, 0, 0,         // one-hot de categoria (acessórios = ativo)
//   1, 0, 0          // one-hot de cores (preto e cinza ativos, azul inativo)
// ]
//
// São esses números que vão para a rede neural.
// ====================================================================


// ====================================================================
// 🧠 Configuração e treinamento da rede neural
// ====================================================================

/**
 * Rede sequencial: entrada → duas camadas ocultas relu → saída sigmoid (probabilidade em [0,1]).
 * binaryCrossentropy + Adam: padrão para rótulos 0/1. Métrica accuracy aqui é orientativa
 * (dataset pode ser desbalanceado: muito mais zeros que uns).
 */
async function configureNeuralNetAndTrain(trainData) {

    const model = tf.sequential(); // cria uma rede neural sequencial
    // Camada de entrada
    // - inputShape: Número de features por exemplo de treino (trainData.inputDim)
    //   Exemplo: Se o vetor produto + usuário = 20 números, então inputDim = 20
    // - units: 128 neurônios (muitos "olhos" para detectar padrões)
    // - activation: 'relu' (mantém apenas sinais positivos, ajuda a aprender padrões não-lineares)
    model.add(
        tf.layers.dense({
            inputShape: [trainData.inputDimention], // tamanho da entrada da camada de entrada
            units: 128, // número de neurônios na camada de entrada 
            activation: 'relu' // função de ativação para a camada de entrada
        })
    );
    // Camada oculta 1
    // - 64 neurônios (menos que a primeira camada: começa a comprimir informação)
    // - activation: 'relu' (ainda extraindo combinações relevantes de features)
    model.add(
        tf.layers.dense({
            units: 64, // número de neurônios na camada oculta 1
            activation: 'relu' // função de ativação para a camada oculta 1
        })
    );

    // Camada oculta 2
    // - 32 neurônios (mais estreita de novo, destilando as informações mais importantes)
    //   Exemplo: De muitos sinais, mantém apenas os padrões mais fortes
    // - activation: 'relu'
    model.add(
        tf.layers.dense({
            units: 32, // número de neurônios na camada oculta 2
            activation: 'relu' // função de ativação para a camada oculta 2
        })
    );
    // Camada de saída
    // - 1 neurônio porque vamos retornar apenas uma pontuação de recomendação
    // - activation: 'sigmoid' comprime o resultado para o intervalo 0–1
    //   Exemplo: 0.9 = recomendação forte, 0.1 = recomendação fraca
    model.add(
        tf.layers.dense({ units: 1, activation: 'sigmoid' }) // camada densa com 1 neurônio e função de ativação sigmoid
    );

    model.compile({
        optimizer: tf.train.adam(0.01), // otimizador Adam para atualização dos pesos
        loss: 'binaryCrossentropy', // função de perda para classificação binária
        metrics: ['accuracy'] // métrica de avaliação para a acurácia
    });

    await model.fit(trainData.xs, trainData.ys, {
        epochs: 100, // número de épocas de treinamento
        batchSize: 32, // número de amostras processadas por época
        shuffle: true, // embaralha os dados entre épocas para reduzir viés
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                postMessage({
                    type: workerEvents.trainingLog,
                    epoch: epoch,
                    loss: logs.loss,
                    accuracy: logs.acc
                });
            } // envia uma mensagem para a UI indicando o progresso do treinamento
        }
    });

    return model;
}

/**
 * Pipeline completo de **treino supervisionado** disparado pela UI (`users` já vêm do fluxo
 * da aplicação; o catálogo vem só do servidor estático).
 *
 * Sequência:
 * 1. `fetch('/data/products.json')` — produtos do e-commerce em JSON.
 * 2. `makeContext(products, users)` — limites, índices e vocabulário para encoders.
 * 3. `productVectors` — para cada produto, `encodeProduct(...).dataSync()` guardado em
 *    memória; `recommend` reutiliza esses vetores sem recalcular o catálogo inteiro.
 * 4. `_globalCtx = context` — inferência posterior usa o mesmo contexto do treino.
 * 5. `createTrainingData` → `configureNeuralNetAndTrain` — monta `xs`/`ys` e `model.fit`.
 * 6. Guarda o modelo em `_model`; notifica progresso (1% → 100%) e `trainingComplete`.
 *
 * @param {{ users: object[] }} payload Lista de usuários com compras (formato dos dados da app).
 */
async function trainModel({ users }) {
    console.log('Training model with users:', users);
    postMessage({ type: workerEvents.progressUpdate, progress: { progress: 1 } }); // envia uma mensagem para a UI indicando o progresso do treinamento
    const products = await (await fetch('/data/products.json')).json();

    const context = makeContext(products, users); // cria o contexto do sistema
    context.productVectors = products.map(product => {
        return {
            name: product.name,
            meta: { ...product },
            vector: encodeProduct(product, context).dataSync()
        };
    }); // cria um vetor de produtos para cada produto do catálogo

    _globalCtx = context;

    const trainData = createTrainingData(context); // cria o dataset de treinamento
    _model = await configureNeuralNetAndTrain(trainData); // treina a rede neural

    postMessage({ type: workerEvents.progressUpdate, progress: { progress: 100 } }); // envia uma mensagem para a UI indicando que o treinamento foi concluído
    postMessage({ type: workerEvents.trainingComplete }); // envia uma mensagem para a UI indicando que o treinamento foi concluído
}

/**
 * Fase de inferência (após `trainModel`): ranqueia o catálogo para o `user` passado.
 *
 * Reutiliza o mesmo encaixe de features do treino: `encodeUser` + vetor de produto
 * pré-calculado em `context.productVectors` → linha de `inputs` idêntica a uma linha
 * de `createTrainingData`, mas **sem** rótulo — só a saída da sigmoid (probabilidade
 * de “match” para o par usuário–produto).
 *
 * Uma única chamada `predict` no tensor [N, inputDim] (batch) em vez de N chamadas
 * separadas. Ordena por `score` decrescente e envia `recommendations` à UI.
 *
 * Pré-requisitos: `_model` e `_globalCtx` preenchidos pelo último treino.
 *
 * @param {{ user: object }} payload Objeto com o usuário atual (mesmo formato dos JSON).
 */
function recommend({ user }) {
    if (!_model) return; // se o modelo não está treinado, retorna
    const context = _globalCtx;
    // 1️⃣ Codifica o usuário no mesmo espaço de features usado no treino.

    const userVector = encodeUser(user, context).dataSync(); // codifica o usuário no mesmo espaço de features usado no treino

    // Em aplicações reais:
    //  Armazene todos os vetores de produtos em um banco de dados vetorial (como Postgres, Neo4j ou Pinecone)
    //  Consulta: Encontre os 200 produtos mais próximos do vetor do usuário
    //  Execute _model.predict() apenas nesses produtos

    // 2️⃣ Um par (usuário, produto) por linha — o modelo estima P(materializar compra | par).


    const inputs = context.productVectors.map(({ vector }) => {
        return [...userVector, ...vector];
    }); // cria um tensor 2D com os vetores de entrada

    // 3️⃣ Tensor [numProdutos, inputDim]
    const inputTensor = tf.tensor2d(inputs); // cria um tensor 2D com os vetores de entrada

    // 4️⃣ Uma probabilidade por produto (sigmoid na última camada).
    const predictions = _model.predict(inputTensor); // predizw a probabilidade de compra para cada produto

    // 5️⃣ Volta para números JS para ordenar e enviar à UI.
    const scores = predictions.dataSync(); // converte o tensor de predições para um array de números
    const recommendations = context.productVectors.map((item, index) => {
        return {
            ...item.meta,
            name: item.name,
            score: scores[index]
        };
    }); // cria um array de recomendações para cada produto

    const sortedItems = recommendations
        .sort((a, b) => b.score - a.score); // ordena as recomendações pela pontuação

    // 6️⃣ Resultado final para a thread principal (evento `recommend`).
    postMessage({
        type: workerEvents.recommend,
        user,
        recommendations: sortedItems
    });
}

/** Mapa action (string vinda do constants) → função a executar no worker. */
const handlers = {
    [workerEvents.trainModel]: trainModel, // treina o modelo
    [workerEvents.recommend]: recommend, // recomenda produtos para o usuário
};

/**
 * Único listener de mensagens: desestrutura `action` e repassa o restante como argumento.
 * Convenção: a UI envia `{ action: workerEvents.xxx, ...payload }`.
 */
self.onmessage = e => {
    const { action, ...data } = e.data;
    if (handlers[action]) handlers[action](data);
}; // recebe uma mensagem e desestrutura o `action` e repassa o restante como argumento
