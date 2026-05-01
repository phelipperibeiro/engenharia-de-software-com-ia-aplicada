# 06 — Evolução: parte01 → parte05

O `src/index.js` é o **mesmo** nas cinco pastas. A evolução didática está concentrada em **`src/workers/modelTrainingWorker.js`** (e em comentários/`debugger` deixados para pausar no DevTools).

Use esta página como **checklist** ao comparar arquivos lado a lado no editor.

---

## Tabela resumo

```
+--------+------------------------------+----------------------------------------+
| Parte  | O que o worker já faz        | O que ainda NÃO faz                    |
+--------+------------------------------+----------------------------------------+
| parte01| makeContext + fetch products | WEIGHTS, encode*, rede, recommend      |
| parte02| + encodeProduct              | encodeUser, dataset, rede, recommend   |
|        | + productVectors             |                                        |
| parte03| + encodeUser                 | rede treinada (só dataset + debugger)  |
|        | + createTrainingData         |                                        |
| parte04| + configureNeuralNetAndTrain | recommend implementado                 |
|        | + model.fit                  |                                        |
| parte05| tudo acima                   | recommend completo + docs/comentários  |
|        | + recommend                  |                                        |
+--------+------------------------------+----------------------------------------+
```

---

## Diagrama da progressão (linha do tempo)

```
parte01        parte02           parte03              parte04           parte05
   |               |                 |                    |                 |
   v               v                 v                    v                 v
context        vetor de          dataset de           treina rede        recomenda
básico         produto           pares (u,p)          (TFJS)             por score
```

---

## parte01 — Fundação de dados

```
trainModel:
  fetch products.json
  makeContext(products, users)
  debugger
  progress 100% + trainingComplete

recommend: vazio
```

**Objetivo de estudo:** entender `makeContext` e que o worker já conversa com a UI via `postMessage`.

---

## parte02 — Vetor de produto

Acrescenta:

- `WEIGHTS` (importância relativa das features).
- `oneHotWeighted`, `encodeProduct`.
- Em `trainModel`: calcula `productVectors` e guarda `_globalCtx`.

Ainda **não** monta dataset nem treina rede. `recommend` vazio.

---

## parte03 — Usuário + dataset

Acrescenta:

- `encodeUser` (média das compras).
- `createTrainingData` → tensores `xs` / `ys`.

Para na chamada `debugger` **depois** de montar `trainData` (antes da rede).

---

## parte04 — Rede neural

Acrescenta:

- `configureNeuralNetAndTrain` (camadas densas, Adam, binaryCrossentropy).
- `trainModel` chama `_model = await configureNeuralNetAndTrain(trainData)`.
- Callback `onEpochEnd` envia logs ao front.

`recommend` ainda **sem** lógica de predição (stub).

---

## parte05 — Fechamento

Acrescenta:

- `recommend({ user })` completo: `encodeUser`, batch predict, ordenação, `postMessage` com lista.
- `encodeUser` com ramo **cold start** (usuário sem compras): vetor baseado na idade.
- Comentários didáticos no arquivo (estudo).

---

## Como estudar na prática

1. Abra `parte01/.../modelTrainingWorker.js` e leia só até `trainModel`.
2. Copie o arquivo para um editor diff contra `parte02`, depois `parte03`, etc.
3. No navegador (parte04/05), use **DevTools → Sources** se ainda houver `debugger` em alguma cópia antiga.

---

## Voltar ao índice

[class/README.md](./README.md)
