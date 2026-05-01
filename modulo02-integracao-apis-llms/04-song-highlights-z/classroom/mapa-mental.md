# Mapa mental — Song Highlights (Aula 04)

## Visão em árvore (texto)

```
Song Highlights — Memória (Aula 04)
│
├── Objetivo da aula
│   ├── Recomendador musical conversacional
│   ├── Memória entre mensagens (thread)
│   ├── Perfil persistente (userId)
│   └── Sumarização de histórico longo
│
├── OpenRouter
│   ├── chat → ChatResponseSchema
│   ├── summarize → SummarySchema
│   ├── generateStructured + Zod
│   └── Detalhes: classroom/openrouter.md
│
├── LangGraph
│   ├── 3 nós: chat, savePreferences, summarize
│   ├── Arestas condicionais (edgeConditions)
│   ├── compile(checkpointer, store)
│   └── Detalhes: classroom/langgraph.md
│
├── Memória dupla
│   ├── PostgreSQL — thread_id (checkpointer)
│   ├── SQLite — user_id (preferências)
│   └── Detalhes: classroom/memoria.md
│
├── Nós
│   ├── chat ── LLM + flags + recomendações
│   ├── savePreferences ── merge SQLite
│   └── summarize ── LLM + RemoveMessage + storeSummary
│
├── Prompts v1
│   ├── chatResponse.ts (extrair só do usuário)
│   └── summarization.ts (consolidar conversa)
│
├── Infra
│   ├── docker-compose → PostgreSQL :5432
│   └── preferences.db (SQLite)
│
├── CLI (index.ts)
│   ├── --user <id>
│   ├── thread_id único
│   └── loop interativo
│
├── Config
│   ├── maxMessagesToSummary
│   ├── memory.dbUri
│   └── OPENROUTER_API_KEY
│
├── Testes E2E
│   ├── test-preferences.db
│   └── vários it.skip para estudo
│
└── Evolução curso
    ├── 01 OpenRouter
    ├── 02 grafo
    ├── 03 medical
    └── 05+ safeguard, RAG
```

---

## Mapa mental (visão radial)

```
                         +-----------------------------+
                         |  Song Highlights + Memória  |
                         +--------------+--------------+
                                        |
        +---------------+---------------+---------------+---------------+
        |               |               |               |               |
   +----+----+     +----+----+     +----+----+     +----+----+     +----+----+
   | Chatbot |     |OpenRouter|    |LangGraph|     | Memória |     | Sumário |
   +----+----+     +----+----+     +----+----+     +----+----+     +----+----+
        |               |               |               |               |
   música PT-BR     2 chamadas LLM   3 nós          PG + SQLite    RemoveMessage
   recomendações    structured       condicional    thread/user    manter 2 msgs
        |               |               |               |               |
        +---------------+---------------+---------------+---------------+
                                        |
                              +---------+---------+
                              |                   |
                         +----+----+         +----+----+
                         |  CLI    |         | Docker  |
                         | index.ts|         | postgres|
                         +---------+         +---------+
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
                         |      chat      |  (LLM)
                         +--------+-------+
                                  |
            +---------------------+---------------------+
            |                     |                     |
    extractedPreferences    needsSummarization         senão
            |                     |                     |
            v                     |                     v
   +------------------+           |                  +-------+
   | savePreferences  |           |                  |  END  |
   | (SQLite merge)   |           |                  +-------+
   +--------+---------+           |
            |                     |
            +----------+----------+
                       |
              needsSummarization?
                       |
              +--------+--------+
              |                 |
              v                 v
       +-------------+      +-------+
       |  summarize  |      |  END  |
       | (LLM+limpa) |      +-------+
       +------+------+
              |
              v
          +-------+
          |  END  |
          +-------+
```

---

## Diagrama de sequência (uma mensagem)

```
  Usuário CLI          LangGraph              chat              SQLite/PG
      |                    |                   |                    |
      | invoke(msg)        |                   |                    |
      |------------------->|                   |                    |
      |                    | restaura state    |                    |
      |                    |--------------------------------------->|
      |                    |                   | getBasicInfo       |
      |                    |                   |------------------->|
      |                    |                   | LLM OpenRouter     |
      |                    |                   |                    |
      |                    | savePreferences?  |                    |
      |                    |------------------>| mergePreferences   |
      |                    |                   |------------------->|
      |                    | summarize?        |                    |
      |                    |------------------>| storeSummary       |
      |                    |                   | RemoveMessage antigas|
      |                    |                   |                    |
      | resposta IA        |                   |                    |
      |<-------------------|                   |                    |
```

---

## Duas memórias (ASCII)

```
  userId: "erickwendel"
        |
        +--- thread_id: "erick-1730..."  ----->  PostgreSQL
        |         |                              (mensagens do grafo)
        |         +--- msg1, msg2, msg3...
        |
        +--- user_id: "erickwendel"  --------->  SQLite
                  |                              (nome, rock, bandas...)
                  +--- perfil consolidado
```

---

## Roteamento após chat

```
                    +------------------+
                    | saída do chat    |
                    +--------+---------+
                             |
              +--------------+--------------+
              |                             |
    extractedPreferences?          needsSummarization?
              |                             |
              v                             v
       savePreferences                  summarize
              |                             |
              +-------------+---------------+
                            |
                     (depois de save)
                            |
                   needsSummarization?
                            |
                     summarize ou END
```

---

## Ligação arquivo ↔ conceito

| Conceito | Onde no código |
|----------|----------------|
| Grafo + persistência | `src/graph/graph.ts` |
| Montagem deps | `src/graph/factory.ts` |
| Chat + flags | `src/graph/nodes/chatNode.ts` |
| Salvar preferências | `savePreferencesNode.ts` |
| Sumarizar | `summarizationNode.ts` |
| Rotas | `edgeConditions.ts` |
| Perfil SQLite | `preferencesService.ts` |
| Thread PostgreSQL | `memoryService.ts` |
| LLM | `openRouterService.ts` |
| Limiar sumarização | `config.ts` → `maxMessagesToSummary` |
| CLI | `index.ts` |
| Testes | `tests/chat.e2e.test.ts` |

---

## Comparação: Aulas 01–04

```
+--------+----------+-------------+-------------+------------------+
|        | 01       | 02          | 03          | 04               |
+--------+----------+-------------+-------------+------------------+
| Foco   | roteamento| grafo local | domínio+LLM | memória          |
| API    | HTTP     | HTTP        | HTTP        | CLI              |
| LLM    | 1x texto | não         | 2x structured| 2x structured   |
| DB     | não      | não         | não         | PG + SQLite      |
| Nós    | 1 serviço| 5 nós regra | 4 nós       | 3 nós + memória  |
+--------+----------+-------------+-------------+------------------+
```
