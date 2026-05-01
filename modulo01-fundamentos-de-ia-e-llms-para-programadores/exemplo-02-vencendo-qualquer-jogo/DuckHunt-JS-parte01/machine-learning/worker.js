/**
 * Web Worker de inferência YOLOv5n (TensorFlow.js no navegador)
 * -----------------------------------------------------------------
 * Este arquivo roda numa *thread separada* da página principal: rodar detecção
 * de objetos frame a frame é pesado; assim o jogo (PixiJS) não trava.
 * Comunicação com a aba: apenas postMessage / onmessage.
 *
 * Fluxo resumido (esta parte didática — parte01):
 * 1) Carrega labels + grafo TensorFlow (YOLO exportado para TF.js).
 * 2) Recebe ImageBitmap do canvas do jogo via postMessage({ type: 'predict', image }).
 * 3) Pré-processa para [1, 640, 640, 3] e executa executeAsync no modelo.
 * 4) Por ora: após inferência real, ainda devolve coordenadas *fixas* (400, 400) para
 *    você validar o pipeline (thread principal ↔ worker ↔ modelo) antes do pós-processamento
 *    de caixas (veja DuckHunt-JS-parte02).
 *
 * Convenção de mensagens da thread principal:
 * - Entrada: { type: 'predict', image: ImageBitmap }
 * - Saída (carregamento): { type: 'model-loaded' }
 * - Saída (stub parte01): { type: 'prediction', x, y, score }
 */

importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest');

/** Caminho relativo ao HTML servido: Webpack copia esta pasta para dist/yolov5n_web_model */
const MODEL_PATH = `yolov5n_web_model/model.json`;
/** Lista de nomes de classe (índice alinhado ao tensor `classes` na saída do modelo). */
const LABELS_PATH = `yolov5n_web_model/labels.json`;
/** YOLO costuma ser treinado/convertido com entrada quadrada fixa (lado em pixels). */
const INPUT_MODEL_DIMENTIONS = 640;

/** Rótulos textuais carregados de labels.json (usados nas partes seguintes ao filtrar por classe). */
let _labels = [];
/** Grafo TensorFlow.js carregado via tf.loadGraphModel (null até loadModelAndLabels concluir). */
let _model = null;

/**
 * Baixa metadados do modelo, monta o GraphModel em memória e faz um “aquecimento”.
 * O warmup compila caches GPU/WebGL e reduz o atraso da primeira inferência real.
 */
async function loadModelAndLabels() {
    await tf.ready();

    _labels = await (await fetch(LABELS_PATH)).json();
    _model = await tf.loadGraphModel(MODEL_PATH);

    // warmup
    const dummyInput = tf.ones(_model.inputs[0].shape);
    await _model.executeAsync(dummyInput);
    tf.dispose(dummyInput);

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
 */
function preprocessImage(input) {
    return tf.tidy(() => {
        const image = tf.browser.fromPixels(input);

        return tf.image
            .resizeBilinear(image, [INPUT_MODEL_DIMENTIONS, INPUT_MODEL_DIMENTIONS])
            .div(255)
            .expandDims(0);
    });
}

/**
 * Executa uma passagem forward no grafo e extrai tensores brutos de detecção.
 * Os dados numéricos são copiados para TypedArrays JS; os tensores TF são descartados depois.
 *
 * @returns {{ boxes: TypedArray, scores: TypedArray, classes: TypedArray }}
 */
async function runInference(tensor) {
    const output = await _model.executeAsync(tensor);
    tf.dispose(tensor);
    // Assume que as 3 primeiras saídas são:
    // caixas (boxes), pontuações (scores) e classes

    const [boxes, scores, classes] = output.slice(0, 3);
    const [boxesData, scoresData, classesData] = await Promise.all(
        [
            boxes.data(),
            scores.data(),
            classes.data(),
        ]
    );

    output.forEach(t => t.dispose());

    return {
        boxes: boxesData,
        scores: scoresData,
        classes: classesData
    };
}

// Dispara carregamento assim que o worker sobe (não precisa esperar mensagem da UI).
loadModelAndLabels();

self.onmessage = async ({ data }) => {
    if (data.type !== 'predict') return;
    if (!_model) return;

    const input = preprocessImage(data.image);
    const { width, height } = data.image;

    const inferenceResults = await runInference(input);

    // -----------------------------------------------------------------
    // PARTE DIDÁTICA (parte01): inferência acima já rodou; resultado em inferenceResults.
    // Aqui ainda NÃO convertemos caixas → centro em pixels (isso está na parte02).
    // Pausa opcional no DevTools para inspecionar tensores / call stack.
    // Saída fixa só para a mira receber um ponto estável enquanto você depura.
    // -----------------------------------------------------------------
    debugger;
    postMessage({
        type: 'prediction',
        x: 400,
        y: 400,
        score: 0
    });


};

console.log('🧠 YOLOv5n Web Worker initialized');
