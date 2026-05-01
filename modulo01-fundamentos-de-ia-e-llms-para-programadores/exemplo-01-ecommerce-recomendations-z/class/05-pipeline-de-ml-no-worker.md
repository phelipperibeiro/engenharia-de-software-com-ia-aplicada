# 05 — Pipeline de ML no worker (visão didática)

Este capítulo descreve a versão **completa** (como em `parte05`): rede neural + recomendação. As partes anteriores implementam **subconjuntos** desse pipeline — ver [06-evolucao-parte01-parte05.md](./06-evolucao-parte01-parte05.md).

---

## Visão geral (fluxograma)

```
  users (JSON)              products.json
       \                         /
        \                       /
         v                     v
    +---------+         +-----------+
    | makeContext        | (fetch no worker)
    +---------+         +-----------+
         \               /
          v             v
      +-----------------------+
      | contexto: min/max      |
      | índices cor/categoria |
      | idade média por produto|
      +-----------+-----------+
                  |
                  v
      +-----------------------+
      | encodeProduct         |
      | encodeUser            |
      +-----------+-----------+
                  |
                  v
      +-----------------------+
      | createTrainingData    |
      | pares (u,p) label 0/1 |
      +-----------+-----------+
                  |
                  v
      +-----------------------+
      | configureNeuralNet    |
      | + model.fit           |
      +-----------+-----------+
                  |
                  v
      +-----------------------+
      | recommend(user)       |
      | predict + ordenar     |
      +-----------------------+
```

---

## 1) Contexto (`makeContext`)

Objetivo: transformar listas brutas em **regras estáveis** para números:

- `minAge`, `maxAge`, `minPrice`, `maxPrice` → normalização.
- lista única de **categorias** e **cores** → índices para **one-hot encoding**.
- para cada produto, **idade média dos compradores** (sinal de perfil).

```
produtos + usuários
        |
        v
+---------------------------+
| cores únicas  -> índice    |
| categorias    -> índice    |
| faixas idade/preço         |
+---------------------------+
```

---

## 2) Codificação (`encodeProduct` / `encodeUser`)

O modelo não lê texto; lê **vetores**.

- **Produto:** concatena partes: preço normalizado (ponderado), “idade do perfil do produto”, one-hot de categoria, one-hot de cor (com pesos `WEIGHTS`).
- **Usuário com histórico:** média dos vetores dos produtos que já comprou (vetor de “gosto”).
- **Usuário sem compras (cold start):** principalmente idade; resto zerado (na versão completa).

```
Produto bruto                Vetor numérico (1D)
-----------                  --------------------
preço, idade média   --->    [ ... números ... ]
categoria, cor       --->    one-hot + pesos
```

---

## 3) Dataset (`createTrainingData`)

Para cada usuário **com compras**, para **cada produto** do catálogo:

- entrada = `concat(vetor_usuario, vetor_produto)`
- rótulo = `1` se comprou aquele produto, senão `0`

Isso é **classificação binária**: “este par (usuário, produto) é positivo?”

```
para cada usuário U com compras
   para cada produto P
       X = [ encodeUser(U) || encodeProduct(P) ]
       y = 1 se U comprou P else 0
```

---

## 4) Rede (`configureNeuralNetAndTrain`)

Arquitetura típica do exemplo:

```
entrada (inputDim = 2 * dimensão do vetor produto)
        |
        v
   [ Dense 128 relu ]
        |
        v
   [ Dense 64 relu ]
        |
        v
   [ Dense 32 relu ]
        |
        v
   [ Dense 1 sigmoid ]  ---> probabilidade entre 0 e 1
```

- **Sigmoid** na saída combina com **binaryCrossentropy**.
- Durante `fit`, o worker pode enviar `training:log` a cada época (loss, accuracy).

---

## 5) Recomendar (`recommend`)

Depois do treino:

1. Codifica o usuário atual (`encodeUser`).
2. Para cada produto, monta a mesma entrada usada no treino: `[ userVector || productVector ]`.
3. `model.predict` em batch.
4. Ordena produtos pelo **score** e devolve via `postMessage`.

```
user selecionado
      |
      v
 encodeUser(user)
      |
      v
 para cada produto pré-calculado (productVectors)
      concat(userVec, productVec)
      |
      v
 predict --> scores[]
      |
      v
 sort por score descendente
```

---

## Onde ler no código

Arquivo principal: `src/workers/modelTrainingWorker.js` (em `parte05` está comentado linha a linha para estudo).

---

## Próximo passo

[06-evolucao-parte01-parte05.md](./06-evolucao-parte01-parte05.md)
