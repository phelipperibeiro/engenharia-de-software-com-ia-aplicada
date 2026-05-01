/**
 * Web Worker de inferência YOLOv5n (TensorFlow.js no navegador)
 * -----------------------------------------------------------------
 * Este arquivo roda numa *thread separada* da página principal: detecção em tempo
 * real sobre frames do canvas é custosa; assim o jogo (PixiJS) permanece fluido.
 * Comunicação com a aba: apenas postMessage / onmessage.
 *
 * Fluxo resumido (parte02 — pipeline completo):
 * 1) Carrega labels.json + model.json (grafo TensorFlow.js exportado do YOLO).
 * 2) Thread principal envia { type: 'predict', image: ImageBitmap } periodicamente.
 * 3) Pré-processa para tensor [1, 640, 640, 3] (normalizado 0–1) e roda executeAsync.
 * 4) Lê caixas, scores e classes; filtra por confiança mínima e por nome de classe.
 * 5) Converte caixas normalizadas em coordenadas de tela, calcula centro, postMessage
 *    com { type: 'prediction', x, y, score } (a UI move a mira e dispara o tiro lógico).
 *
 * Convenção de mensagens:
 * - Entrada: { type: 'predict', image: ImageBitmap }
 * - Saída (pronto): { type: 'model-loaded' }
 * - Saída (detecção): { type: 'prediction', x, y, score } (uma por detecção que passou nos filtros)
 */

importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest');

/** Caminho relativo ao HTML: Webpack copia para dist/yolov5n_web_model */
const MODEL_PATH = `yolov5n_web_model/model.json`;
/** Índice textual das classes (classes[i] na saída do modelo → labels[i]). */
const LABELS_PATH = `yolov5n_web_model/labels.json`;

/** Largura/altura de entrada esperada pelo modelo convertido (pixels). */
const INPUT_MODEL_DIMENTIONS = 640;
/**
 * Descarta detecções com probabilidade abaixo deste valor (0–1).
 * Ajuste para mais detecções (menor) ou menos ruído (maior).
 */
const CLASS_THRESHOLD = 0.6;

/** Lista de nomes de classe carregada uma vez de labels.json. */
let _labels = [];

/** Instância tf.loadGraphModel; null até loadModelAndLabels() terminar. */
let _model = null;

/**
 * Carrega rótulos e o grafo — o mesmo **passo (1)** do fluxo no topo deste arquivo:
 * `labels.json` + `model.json` (YOLO já exportado para TensorFlow.js).
 *
 * Depois roda um forward **“falso” de warmup**: um tensor só de uns (`tf.ones`) com a forma de
 * entrada do modelo e um `executeAsync`. No curso o objetivo é lembrar que o **primeiro** forward
 * costuma ser o mais pesado (compilação de shader WebGL, cache, preparo da GPU); aquecer aqui
 * reduz a latência quando chegar o **primeiro frame real** do jogo.
 *
 * Por fim avisa a UI com `{ type: 'model-loaded' }`. Não há treino (`fit`): só **inferência**
 * com pesos prontos; é visão / detecção (YOLO), não LLM.
 */
async function loadModelAndLabels() {
    await tf.ready();

    _labels = await (await fetch(LABELS_PATH)).json(); // carrega os rótulos do modelo, lista dos objetos que o modelo consegue detectar
    _model = await tf.loadGraphModel(MODEL_PATH); // carrega o modelo treinado

    // warmup
    const dummyInput = tf.ones(_model.inputs[0].shape); // cria um tensor com a forma do input do modelo para aquecer o modelo
    await _model.executeAsync(dummyInput); // executa o modelo com o tensor criado
    tf.dispose(dummyInput); // descarta o tensor criado, liberando memória

    postMessage({ type: 'model-loaded' });
}

/**
 * Pré-processa a imagem para o formato aceito pelo YOLO:
 * - tf.browser.fromPixels(): converte ImageBitmap/ImageData para tensor [H, W, 3]
 * - tf.image.resizeBilinear(): redimensiona para [INPUT_DIM, INPUT_DIM]
 * - .div(255): normaliza os valores para [0, 1]
 * - .expandDims(0): adiciona dimensão batch [1, H, W, 3]
 *
 * Uso de tf.tidy():
 * - Garante que tensores temporários serão descartados automaticamente,
 *   evitando vazamento de memória.
 *
 * Input: ImageBitmap / ImageData (o que o worker recebe de `createImageBitmap` no main).
 * Output: tensor [1, 640, 640, 3]  (NHWC: batch, altura(height), largura(width), RGB; 640 = INPUT_MODEL_DIMENTIONS)
 * - 1: batch size
 * - 640: altura
 * - 640: largura
 * - 3: canais (RGB)
 */
function preprocessImage(input) {
    return tf.tidy(() => { // (tf.tidy) - garante que tensores temporários serão descartados automaticamente, evitando vazamento de memória
        const image = tf.browser.fromPixels(input);

        return tf.image
            .resizeBilinear(image, [INPUT_MODEL_DIMENTIONS, INPUT_MODEL_DIMENTIONS])
            .div(255)
            .expandDims(0);
    });
}

