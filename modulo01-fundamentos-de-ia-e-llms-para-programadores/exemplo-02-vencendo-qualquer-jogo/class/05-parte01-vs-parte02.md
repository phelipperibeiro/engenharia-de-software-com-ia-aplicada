# 05 — DuckHunt-JS parte01 vs parte02

As duas pastas compartilham a mesma ideia (`main.js`, `machine-learning/main.js`, estrutura do jogo). A diferença principal está em **`machine-learning/worker.js`**.

---

## Comparação rápida

```
+-----------------------------+-----------------------------+
| parte01                     | parte02                     |
+-----------------------------+-----------------------------+
| Carrega modelo + labels     | Igual                       |
| Pré-processa imagem         | Igual                       |
| Roda inferência (execute)   | Igual                       |
| onmessage: debugger +       | onmessage: processPrediction|
| postMessage fixo (400,400)  | filtra score + classe kite  |
|                             | envia centro real da caixa  |
+-----------------------------+-----------------------------+
```

---

## Fluxo parte01 (didático / depuração)

```
inferência completa
        |
        v
   debugger   (pausa no DevTools se aberto)
        |
        v
postMessage({ x: 400, y: 400, score: 0 })   # valores fixos
```

Útil para **verificar** se o pipeline principal-thread ↔ worker ↔ modelo funciona, sem depender ainda do parser de caixas.

---

## Fluxo parte02 (comportamento “fechado”)

```
inferência
     |
     v
boxes, scores, classes
     |
     v
processPrediction(...)   # generator
     |
     v
vários postMessage({ type: 'prediction', x, y, score })
     (um por detecção que passou no filtro)
```

---

## `layout.js`

As versões de **`layout.js`** entre parte01 e parte02 são **as mesmas** na prática (HUD com score e coordenadas): o texto “Predictions” reflete `data.x` e `data.y` vindos do worker.

---

## Qual pasta estudar?

```
parte01  ---> entender carregamento do modelo e debugger
parte02  ---> entender detecção completa + threshold + classe
```

---

## Voltar ao índice

[class/README.md](./README.md)
