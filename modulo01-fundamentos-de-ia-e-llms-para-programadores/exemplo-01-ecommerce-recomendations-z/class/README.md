# Material de estudo — E-commerce + TensorFlow.js

Esta pasta é **documentação didática** (não é código executável). Ela resume o que existe em `exemplo-01-ecommerce-recomendations-z/` e como as peças conversam.

**Público:** dev júnior estudando JavaScript no navegador, módulos ES, Web Workers e TensorFlow.js.

---

## Índice

| Arquivo | Conteúdo |
|--------|-----------|
| [01-introducao.md](./01-introducao.md) | O que existe na pasta, estrutura `parte01` … `parte05`, dados em JSON |
| [02-do-npm-start-ao-navegador.md](./02-do-npm-start-ao-navegador.md) | Browser Sync, `index.html` → `src/index.js`, por que `type="module"` |
| [03-arquitetura-service-view-controller.md](./03-arquitetura-service-view-controller.md) | Serviços, views, controllers e papel de cada pasta em `src/` |
| [04-eventos-e-worker.md](./04-eventos-e-worker.md) | Custom Events na UI, `WorkerController`, mensagens para o worker |
| [05-pipeline-de-ml-no-worker.md](./05-pipeline-de-ml-no-worker.md) | Contexto, vetores, dataset, rede densa, recomendação (fluxogramas) |
| [06-evolucao-parte01-parte05.md](./06-evolucao-parte01-parte05.md) | O que muda em `modelTrainingWorker.js` em cada etapa |

---

## Mapa mental (uma página)

```
                         npm start (browser-sync)
                                    |
                                    v
+------------------+     GET /index.html      +------------------+
|   Navegador      | ----------------------> | Servidor estático |
+------------------+                         | (pasta do projeto)|
        |                                    +------------------+
        | <script type="module" src="./src/index.js">
        v
+------------------+     import / DOM          +------------------+
|   src/index.js   | -----------------------> | Controllers +    |
| (ponto de entrada)|                         | Views + Services   |
+------------------+                         +------------------+
        |
        | new Worker('/src/workers/modelTrainingWorker.js')
        v
+------------------+   postMessage / onmessage   +------------------+
| Thread principal | <-----------------------> | Web Worker       |
| (UI responsiva)  |                             | TensorFlow.js    |
+------------------+                             +------------------+
```

Leia os capítulos na ordem se for a primeira vez; use o **06** como “cola” quando comparar `parte01` … `parte05`.
