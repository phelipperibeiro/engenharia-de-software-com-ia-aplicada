# Material de estudo — exemplo-02 (Duck Hunt + visão computacional)

Esta pasta é **documentação didática** para `exemplo-02-vencendo-qualquer-jogo/`: o jogo **Duck Hunt em JS** (PixiJS) integrado a um modelo **YOLOv5n** via **TensorFlow.js** num **Web Worker**.

**Público:** dev júnior estudando jogos no browser, Web Workers, transferência de imagem para inferência e detecção de objetos.

**Resumo do YOLO (o que é, em linguagem simples):** [00-yolo-resumo.md](./00-yolo-resumo.md).

---

## Índice

| Arquivo | Conteúdo |
|--------|-----------|
| [00-yolo-resumo.md](./00-yolo-resumo.md) | O que é YOLO, saída típica (caixas, classes, scores), YOLOv5n no browser |
| [01-introducao-e-pastas.md](./01-introducao-e-pastas.md) | O que há na raiz: `DuckHunt-JS-parte01`, `parte02`, `_template` |
| [02-build-e-como-rodar.md](./02-build-e-como-rodar.md) | Webpack, `dist/`, cópia do modelo YOLO, `npm start` |
| [03-arquitetura-do-fluxo.md](./03-arquitetura-do-fluxo.md) | `main.js` → `Game` → loop de captura → worker → mira |
| [04-worker-yolo-e-pos-processamento.md](./04-worker-yolo-e-pos-processamento.md) | Pré-processamento, `executeAsync`, caixas, filtro de classe |
| [05-parte01-vs-parte02.md](./05-parte01-vs-parte02.md) | O que muda entre as duas versões didáticas |

---

## Mapa mental (uma página)

Diagrama em ASCII com caixas (`┌─┐│▼`) + setas de fluxo (`──►` `◄──`).  
**Legenda rápida:** números ①②③ = sequência ao subir o app; **A** = tráfego Main → Worker; **B** = Worker → Main.

```
                         FLUXO VERTICAL (bootstrap do app)
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ ①  npm start  →  webpack-dev-server  →  http://localhost:8080               │
  └───────────────────────────────────────────────┬─────────────────────────────┘
                                                  │
                                                  ▼  browser pede HTML + JS
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ ②  dist/index.html  +  duckhunt.js (bundle Webpack)                        │
  └───────────────────────────────────────────────┬─────────────────────────────┘
                                                  │
                                                  ▼  executa entrada + carrega jogo
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ ③  main.js  →  Game.load()  →  machine-learning/main(game)                  │
  └───────────────────────────────────────────────┬─────────────────────────────┘
                                                  │
                              ┌───────────────────┴────────────────────┐
                              │ bifurca: mesma página, duas threads    │
                              ▼                                        ▼


      THREAD PRINCIPAL                         canal A (ida) / B (volta)                    WEB WORKER
      (Pixi / UI)                            ~ a cada 200 ms                             (YOLO / tf.js)

      ┌─────────────────────────────┐                              ┌─────────────────────────────┐
      │ • Stage + canvas            │                              │ • loadGraphModel ao iniciar   │
      │ • setInterval → screenshot  │                              │ • pré-processo 640×640       │
      │ • aim + handleClick         │                              │ • inferência → boxes/scores  │
      └──────────────┬──────────────┘                              └──────────────┬──────────────┘
                     │                                                            │
                     │         ┌──────────────────────────────────────────────────────────────────┐
                     │         │  A (ida)    ───────────────────────────────────────────────────► │
                     │         │             postMessage({ type:'predict', image }, [bitmap])     │
                     │         │                                                                  │
                     │         │  B (volta)  ◄──────────────────────────────────────────────────  │
                     │         │             { type:'prediction', x, y, score }                   │
                     │         └──────────────────────────────────────────────────────────────────┘
                     │
                     └──► depois do B: aim em (x,y) e handleClick() como no clique do mouse
```

**O que é cada seta**

| Símbolo | Significado |
|--------|-------------|
| Linhas com `▼` entre caixas grandes | Ordem em que o app sobe (① → ② → ③). |
| **A** `──►` | Thread principal **envia** um frame (`ImageBitmap`) ao worker. |
| **B** `◄──` | Worker **devolve** coordenadas da detecção; a UI move a mira e chama `handleClick`. |
| Última linha curva | Fecha o ciclo: predição vira posição do tiro na mesma lógica do clique humano. |

Comece por **01** e **03**; use **05** para comparar `parte01` e `parte02` no código.