/**
 * Roda o **GraphModel** do YOLO: `executeAsync` devolve **vários** tensores (a exportação
 * para TF.js define quantos e em que ordem). No curso usamos as **3 primeiras** saídas,
 * como no comentário abaixo no código: em geral são
 * **boxes** (caixas), **scores** (confiança por detecção) e **classes** (índice do rótulo
 * em `labels.json`). Se o export mudar, essa ordem / quantidade tem de ser conferida.
 *
 * Copia os dados para `TypedArray` com `.data()` (fácil de iterar no JS) e dá `dispose`
 * no resto para não vazar memória na GPU/CPU.
 *
 * @param {*} tensor Tensor de entrada já pré-processado (ex.: [1, H, W, 3]).
 * @returns {{ boxes: TypedArray, scores: TypedArray, classes: TypedArray }}
 */
async function runInference(tensor) {
    const output = await _model.executeAsync(tensor); // executa o modelo com o tensor criado
    tf.dispose(tensor);
    // Assume que as 3 primeiras saídas são:
    // caixas (boxes), pontuações (scores) e (objetos detectados) classes

    const [boxes, scores, classes] = output.slice(0, 3); // pega as 3 primeiras saídas do modelo
    const [boxesData, scoresData, classesData] = await Promise.all(
        [
            boxes.data(),
            scores.data(),
            classes.data(),
        ]
    ); // copia os dados para `TypedArray` com `.data()` (fácil de iterar no JS)

    output.forEach(t => t.dispose()); // dá `dispose` no resto para não vazar memória na GPU/CPU

    return {
        boxes: boxesData,
        scores: scoresData,
        classes: classesData
    }; // retorna um objeto com os dados das caixas, pontuações e classes
}

// =============================================================================
// Pós-processamento: filtro por score + classe → centro da caixa em pixels
// =============================================================================

/**
 * Filtra e processa as predições:
 * - Aplica o limiar de confiança (CLASS_THRESHOLD)
 * - Filtra apenas a classe desejada (exemplo: 'kite')
 * - Converte coordenadas normalizadas para pixels reais
 * - Calcula o centro do bounding box
 *
 * Uso de generator (function*):
 * - Permite enviar cada predição assim que processada, sem criar lista intermediária
 *
 * Nota didática: 'kite' vem do vocabulário COCO em labels.json. Para outro alvo,
 * troque a string ou use o índice de classe coerente com o seu modelo.
 */
function* processPrediction({ boxes, scores, classes }, width, height) {
    for (let index = 0; index < scores.length; index++) {
        if (scores[index] < CLASS_THRESHOLD) continue; // se a pontuação for menor que o limiar de confiança (0.4), continua para a próxima iteração

        const label = _labels[classes[index]]; // pega o rótulo da classe
        if (label !== 'kite') continue; // se a classe não for 'kite', continua para a próxima iteração

        let [x1, y1, x2, y2] = boxes.slice(index * 4, (index + 1) * 4); // pega as coordenadas da caixa
        x1 *= width; // converte as coordenadas para pixels reais (largura original da imagem)
        x2 *= width; // converte as coordenadas para pixels reais (largura original da imagem)
        y1 *= height; // converte as coordenadas para pixels reais (altura original da imagem)
        y2 *= height; // converte as coordenadas para pixels reais (altura original da imagem)

        const boxWidth = x2 - x1; // calcula a largura da caixa
        const boxHeight = y2 - y1; // calcula a altura da caixa
        const centerX = x1 + boxWidth / 2; // calcula o centro da caixa na horizontal
        const centerY = y1 + boxHeight / 2; // calcula o centro da caixa na vertical

        yield {
            x: centerX,
            y: centerY,
            score: (scores[index] * 100).toFixed(2)
        };
    }
}

// Carrega modelo na inicialização do worker (não depende de mensagem da página).
loadModelAndLabels();

/**
 * Recebe frames do jogo: só processa type 'predict' e se o modelo já estiver pronto.
 * width/height vêm do ImageBitmap original para reescalar caixas (normalizadas) → pixels.
 */
self.onmessage = async ({ data }) => {
    if (data.type !== 'predict') return; // se a mensagem não for do tipo 'predict', retorna
    if (!_model) return; // se o modelo não estiver pronto, retorna

    const input = preprocessImage(data.image); // pré-processa a imagem para o formato aceito pelo YOLO 640x640 (INPUT_MODEL_DIMENTIONS)
    const { width , height } = data.image; // pega a largura e altura original da imagem

    const inferenceResults = await runInference(input); // roda o modelo e materializa as três primeiras saídas em arrays JS

    for (const prediction of processPrediction(inferenceResults, width, height)) { // filtra e processa as predições
        postMessage({
            type: 'prediction',
            ...prediction
        });
    }
};

console.log('🧠 YOLOv5n Web Worker initialized');
