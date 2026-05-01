# Mapa mental — Medical Appointment (Aula 03)

## Visão em árvore (texto)

```
Medical Appointment (Aula 03)
│
├── Objetivo da aula
│   ├── LangGraph + OpenRouter juntos
│   ├── Agendar e cancelar consultas (PT-BR)
│   ├── Prompt chaining (3 etapas)
│   └── Saída estruturada (Zod)
│
├── OpenRouter
│   ├── ChatOpenAI + baseURL openrouter.ai/api/v1
│   ├── generateStructured + providerStrategy
│   ├── IntentSchema + MessageSchema
│   ├── modelKwargs: models[], provider.sort
│   └── Detalhes: classroom/openrouter.md
│
├── LangGraph
│   ├── Estado: intent, slots, actionSuccess, messages
│   ├── identifyIntent → schedule|cancel → message
│   ├── unknown/error → message direto
│   ├── Factory: createXNode(deps)
│   └── Detalhes: classroom/langgraph.md
│
├── Prompts v1
│   ├── identifyIntent.ts (classificador + extração)
│   └── messageGenerator.ts (recepcionista)
│
├── AppointmentService
│   ├── 3 profissionais (Cardio, Derma, Neuro)
│   ├── agenda em memória (array)
│   ├── bookAppointment / cancelAppointment
│   └── checkAvailability
│
├── Nós
│   ├── identifyIntentNode ── LLM
│   ├── schedulerNode ─────── código
│   ├── cancellerNode ─────── código
│   └── messageGeneratorNode ─ LLM
│
├── API HTTP
│   ├── POST /chat (question min 10)
│   └── resposta: estado JSON completo
│
├── Testes E2E
│   ├── cancel success (ativo)
│   ├── schedule success (skip)
│   └── precisa OPENROUTER_API_KEY
│
├── Comandos
│   ├── npm run dev
│   ├── npm run test:e2e
│   └── npm run langgraph:serve
│
└── Evolução curso
    ├── 01 OpenRouter puro
    ├── 02 grafo sem LLM
    ├── 04+ outros domínios
    ├── 05 safeguard
    └── 06 RAG Neo4j
```

---

## Mapa mental (visão radial)

```
                         +-----------------------------+
                         |   Medical Appointment 03    |
                         +--------------+--------------+
                                        |
        +---------------+---------------+---------------+---------------+
        |               |               |               |               |
   +----+----+     +----+----+     +----+----+     +----+----+     +----+----+
   | Objetivo|     |OpenRouter|    |LangGraph|     | Prompts |     | Domínio |
   +----+----+     +----+----+     +----+----+     +----+----+     +----+----+
        |               |               |               |               |
   agendar/cancel  structured      4 nós          v1 JSON        3 médicos
   prompt chain     Zod x2          conditional    intent/msg     agenda RAM
        |               |               |               |               |
        +---------------+---------------+---------------+---------------+
                                        |
                    +-------------------+-------------------+
                    |                   |                   |
               +----+----+         +----+----+         +----+----+
               | Fastify |         | Testes  |         | Aulas   |
               | /chat   |         |  E2E    |         | 01 02   |
               +----+----+         +----+----+         +----+----+
```

---

## Diagrama do grafo (arestas)

```
                              +-------+
                              | START |
                              +---+---+
                                  |
                                  v
                         +----------------+
                         | identifyIntent |  (LLM + IntentSchema)
                         +--------+-------+
                                  |
              +-------------------+-------------------+
              |                   |                   |
        intent=schedule     intent=cancel      unknown / error
              |                   |                   |
              v                   v                   |
       +-----------+       +-----------+              |
       | schedule  |       |  cancel   |              |
       | (código)  |       | (código)  |              |
       +-----+-----+       +-----+-----+              |
             |                   |                   |
             +---------+---------+                   |
                       |                             |
                       v                             v
                         +----------------+
                         |    message     |  (LLM + MessageSchema)
                         +--------+-------+
                                  |
                                  v
                              +-------+
                              |  END  |
                              +-------+
```

