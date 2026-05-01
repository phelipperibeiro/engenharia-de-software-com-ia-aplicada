# 04 — Eventos na página e Web Worker

## Dois “tipos” de eventos no projeto

### 1) Eventos DOM customizados (`events` em `constants.js`)

Usados **na thread principal** (`document.dispatchEvent` / `addEventListener`).

Exemplos de nomes: `training:train`, `training:complete`, `recommendations:ready`.

```
   Componente A                    Componente B
        |                               ^
        |   dispatchTrainModel(data)    |
        +-------------------------------+
                    |
              document (Events)
```

Objetivo: **vários controllers** reagem sem imports diretos uns dos outros.

### 2) Mensagens do worker (`workerEvents`)

Usadas em **`postMessage`** entre página e worker. Os nomes são **strings diferentes** de alguns eventos DOM de propósito (ex.: `train:model` no worker vs fluxo UI).

```
Página (WorkerController)          Worker (modelTrainingWorker.js)
        |                                    |
        |  postMessage({ action, ... })      |
        +----------------------------------->|
        |                                    |
        |  postMessage({ type, ... })        |
        |<-----------------------------------+
        |
        v
   converte em CustomEvent quando faz sentido (ex.: progresso, recomendações prontas)
```

---

## WorkerController (papel central)

Resumo do que ele faz:

```
+------------------+     registra listeners na classe Events
| WorkerController |
+------------------+
        |
        |  worker.postMessage({ action: workerEvents.trainModel, users })
        |
        |  worker.onmessage = (event) => {
        |      switch event.data.type:
        |        progressUpdate -> dispatchProgressUpdate
        |        trainingComplete -> dispatchTrainingComplete
        |        trainingLog -> TF Vis logs
        |        recommend -> dispatchRecommendationsReady
        |  }
        v
+------------------+
| Events (DOM)     |  atualiza ModelTrainingView, TFVisor, etc.
+------------------+
```

Regra importante: **recomendar só depois de treinar** — o controller mantém um flag (`alreadyTrained`) e ignora recomendação se o modelo ainda não terminou.

---

## Esquema mensagem UI → worker

Quando a UI quer treinar:

```
dispatchTrainModel(users)     // DOM event
        |
        v
WorkerController.triggerTrain(users)
        |
        v
postMessage({
  action: 'train:model',      // workerEvents.trainModel
  users: [ ... ]
})
```

No worker:

```javascript
self.onmessage = e => {
  const { action, ...data } = e.data;
  handlers[action](data);   // trainModel({ users }) ou recommend({ user })
};
```

---

## Esquema worker → UI (progresso e resultado)

```
worker                           página
  |                                |
  | type: progress:update          |
  +------------------------------->| barra de progresso
  |                                |
  | type: training:log             |
  +------------------------------->| tfjs-vis / logs
  |                                |
  | type: training:complete        |
  +------------------------------->| habilita botão de recomendação
  |                                |
  | type: recommend (payload...)   |
  +------------------------------->| lista ordenada por score
```

---

## Por que worker?

TensorFlow.js pode **bloquear** a thread principal se o treino for pesado. O worker roda em **thread separada**: a UI continua respondendo (com limitações: você não manipula DOM de dentro do worker).

---

## Próximo passo

[05-pipeline-de-ml-no-worker.md](./05-pipeline-de-ml-no-worker.md) — o que o worker faz com os dados.
