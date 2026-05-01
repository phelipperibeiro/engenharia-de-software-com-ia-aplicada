# 01 — Introdução e estrutura da pasta

## O que é o `exemplo-00-z`?

É o **exemplo mais enxuto** do módulo: um único arquivo `index.js` que:

1. Define dados fictícios de “pessoas” já **numéricos** (vetores de 7 números).
2. Define rótulos de classe em **one-hot** (3 classes: premium, medium, basic).
3. Monta uma **rede neural** (`tf.sequential`), treina com `model.fit` e classifica uma **nova pessoa** com `model.predict`.

Tudo roda **no Node.js** (terminal), não no navegador.

---

## Árvore de arquivos

```
exemplo-00-z/
├── class/                 ← material de estudo (esta documentação)
├── index.js               ← único código-fonte da lógica
├── package.json           ← dependência @tensorflow/tfjs-node + script start
└── package-lock.json      ← versões travadas do npm
```

Não há `src/`, HTML nem servidor HTTP: só script executável.

---

## Dependência principal

```
package.json
    |
    +--> "@tensorflow/tfjs-node"
              |
              v
        TensorFlow.js adaptado para Node
        (usa backend nativo quando disponível)
```

---

## Fluxo do programa (visão de alto nível)

```
  index.js carrega
        |
        v
  define tensorPessoasNormalizado + tensorLabels
        |
        v
  trainModel(inputXs, outputYs)  --->  model
        |
        v
  monta pessoaTensorNormalizado (novo exemplo)
        |
        v
  predict(model, tensor)  --->  probabilidades por classe
        |
        v
  console.log(resultados ordenados)
```

---

## Próximo passo

[02-tfjs-node-vs-navegador.md](./02-tfjs-node-vs-navegador.md)
