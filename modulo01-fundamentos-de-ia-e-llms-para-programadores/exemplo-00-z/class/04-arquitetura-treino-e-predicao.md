# 04 — Arquitetura da rede, treino e predição

## Visão da rede (como no `trainModel`)

```
entrada: 7 features
         |
         v
+---------------------------+
| Dense: 80 neurônios       |
| activation: relu          |
+---------------------------+
         |
         v
+---------------------------+
| Dense: 3 neurônios        |
| activation: softmax       |
+---------------------------+
         |
         v
saída: [p_premium, p_medium, p_basic]
       (probabilidades que somam ~1)
```

---

## Por que esses números?

```
inputShape: [7]     ---> combina com cada linha de inputXs
units: 80           ---> camada oculta “larga” o suficiente para brincar com padrões
units: 3 + softmax  ---> uma probabilidade por classe (multiclasse)
```

- **ReLU** na oculta: zera entradas negativas (comportamento não linear comum).
- **Softmax** na saída: transforma 3 números crus em **probabilidades**.
- **categoricalCrossentropy**: loss típica quando o rótulo é one-hot e a saída é softmax.
- **Adam**: otimizador padrão que costuma funcionar bem sem ajuste fino.

---

## Fluxograma: `trainModel`

```
                    +------------------+
inputXs (N x 7)     | tf.sequential()  |
outputYs (N x 3)    | add dense 80     |
        |           | add dense 3      |
        +---------->| compile(...)     |
                    | fit(...)         |
                    +--------+---------+
                             |
                             v
                    +------------------+
                    | model treinado   |
                    +------------------+
```

Detalhes do `fit` no código:

```
model.fit(inputXs, outputYs, {
  epochs: 100,      // passa várias vezes pelo dataset pequeno
  shuffle: true,   // ordem diferente a cada época
  verbose: 0        // menos barulho no terminal
})
```

Dataset **minúsculo** (3 exemplos): serve para **aprender a API**, não para ML em produção.

---

## Fluxograma: `predict`

```
pessoaTensorNormalizado (1 x 7)
        |
        v
tf.tensor2d(pessoa)
        |
        v
model.predict(tfInput)
        |
        v
pred.array()  --->  [[ p0, p1, p2 ]]
        |
        v
mapear índice + prob  ---> ordenar por prob decrescente
        |
        v
string "premium (xx%)" etc.
```

---

## Ligação treino → inferência

```
+------------------+       mesmo formato        +------------------+
| tensor durante   |   ======================>  | tensor na        |
| treino (cada     |        7 colunas           | predição (1 linha)|
| linha = pessoa)  |                            |                  |
+------------------+                            +------------------+
```

Se você mudar a ordem das colunas ou a normalização da idade só na predição, o modelo **não** faz sentido estatístico.

---

## Próximo passo

[05-como-executar-e-dicas.md](./05-como-executar-e-dicas.md)
