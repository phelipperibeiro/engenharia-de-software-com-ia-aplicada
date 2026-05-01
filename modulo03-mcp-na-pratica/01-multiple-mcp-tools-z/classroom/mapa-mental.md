# Mapa mental — Multiple MCP Tools (Aula 01)

## Visão em árvore (texto)

```
Multiple MCP Tools (Mod 03 / Aula 01)
│
├── Objetivo da aula
│   ├── Consumir vários MCP servers
│   ├── Tool híbrida (csv_to_json)
│   └── Agente multi-step (ETL + analytics)
│
├── MCP (consumer)
│   ├── MultiServerMCPClient
│   ├── filesystem MCP (read/write)
│   ├── MongoDB MCP (insert/query)
│   └── Detalhes: classroom/mcp.md
│
├── Tool local
│   └── csv_to_json (LangChain, não MCP)
│
├── LangGraph
│   ├── intentParser → agent → END
│   ├── estado: intent, fileContent, fileName
│   └── Detalhes: classroom/langgraph.md
│
├── OpenRouter
│   ├── intent: structured (IntentSchema)
│   ├── agent: tools + callbacks
│   └── Detalhes: classroom/openrouter.md
│
├── Pipeline (prompt steps 0-5)
│   ├── limpar Mongo
│   ├── CSV → JSON
│   ├── insert DB
│   ├── query analítica
│   └── report ./reports/
│
├── Infra
│   ├── MongoDB :27017
│   └── mongo-express :8081
│
├── API
│   └── POST /chat (question + CSV inline)
│
└── Dados
    ├── data/sales-complete.csv
    └── reports/*.txt
```

---

## Mapa mental (visão radial)

```
                         +-----------------------------+
                         |  Multiple MCP Tools — Aula 01|
                         +--------------+--------------+
                                        |
        +---------------+---------------+---------------+---------------+
        |               |               |               |               |
   +----+----+     +----+----+     +----+----+     +----+----+     +----+----+
   | LangGraph|    |  MCP    |     | Agent   |     | MongoDB |     |  CSV    |
   +----+----+     +----+----+     +----+----+     +----+----+     +----+----+
        |               |               |               |               |
   intent→agent    2 servers      tool calling      persist/query   csv_to_json
   IntentSchema    filesystem       steps 0-5         docker          inline
        |               |               |               |               |
        +---------------+---------------+---------------+---------------+
```

---

## Diagrama do grafo

```
                              +-------+
                              | START |
                              +---+---+
                                  |
                                  v
                         +------------------+
                         |  intentParser    |
                         | (LLM structured) |
                         +--------+---------+
                                  |
                           error? ├──► END
                                  |
                                  v
                         +------------------+
                         |      agent       |
                         | (LLM + all tools)|
                         +--------+---------+
                                  |
                                  v
                              +-------+
                              |  END  |
                              +-------+
```

---

## Agregação de tools

```
  getMCPTools()
        |
        +--- MultiServerMCPClient
        |         |
        |         +--- filesystem MCP → read_file, write_file, ...
        |         |
        |         +--- MongoDB MCP → insert, find, drop, ...
        |
        +--- getCSVTOJSONTool() → csv_to_json (local)

        |
        v
  [ ... todas as tools para createAgent ... ]
```

---

## Pipeline ETL (steps do agent)

```
  CSV na pergunta
        |
        v
  [0] Limpar collections Mongo
        |
        v
  [1] csv_to_json
        |
        v
  [2] write_file (opcional JSON)
        |
        v
  [3] Insert documentos
        |
        v
  [4] Query (ex: SUM revenue)
        |
        v
  [5] write_file ./reports/*.txt
```

---

## Sequência POST /chat

```
  Cliente           Fastify            intentParser          agent (+ MCP)
     |                  |                     |                    |
     | POST question    |                     |                    |
     | (CSV inline)     |                     |                    |
     |----------------->|                     |                    |
     |                  | invoke              |                    |
     |                  |-------------------->|                    |
     |                  |                     | IntentSchema       |
     |                  |                     | intent+fileContent   |
     |                  |                     |------------------->|
     |                  |                     |                    | csv_to_json
     |                  |                     |                    | mongodb tools
     |                  |                     |                    | filesystem tools
     |                  | answer string       |                    |
     |                  |<------------------------------------------|
     |<-----------------|                     |                    |
```

---

## Ligação arquivo ↔ conceito

| Conceito | Arquivo |
|----------|---------|
| Agregar MCP | `services/mcpService.ts` |
| FS MCP config | `tools/fsTool.ts` |
| Mongo MCP config | `tools/mongodbTool.ts` |
| CSV tool | `tools/csvToJSONTool.ts` |
| Agent + callbacks | `services/openRouterService.ts` |
| Grafo | `graph/graph.ts` |
| Intent | `graph/nodes/intentNode.ts` |
| Agent node | `graph/nodes/agentNode.ts` |
| Steps prompt | `prompts/v1/agentNode.ts` |
| HTTP | `server.ts` |
| Docker | `docker-compose.yaml` |

---

## Módulo 03 — posição da aula

```
  Aula 01 (esta)     Aula 05
  CONSUMER           PRODUCER
  MultiServerMCP     McpServer próprio
  + LangGraph        + stdio puro
       |                  |
       +--------+---------+
                |
         MCP na prática
```

---

## Comandos rápidos

```
npm run docker:infra:up
npm run dev
npm run langgraph:serve
```

Mongo Express: http://localhost:8081
