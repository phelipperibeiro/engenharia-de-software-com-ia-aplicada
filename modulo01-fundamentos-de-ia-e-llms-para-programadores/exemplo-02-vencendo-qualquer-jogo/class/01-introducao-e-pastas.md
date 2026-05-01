# 01 — Introdução e pastas na raiz

## Objetivo pedagógico

Demonstrar como um **jogo WebGL/Canvas** pode usar **inferência de rede neural** (detecção de objetos) sem travar a interface: o modelo pesado roda num **Web Worker**, enquanto a thread principal só captura frames e atualiza a mira.

---

## Árvore do exemplo (nível raiz)

```
exemplo-02-vencendo-qualquer-jogo/
├── class/                      ← esta documentação
├── DuckHunt-JS-parte01/        ← versão “intermediária” do worker (ver capítulo 05)
├── DuckHunt-JS-parte02/        ← versão completa do pós-processamento YOLO
└── _template/                  ← cópia/espelho do projeto Duck Hunt (base para builds)
```

Cada pasta **`DuckHunt-JS-parteXX`** é um **projeto npm separado** (seu próprio `package.json`, `webpack.config.js`, `dist/`). Você trabalha dentro de **uma** delas por vez (normalmente a mais recente para estudar o comportamento final).

---

## Dentro de cada `DuckHunt-JS-parteXX` (visão macro)

```
DuckHunt-JS-parte02/
├── main.js                     # entrada Webpack: carrega Game + ML
├── webpack.config.js           # empacota JS + copia modelo YOLO para dist/
├── gulpfile.js                 # tarefas opcionais (áudio/imagens — ver README do jogo)
├── machine-learning/
│   ├── main.js                 # instancia worker, loop de screenshot, HUD
│   ├── worker.js               # TensorFlow.js + YOLOv5n (GraphModel)
│   ├── layout.js               # HUD Pixi (score / coordenadas da predição)
│   └── yolov5n_web_model/      # model.json + shards + labels.json
├── src/
│   ├── modules/                # Game, Stage, Aim, Duck, Dog, Hud…
│   ├── libs/
│   └── data/
└── dist/                       # saída do build (HTML + bundle + assets copiados)
```

---

## Papéis rápidos

| Pasta / arquivo | Papel |
|-----------------|--------|
| `src/modules/Game.js` | Loop do jogo, input do jogador, `handleClick` para “atirar” |
| `machine-learning/main.js` | Ponte: worker ↔ estágio Pixi |
| `machine-learning/worker.js` | Carrega YOLO, recebe `ImageBitmap`, devolve predições |
| `yolov5n_web_model/` | Pesos e metadados do modelo TensorFlow.js |

---

## Por que não abrir `index.html` via `file://`?

O browser bloqueia vários recursos (CORS, workers, fetch do modelo) em páginas locais sem servidor. Por isso o README original pede **`npm start`** (servidor em `http://localhost:8080` neste projeto).

---

## Próximo passo

[02-build-e-como-rodar.md](./02-build-e-como-rodar.md)
