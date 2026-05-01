# 02 — TensorFlow.js no Node vs no navegador

## Dois “mundos” com o mesmo conceito

```
+---------------------------+       +---------------------------+
| @tensorflow/tfjs          |       | @tensorflow/tfjs-node     |
| (navegador)               |       | (Node.js)                 |
+---------------------------+       +---------------------------+
| WebGL / WASM na página    |       | CPU (e opcionalmente      |
| Ideal para demos UI       |       | aceleração nativa)        |
+---------------------------+       +---------------------------+
```

Este projeto usa **`@tensorflow/tfjs-node`** porque o código é executado com **`node index.js`** — não há `<script>` nem DOM.

---

## O que muda na prática para você (júnior)

| Aspecto | Navegador (tfjs) | Node (tfjs-node) |
|--------|-------------------|------------------|
| Entrada no HTML | `<script>` ou bundle | `node index.js` |
| `fetch`, `document` | existe | não existe no mesmo sentido |
| Web Workers | comuns para não travar UI | não é o foco aqui |
| Onde aprende depois | exemplo e-commerce com worker | **este exemplo** |

A **API** de `tf.sequential`, `layers.dense`, `model.fit` é **parecida**; muda o **ambiente** e o pacote npm.

---

## Diagrama: onde seu código vive

```
  Você digita: npm start
        |
        v
  +-----------+
  |  Shell    |
  +-----+-----+
        |
        v
  package.json scripts.start
        |
        v
  node --watch index.js
        |
        v
  +-----------------------------+
  | Processo Node               |
  |  - import tf from '...'     |
  |  - tensores na RAM do PC    |
  +-----------------------------+
```

---

## Por que isso é útil para estudar?

- Menos peças: sem Browser Sync, sem CORS, sem worker.
- Você foca em: **vetor de entrada**, **rótulo**, **loss**, **épocas**, **softmax**.

---

## Próximo passo

[03-formato-dos-dados-vetores.md](./03-formato-dos-dados-vetores.md)
