/**
 * HUD em PixiJS para acompanhar predições da IA durante o desenvolvimento
 * -------------------------------------------------------------------------
 * Cria textos fixos no canto superior direito: pontuação associada à última detecção
 * e coordenadas (x, y) arredondadas. Não é obrigatório para o jogo “oficial” — serve
 * como painel de debug alinhado ao que worker.js envia em data.score / data.x / data.y.
 *
 * @param {import('pixi.js').Application} app Aplicação Pixi (stage + renderer já configurados).
 * @returns {{ updateHUD: (data: { score?: string|number, x: number, y: number }) => void }}
 */
// layout.js
import * as PIXI from 'pixi.js';

export function buildLayout(app) {
  // Container for HUD
  const hud = new PIXI.Container();
  hud.y = 50;
  hud.zIndex = 1000;

  // Score Text
  const scoreText = new PIXI.Text({
    text: 'Score: 0',
    style: {
      fontFamily: 'monospace',
      fontSize: 24,
      fill: 0xffffff,
      stroke: 0x000000,
    },
  });
  hud.addChild(scoreText);

  // Predictions Text
  const predictionsText = new PIXI.Text({
    text: 'Predictions:',
    style: {
      fontFamily: 'monospace',
      fontSize: 16,
      fill: 0xfff666,
      stroke: 0x333300,
      wordWrap: true,
      wordWrapWidth: 420,
    },
  });
  predictionsText.y = 36;
  hud.addChild(predictionsText);

  // Add HUD to stage, ensure it's always on top
  app.stage.sortableChildren = true;
  app.stage.addChild(hud);

  // Function to reposition HUD at top-right
  function positionHUD() {
    // Margin from the right
    const margin = 16;
    // Find HUD width (in case text wraps/grows)
    const hudWidth = Math.max(scoreText.width, predictionsText.width);
    hud.x = app.renderer.width - hudWidth - margin;
  }

  // Utility for updating HUD
  // Chamado a cada mensagem 'prediction' do worker (via main.js).
  function updateHUD(data) {
    scoreText.text = `Score: ${data.score}`;
    predictionsText.text = `Predictions: (${Math.round(data.x)}, ${Math.round(data.y)})`;
    positionHUD();
  }

  // Position HUD initially and on every resize
  positionHUD();
  window.addEventListener('resize', () => {
    positionHUD();
  });

  return {
    updateHUD,
  };
}
