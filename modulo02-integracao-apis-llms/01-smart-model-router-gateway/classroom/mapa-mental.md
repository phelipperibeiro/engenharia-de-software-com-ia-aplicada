# Mapa mental — Smart Model Router Gateway

## Visão em árvore (texto)

```
Smart Model Router Gateway
│
├── 🎯 Objetivo da aula
│   ├── Integrar API de LLM via OpenRouter
│   ├── Rotear entre múltiplos modelos (não um fixo)
│   └── Gateway HTTP mínimo (Fastify)
│
├── 🌐 OpenRouter (openrouter.ai) — executa os LLMs
│   ├── Hub: 400+ modelos, 60+ provedores, 1 API key
│   ├── Cadastro → créditos → OPENROUTER_API_KEY
│   ├── Slug: provedor/modelo:variante (:free na aula)
│   ├── SDK: @openrouter/sdk → chat.send()
│   ├── Metadados: httpReferer, xTitle
│   ├── models[] + provider.sort (price/throughput/latency)
│   └── Detalhes: classroom/openrouter.md
│
├── 🔀 Roteamento (provider.sort)
│   ├── by: price → modelo mais barato
│   ├── by: throughput → maior vazão
│   ├── by: latency → menor latência
│   ├── partition: none
│   └── models[] = lista de candidatos (fallback em ordem)
│
├── 📁 Arquitetura do projeto
│   ├── config.ts ────────── env, models, sort, prompts
│   ├── openrouterService.ts ─ cliente + generate()
│   ├── server.ts ─────────── POST /chat + validação
│   ├── index.ts ───────────── bootstrap listen :3000
│   └── tests/router.e2e.test.ts ─ inject + assert model
│
├── 🛣️ Fluxo POST /chat
│   ├── Body: { question } (min 5 chars)
│   ├── Validação Fastify schema
│   ├── generate(question)
│   ├── OpenRouter escolhe modelo
│   └── Response: { model, content }
│
├── ⚙️ Parâmetros de geração
│   ├── systemPrompt + user message
│   ├── temperature: 0.2
│   ├── maxTokens: 100
│   └── stream: false
│
├── 🧪 Testes E2E
│   ├── API key real (.env)
│   ├── app.inject() sem rede externa ao bind
│   ├── Teste 1: sort price → arcee-ai/...:free
│   └── Teste 2: sort throughput → nvidia/nemotron-...:free
│
├── 🛠️ Comandos
│   ├── npm run dev
│   └── npm test
│
└── ➡️ Evolução no Módulo 02
    ├── 03 medical appointment
    ├── 04 song highlights
    ├── 05 safeguard / prompt injection
    ├── 06 RAG + Neo4j
    └── 07 doc analysis
```

---

## Mapa mental (visão radial)

```
                         +-----------------------------+
                         |  Smart Model Router Gateway |
                         +--------------+--------------+
                                        |
        +---------------+---------------+---------------+---------------+
        |               |               |               |               |
   +----+----+     +----+----+     +----+----+     +----+----+     +----+----+
   | Objetivo|     |OpenRouter|    |  Sort   |     | Camadas |     | /chat   |
   +----+----+     +----+----+     +----+----+     +----+----+     +----+----+
        |               |               |               |               |
   unificado        API key          price          config.ts      question
   roteamento       models[]      throughput   openrouterSvc    min 5 chars
   POST /chat       provider.sort   latency      server.ts       LLMResponse
                    httpReferer      partition     index.ts        model+content
                    xTitle           none
        |               |               |               |               |
        +---------------+---------------+---------------+---------------+
                                        |
                    +-------------------+-------------------+
                    |                   |                   |
               +----+----+         +----+----+         +----+----+
               | Testes  |         | Modelos |         |Modulo 02|
               |   E2E   |         |  free   |         | futuro  |
               +----+----+         +----+----+         +----+----+
                    |                   |                   |
              app.inject()      arcee (price)          LangGraph
              API real          nvidia (throughput)   Safeguard
              config custom                             RAG Neo4j
```

---

## Diagrama de sequência (POST /chat)

```
  Cliente          Fastify /chat       OpenRouterService       OpenRouter API
     |                    |                      |                      |
     |  POST {question}   |                      |                      |
     |------------------->|                      |                      |
     |                    |  valida schema       |                      |
     |                    |--------+             |                      |
     |                    |        |             |                      |
     |                    |<-------+             |                      |
     |                    |  generate(question) |                      |
     |                    |--------------------->|                      |
     |                    |                      | chat.send(           |
     |                    |                      |   models, sort, msg) |
     |                    |                      |--------------------->|
     |                    |                      |                      |
     |                    |                      |     escolhe modelo   |
     |                    |                      |     por sort.by      |
     |                    |                      |                      |
     |                    |                      |  choices + model     |
     |                    |                      |<---------------------|
     |                    |  { model, content }|                      |
     |                    |<---------------------|                      |
     |      JSON 200      |                      |                      |
     |<-------------------|                      |                      |
     |                    |                      |                      |
```

---

## Diagrama de decisão do roteador

```
                        +-------------+
                        | POST /chat  |
                        +------+------+
                               |
                               v
                      +--------+--------+
                      | question valida?|
                      +--------+--------+
                          |         |
                     nao  |         |  sim
                          v         v
                   +----------+  +----------------------+
                   | 4xx      |  | OpenRouterService    |
                   | validacao|  | .generate()          |
                   +----------+  +----------+-----------+
                                            |
                                            v
                               +------------+-------------+
                               | provider.sort.by ?     |
                               +------------+-------------+
                                    |    |    |
                    +---------------+    |    +---------------+
                    |                    |                    |
                    v                    v                    v
            +---------------+   +---------------+   +---------------+
            | price         |   | throughput    |   | latency       |
            | modelo mais   |   | maior vazao   |   | menor latencia|
            | barato        |   |               |   |               |
            | arcee-ai/...  |   | nvidia/...    |   | (dinamico)    |
            +-------+-------+   +-------+-------+   +-------+-------+
                    |                   |                   |
                    +-------------------+-------------------+
                                        |
                                        v
                            +-----------------------+
                            | retorna model+content |
                            +-----------------------+
```

---

## Ligação arquivo ↔ conceito

| Conceito | Onde no código |
|----------|----------------|
| Lista de modelos | `config.models` |
| Critério de roteamento | `config.provider.sort.by` |
| Chamada à API | `OpenRouterService.generate()` |
| Contrato HTTP | `server.ts` → `POST /chat` |
| Prova do roteamento | `tests/router.e2e.test.ts` |
