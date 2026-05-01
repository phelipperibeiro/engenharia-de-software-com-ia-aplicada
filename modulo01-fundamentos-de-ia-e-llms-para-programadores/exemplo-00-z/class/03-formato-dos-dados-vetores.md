# 03 — Formato dos dados (7 números por pessoa)

O modelo não recebe texto (“verde”, “Curitiba”). Ele recebe um **vetor fixo de tamanho 7**:

```
posição   significado
-------   -----------
   0      idade normalizada entre 0 e 1 (min-max no conjunto de exemplo)
  1-3     cor em one-hot: [azul, vermelho, verde]
  4-6     cidade em one-hot: [São Paulo, Rio, Curitiba]
```

---

## Diagrama do vetor de entrada

```
índice:    [  0  ][ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ]
           +-----+---+---+---+---+---+---+
           | idade | azul | verm | verde | SP | RJ | Curitiba |
           +-----+---+---+---+---+---+---+
             ^           ^           ^
             |           |           |
          número    soma 1          soma 1
          0..1      neste bloco     neste bloco
                    (uma cor)       (uma cidade)
```

Regra do **one-hot**: em cada grupo (cores, cidades), **exatamente um** valor é `1` e os outros `0`.

---

## Exemplo numérico (treino)

No código, `tensorPessoasNormalizado` tem 3 linhas (3 pessoas fictícias):

```
Erick:  [0.33, 1,0,0, 1,0,0]   -> cor azul, SP
Ana:    [0,    0,1,0, 0,1,0]   -> vermelho, Rio
Carlos: [1,    0,0,1, 0,0,1]   -> verde, Curitiba
```

Idades foram mapeadas para [0,1] usando min=25 e max=40 no comentário do arquivo (valores didáticos).

---

## Rótulos (saída esperada) — também one-hot

Três classes → três neurônios na saída com **softmax**:

```
rótulo (humanamente)    vetor [premium, medium, basic]
--------------------    ------------------------------
premium                 [1, 0, 0]
medium                  [0, 1, 0]
basic                   [0, 0, 1]
```

```
                    +---------+
labelsNomes  --->   | premium |  índice 0
                    | medium  |  índice 1
                    | basic   |  índice 2
                    +---------+
```

---

## Predição (novo exemplo “zé”)

Antes de chamar `predict`, o código monta **manualmente** o mesmo formato de 7 números para:

- idade 28 normalizada com min 25 e max 40 → `(28-25)/(40-25) = 0.2`
- cor verde → `[0,0,1]`
- Curitiba → `[0,0,1]`

Isso é importante: **a mesma normalização e o mesmo esquema one-hot** do treino deve ser repetido na inferência; senão o modelo recebe “outro idioma” de números.

```
pessoa bruta (objeto)          pessoaTensorNormalizado (7 números)
---------------------          ------------------------------------
idade, cor, cidade      -->    sempre [ idade_norm | cor x3 | cidade x3 ]
```

---

## Próximo passo

[04-arquitetura-treino-e-predicao.md](./04-arquitetura-treino-e-predicao.md)
