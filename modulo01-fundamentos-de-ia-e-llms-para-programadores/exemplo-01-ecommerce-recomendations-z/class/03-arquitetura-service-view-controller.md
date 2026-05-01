# 03 — Arquitetura: Service, View, Controller + Events

Este projeto não usa um framework (React, Vue, etc.). A organização lembra **MVC adaptado ao browser**:

```
                    +-----------+
                    |  Events   |  (Canal global na página: CustomEvent)
                    +-----------+
                          ^
          disparos |      | escuta
                   |      |
    +--------------+------+--------------+
    |              |      |              |
    v              v      v              v
+--------+   +----------+   +----------+
| View   |   |Controller|   | Service  |
| (DOM)  |<->| (cola)   |<->| (dados)  |
+--------+   +----------+   +----------+
```

## Service (`src/service/`)

**Responsabilidade:** acesso a dados.

- `UserService`: lê `users.json`, mantém cópia em `sessionStorage` (chave tipo `ew-academy-users`), expõe `getUsers()`, `updateUser()`, etc.
- `ProductService`: catálogo / produtos conforme a parte do curso.

```
Controller precisa de dados
        |
        v
   UserService.getUsers()
        |
        v
  sessionStorage ou fetch inicial
```

## View (`src/view/`)

**Responsabilidade:** HTML/DOM e templates.

- Classes como `UserView`, `ProductView`, `ModelTrainingView` manipulam elementos (`document.getElementById`, etc.).
- Alguns trechos de HTML ficam em `view/templates/*.html` e são clonados/inseridos quando necessário.

```
Usuário clica no botão "Train"
        |
        v
   ModelTrainingView chama callback registrado
        |
        v
   Controller decide o que fazer (pedir dados, disparar evento)
```

## Controller (`src/controller/`)

**Responsabilidade:** orquestrar.

- Liga **eventos de UI** (views) a **serviços** e ao **barramento de eventos** (`Events`).
- Ex.: `ModelTrainingController`: quando o usuário confirma treino, busca usuários atualizados e dispara `dispatchTrainModel(users)` para quem estiver ouvindo (no caso, o `WorkerController`).

```
View ("clique") ---> Controller ---> Service / Events.dispatch(...)
```

## Events (`src/events/`)

- **`constants.js`**: strings estáveis para nomes de eventos (`events.*` para a página, `workerEvents.*` para mensagens do worker).
- **`events.js`**: classe com métodos estáticos `onX` / `dispatchX` usando `CustomEvent` em `document`.

Isso **desacopla** quem envia de quem recebe (controller da UI não precisa conhecer detalhes do worker).

---

## Fluxo típico: treinar modelo

```
+---------------------+
| ModelTrainingView   |  usuário clica "Train Model"
+----------+----------+
           |
           v
+---------------------+
| ModelController     |  getUsers() via UserService
|                     |  dispatchTrainModel(users)
+----------+----------+
           |
           v
+---------------------+
| WorkerController    |  escuta onTrainModel
|                     |  postMessage({ action: train:model, users })
+----------+----------+
           |
           v
+---------------------+
| modelTrainingWorker |  trainModel(...)
+---------------------+
```

---

## Próximo passo

[04-eventos-e-worker.md](./04-eventos-e-worker.md) — detalhe das mensagens worker ↔ página.
