# 00 — O que é YOLO? (resumo para dev júnior)

Este arquivo é um **resumo conceitual**. O passo a passo no código está em [04-worker-yolo-e-pos-processamento.md](./04-worker-yolo-e-pos-processamento.md).

---

## Em uma frase

**YOLO** é uma família de modelos de **visão computacional** treinados para **detectar objetos em uma imagem**: indicam **onde** está cada objeto (retângulo na tela) e **qual** é a classe (rótulo), com um **score de confiança**.

O nome costuma ser lido como **“You Only Look Once”**: a ideia é fazer **uma passagem** (forward) pela rede e obter detecções, em oposição a abordagens mais antigas que varriam a imagem com muitas janelas.

---

## O que o modelo “entrega” na prática

Para cada detecção, em geral você tem:

| Peça | Significado |
|------|-------------|
| **Bounding box** | Retângulo em volta do objeto (no seu worker, coordenadas que viram centro da mira). |
| **Classe** | Índice ou nome vindo de `labels.json` (o dataset de treino define a lista: pessoas, carros, “kite”, etc.). |
| **Score** | Quão confiante o modelo está (0–1); no projeto usa-se um **limiar** para descartar detecções fracas. |

No seu código, isso aparece como tensores **boxes**, **scores** e **classes** após `executeAsync`.

---

## O que o YOLO *não* é

- Não é um comando do TensorFlow — é **um tipo de arquitetura / pesos treinados** que você carrega (aqui: `tf.loadGraphModel` + arquivos em `yolov5n_web_model/`).
- Não “sabe” jogar Duck Hunt sozinho: ele só reconhece **classes do treino**. Por isso o exemplo filtra por um nome de classe (ex.: `'kite'`) — é didático; em outro jogo você trocaria modelo, classes ou o filtro.

---

## YOLOv5n neste exemplo

- **v5** = geração (Ultralytics / ecossistema comum de export).
- **n** = variante **nano** (rede menor, mais rápida, em geral menos precisa que as maiores).

Export **Web** = modelo convertido para TensorFlow.js (`model.json` + binários de peso), executável no browser com **TensorFlow.js**.

---

## Onde aprofundar no código

1. [04-worker-yolo-e-pos-processamento.md](./04-worker-yolo-e-pos-processamento.md) — pré-processamento 640×640, `executeAsync`, filtro por score e por classe.
2. `DuckHunt-JS-parte02/machine-learning/worker.js` — implementação comentada.

---

## Voltar ao índice

[class/README.md](./README.md)
