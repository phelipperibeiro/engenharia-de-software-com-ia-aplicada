# Material de estudo — exemplo-00-z (TensorFlow.js no Node)

Esta pasta é **documentação didática** para o projeto em `exemplo-00-z/`: um script Node.js que treina uma rede neural **mínima** com `@tensorflow/tfjs-node` e faz uma **predição** de classe.

**Público:** dev júnior estudando Node.js, tensores, classificação multiclasse e diferença entre TF no servidor vs no navegador.

---

## Índice

| Arquivo | Conteúdo |
|--------|-----------|
| [01-introducao-e-estrutura.md](./01-introducao-e-estrutura.md) | O que existe na pasta, dependências, papel do `index.js` |
| [02-tfjs-node-vs-navegador.md](./02-tfjs-node-vs-navegador.md) | Por que `tfjs-node`, onde roda o código |
| [03-formato-dos-dados-vetores.md](./03-formato-dos-dados-vetores.md) | As 7 features, one-hot, rótulos em one-hot |
| [04-arquitetura-treino-e-predicao.md](./04-arquitetura-treino-e-predicao.md) | Fluxogramas: rede, `fit`, `predict`, softmax |
| [05-como-executar-e-dicas.md](./05-como-executar-e-dicas.md) | `npm start`, `node --watch`, possíveis pegadinhas |

---

## Mapa mental (uma página)

```
+------------------+     npm start      +------------------+
|    Terminal      | -----------------> | node --watch     |
|                  |                     | index.js         |
+------------------+                     +--------+---------+
                                                  |
                                                  v
                                         +------------------+
                                         | @tensorflow/     |
                                         | tfjs-node        |
                                         +--------+---------+
                                                  |
          +------------------+--------------------+------------------+
          |                  |                    |                  |
          v                  v                    v                  v
    tensor2d(X)       trainModel()          model.fit()      predict()
    tensor2d(Y)       sequential + dense    epochs/shuffle   softmax probs
```

Comece por **01** e **03** se você nunca viu one-hot; use **04** para ligar código e diagrama da rede.