---

## Diagrama de sequência (POST /chat)

```
  Cliente           Fastify              LangGraph                    Serviços
     |                 |                     |                            |
     | POST {question} |                     |                            |
     |---------------->|                     |                            |
     |                 | invoke(messages)    |                            |
     |                 |-------------------->|                            |
     |                 |                     | identifyIntent             |
     |                 |                     |-----------> OpenRouter LLM |
     |                 |                     |<----------- IntentSchema   |
     |                 |                     |                            |
     |                 |                     | schedule OU cancel         |
     |                 |                     |-----------> Appointment  |
     |                 |                     |<----------- success/error  |
     |                 |                     |                            |
     |                 |                     | message                    |
     |                 |                     |-----------> OpenRouter LLM |
     |                 |                     |<----------- MessageSchema  |
     |                 |                     |                            |
     |                 | estado JSON         |                            |
     |                 |<--------------------|                            |
     |<----------------|                     |                            |
```

---

## Prompt chaining (3 etapas)

```
  +------------------+     +------------------+     +------------------+
  | Etapa 1          |     | Etapa 2          |     | Etapa 3          |
  | ENTENDER         | --> | AGIR             | --> | COMUNICAR        |
  | identifyIntent   |     | schedule|cancel  |     | message          |
  | LLM + Zod        |     | TypeScript puro  |     | LLM + Zod        |
  +------------------+     +------------------+     +------------------+
         |                          |                          |
    intent, slots              actionSuccess              AIMessage
    professionalId             appointmentData            amigável PT
```

---

## Quem faz o quê (LLM vs código)

```
                    +------------------+
                    |  Entrada usuário |
                    +--------+---------+
                             |
              +--------------+--------------+
              |                             |
              v                             v
     +----------------+            +----------------+
     | LLM (OpenRouter)|            | Código (TS)    |
     +----------------+            +----------------+
     | identifyIntent |            | schedule       |
     | message        |            | cancel         |
     +----------------+            +----------------+
              |                             |
              |         +-------------------+
              |         |
              v         v
     +----------------------------------------+
     | AppointmentService (memória)           |
     | profissionais + consultas + validação  |
     +----------------------------------------+
```

---

## Cenários do nó `message`

```
scenario = {intent}_{success|error}

  schedule_success   confirmar consulta
  schedule_error     horário indisponível / validação
  cancel_success     cancelamento ok
  cancel_error       agendamento não encontrado
  unknown_*          só ajuda com agendar/cancelar
```

---

## Ligação arquivo ↔ conceito

| Conceito | Onde no código |
|----------|----------------|
| Montagem do grafo | `src/graph/graph.ts` |
| Wiring deps | `src/graph/factory.ts` |
| Classificar intenção | `nodes/identifyIntentNode.ts` + `prompts/v1/identifyIntent.ts` |
| Agendar | `nodes/schedulerNode.ts` |
| Cancelar | `nodes/cancellerNode.ts` |
| Resposta final | `nodes/messageGeneratorNode.ts` + `prompts/v1/messageGenerator.ts` |
| LLM estruturado | `services/openRouterService.ts` |
| Regras de agenda | `services/appointmentService.ts` |
| Modelo / API key | `config.ts` |
| HTTP | `server.ts` |
| E2E | `tests/router.e2e.test.ts` |

---

## Comparação: Aulas 01 → 02 → 03

```
+--------+----------------------------+----------------------------+----------------------------+
|        | Aula 01                    | Aula 02                    | Aula 03                    |
+--------+----------------------------+----------------------------+----------------------------+
| Foco   | Rotear modelo              | Grafo local                | Grafo + LLM + negócio      |
| LLM    | OpenRouter SDK             | Nenhum                     | OpenRouter via LangChain   |
| Saída  | { model, content }         | string output              | estado JSON completo       |
| Rota   | price/throughput           | upper/lower/unknown        | schedule/cancel/unknown    |
| Testes | API key                    | sem API                    | API key                    |
+--------+----------------------------+----------------------------+----------------------------+
```
