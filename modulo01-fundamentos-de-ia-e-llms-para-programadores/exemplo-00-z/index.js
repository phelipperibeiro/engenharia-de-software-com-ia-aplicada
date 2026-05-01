import tf from '@tensorflow/tfjs-node'

/**
 * Treina um modelo de rede neural para classificação.
 * 
 * Este script treina uma rede neural simples para classificar pessoas em três categorias:
 * premium, medium e basic.
 * O modelo usa apenas características numéricas já convertidas para valores normalizados
 * e codificação one-hot para cores e localização.
 * 
 * @param {*} inputXs 
 * @param {*} outputYs 
 * @returns 
 */
async function trainModel(inputXs, outputYs) {
    const model = tf.sequential()

    // Camada oculta principal
    // - Entrada: 7 valores numéricos
    //   1) idade normalizada
    //   2) 3 cores em one-hot: [azul, vermelho, verde]
    //   3) 3 localizações em one-hot: [São Paulo, Rio, Curitiba]
    //
    // Por que 80 neurônios?
    // - Esse valor serve como ponto de partida para uma base de treino pequena.
    // - Mais neurônios ajudam a rede a modelar padrões mais complexos.
    // - Porém, mais neurônios também aumentam o custo computacional.
    // - É um trade-off didático, não um número fixo para todas as situações.
    //
    // Por que ReLU?
    // - ReLU mantém valores positivos e zera valores negativos.
    // - Ela funciona como um filtro, deixando passar apenas sinais fortes.
    // - Isso evita que informações negativas poluam as próximas camadas.
    model.add(tf.layers.dense({ inputShape: [7], units: 80, activation: 'relu' }))

    // Camada de saída
    // - 3 neurônios: um para cada categoria final.
    // - softmax transforma as saídas em probabilidades.
    // - O resultado é um vetor como [p_premium, p_medium, p_basic].
    model.add(tf.layers.dense({ units: 3, activation: 'softmax' }))

    // Compilação do modelo
    // optimizer: 'adam' é um otimizador moderno que ajusta os pesos de forma eficiente.
    // loss: 'categoricalCrossentropy' é apropriado para classificação com múltiplas classes.
    // metrics: ['accuracy'] fornece uma métrica simples de acerto.
    model.compile({
        optimizer: 'adam',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    })

    // Treinamento do modelo
    // verbose: 0 evita muitos logs no terminal.
    // epochs: número de vezes que o modelo vê todo o conjunto de dados.
    // shuffle: embaralha os dados entre épocas para reduzir viés.
    await model.fit(inputXs, outputYs, {
        verbose: 0,
        epochs: 100,
        shuffle: true,
        callbacks: {
            // onEpochEnd: (epoch, log) => console.log(
            //     `Epoch ${epoch}: loss = ${log.loss.toFixed(4)}`
            // )
        }
    })

    return model
}

/**
 * Faz uma previsão com o modelo treinado.
 * @param {*} model 
 * @param {*} pessoa 
 * @returns 
 */
async function predict(model, pessoa) {
    // Converte os dados do JavaScript em tensor para o modelo.
    const tfInput = tf.tensor2d(pessoa)

    // O modelo retorna um tensor com probabilidade para cada classe.
    const pred = model.predict(tfInput)
    const predArray = await pred.array()

    // Cada elemento no resultado contém a probabilidade e o índice da classe.
    return predArray[0].map((prob, index) => ({ prob, index }))
}

// Exemplo de dados originais de pessoas para treinar o modelo.
// Esses exemplos mostram os atributos usados antes da codificação numérica.
const pessoas = [
    { 
        nome: 'Erick', 
        idade: 30, 
        cor: 'azul', 
        localizacao: 'São Paulo' 
    },
    { 
        nome: 'Ana', 
        idade: 25, 
        cor: 'vermelho', 
        localizacao: 'Rio' 
    },
    { 
        nome: 'Carlos', 
        idade: 40, 
        cor: 'verde', 
        localizacao: 'Curitiba' 
    }
];

// Dados de entrada no formato que o modelo espera:
// [idade_normalizada, azul, vermelho, verde, São Paulo, Rio, Curitiba]
const tensorPessoasNormalizado = [
    [
        0.33, // idade normalizada (Normalização)
        1,    // cor azul (One-Hot Encoding)*
        0,    // cor vermelho (One-Hot Encoding)
        0,    // cor verde (One-Hot Encoding)
        1,    // São Paulo (One-Hot Encoding)*
        0,    // Rio (One-Hot Encoding)
        0    // Curitiba (One-Hot Encoding)
    ], //#1 Erick
    [
        0, // idade normalizada (Normalização)
        0, // cor azul (One-Hot Encoding)
        1, // cor vermelho (One-Hot Encoding)*
        0, // cor verde (One-Hot Encoding)
        0, // localização São Paulo (One-Hot Encoding)
        1, // Rio (One-Hot Encoding)*
        0, // Curitiba (One-Hot Encoding)
    ], //#2 Ana
    [
        1, // idade normalizada (Normalização)
        0, // cor azul (One-Hot Encoding)
        0, // cor vermelho (One-Hot Encoding)
        1, // cor verde (One-Hot Encoding)*
        0, // localização São Paulo (One-Hot Encoding)
        0, // localização Rio (One-Hot Encoding)
        1, // localização Curitiba (One-Hot Encoding)
    ] //#3 Carlos
]

// As saídas esperadas também são codificadas em one-hot.
// [premium, medium, basic]
const labelsNomes = ['premium', 'medium', 'basic']
const tensorLabels = [
    [1, 0, 0], // premium - Erick
    [0, 1, 0], // medium - Ana
    [0, 0, 1]  // basic - Carlos
]

// Criamos tensores para entrada e saída.
const inputXs = tf.tensor2d(tensorPessoasNormalizado)
const outputYs = tf.tensor2d(tensorLabels)

// Treina o modelo com os dados de exemplo.
const model = await trainModel(inputXs, outputYs)

// Nova pessoa para teste.
const pessoa = { 
    nome: 'zé', 
    idade: 28, 
    cor: 'verde', 
    localizacao: 'Curitiba' 
}

// Normalização da idade com o mesmo padrão de treino.
// Exemplo: idade_min = 25, idade_max = 40.
// (28 - 25) / (40 - 25) = 0.2
const pessoaTensorNormalizado = [
    [
        0.2,  // idade normalizada
        0,    // cor azul
        0,    // cor vermelho
        1,    // cor verde
        0,    // localização São Paulo
        0,    // localização Rio
        1     // localização Curitiba
    ]
]

const predictions = await predict(model, pessoaTensorNormalizado)
const results = predictions
    .sort((a, b) => b.prob - a.prob)
    .map(p => `${labelsNomes[p.index]} (${(p.prob * 100).toFixed(2)}%)`)
    .join('\n')

console.log(results)
