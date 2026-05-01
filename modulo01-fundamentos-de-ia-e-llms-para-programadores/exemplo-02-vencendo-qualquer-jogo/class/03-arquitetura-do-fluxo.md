# 03 — Arquitetura do fluxo (jogo + IA)

## Ponto de entrada: `main.js`

```
DOMContentLoaded
       |
       v
new Game({ spritesheet: 'sprites.json' })
       |
       v
game.load()
       |
       v
await main(game)    <-- machine-learning/main.js
```

Ou seja: primeiro o jogo base sobe; depois o módulo de ML “envolve” o mesmo objeto `game`.

---

## O que `machine-learning/main.js` faz

```
main(game)
    |
    +-- buildLayout(game.app)     ---> HUD (texto Score / Predictions)
    |
    +-- new Worker('./worker.js') ---> thread separada para TensorFlow
    |
    +-- game.stage.aim.visible = false   (mira escondida até ter predição)
    |
    +-- worker.onmessage:
    |       se type === 'prediction'
    |           atualiza HUD
    |           posiciona aim em (x, y)
    |           game.handleClick({ global: aim.getGlobalPosition() })
    |           ---> reutiliza a mesma lógica de “clique para atirar”
    |
    +-- setInterval(..., 200):
            captura canvas do stage -> ImageBitmap -> postMessage pro worker
```

---

## Fluxograma: da imagem ao tiro

```
+-------------+
| Stage Pixi  |  (patos, cenário, HUD…)
+------+------+
       |
       | renderer.extract.canvas(stage)
       v
+-------------+
| Canvas      |
+------+------+
       |
       | createImageBitmap(canvas)
       v
+-------------+
| ImageBitmap | ----transferível no postMessage ([bitmap])
+------+------+
       |
       v
+-------------+
| Worker      |  inferência YOLO
+------+------+
       |
       | { type: 'prediction', x, y, score }
       v
+-------------+
| main thread |  aim.setPosition(x,y)
+-------------+  handleClick → colisão com pato (lógica do Game)
```

**Transferência:** o último argumento `[bitmap]` em `postMessage` marca o `ImageBitmap` como **transferível**, evitando cópia grande entre threads.

---

## Por que `handleClick`?

O jogo originalmente liga **cliques do mouse** a tiros. A IA **simula** um clique na posição global da mira: assim não duplica a física de acerto — só injeta “onde o mouse estaria”.

```
humano clica               IA “clica”
     |                          |
     +------------+-------------+
                  |
                  v
           handleClick(event)
                  |
                  v
           mesma verificação de acerto
```

---

## HUD (`layout.js`)

Elementos Pixi (`PIXI.Text`) mostram score e coordenadas arredondadas da última predição; `updateHUD` é chamado quando chega uma mensagem `prediction`.

---

## Próximo passo

[04-worker-yolo-e-pos-processamento.md](./04-worker-yolo-e-pos-processamento.md)
