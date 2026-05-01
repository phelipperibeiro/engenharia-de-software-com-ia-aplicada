/**
 * Ponte entre o jogo PixiJS e o Web Worker de inferência (YOLO / TensorFlow.js)
 * --------------------------------------------------------------------------------
 * Roda na *thread principal* (mesma do DOM e do canvas). Responsável por:
 * 1) Montar o HUD de debug (buildLayout).
 * 2) Instanciar o worker com URL resolvida por import.meta.url (compatível com bundler).
 * 3) Capturar periodicamente o stage como imagem e enviar ao worker para detecção.
 * 4) Ao receber predições, posicionar a mira (aim) e reutilizar handleClick — o mesmo
 *    fluxo de um clique humano, sem duplicar lógica de colisão no Game.
 *
 * @param {import('../src/modules/Game').default} game Instância já carregada (load() concluído).
 * @returns {Promise<{ updateHUD: (data: object) => void }>} API retornada por buildLayout.
 */
import { buildLayout } from "./layout";

export default async function main(game) {
    const container = buildLayout(game.app);

    // Worker em arquivo separado: tf.js e inferência pesada não bloqueiam a animação do jogo.
    // type: 'module' permite usar import no worker (ambiente moderno).
    const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });

    // Esconde a mira até existir ao menos uma predição válida (evita sprite no canto errado).
    game.stage.aim.visible = false;

    worker.onmessage = ({ data }) => {
        const { type, x, y } = data;

        if (type === 'prediction') {
            console.log(`🎯 AI predicted at: (${x}, ${y})`);
            container.updateHUD(data);
            game.stage.aim.visible = true;

            // Coordenadas locais do stage; o worker já envia em pixels compatíveis com o bitmap capturado.
            game.stage.aim.setPosition(data.x, data.y);
            const position = game.stage.aim.getGlobalPosition();

            // Simula o mesmo evento de tiro do jogador: Game trata colisão / pontuação internamente.
            game.handleClick({
                global: position,
            });
        }
    };

    // Loop de captura: extrai o canvas composto do stage (cenário + patos + etc.) e envia ao modelo.
    // Segundo argumento [bitmap] transfere ownership ao worker (sem cópia grande na heap principal).
    setInterval(async () => {
        const canvas = game.app.renderer.extract.canvas(game.stage);
        const bitmap = await createImageBitmap(canvas);

        worker.postMessage({
            type: 'predict',
            image: bitmap,
        }, [bitmap]);
    }, 200); // every 200ms — ~5 análises por segundo (trade-off custo vs. responsividade)

    return container;
}
