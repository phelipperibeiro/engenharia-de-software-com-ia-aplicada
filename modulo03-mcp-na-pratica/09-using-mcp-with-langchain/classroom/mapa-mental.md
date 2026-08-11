# Mapa mental — MCP + LangChain (Aula 09)

## Visão em árvore

```
Using MCP with LangChain (Aula 09)
│
├── Projeto
│   └── 01-multiple-mcp-tools-z/
│
├── LangGraph
│   ├── agent (único nó)
│   └── conditional: error → retry
│
├── MCP servers
│   ├── customers-mcp (npx npm)
│   └── filesystem (./data)
│
├── Auth
│   ├── SERVICE_TOKEN (.env)
│   └── propagado ao subprocess npx
│
├── LLM
│   ├── OpenRouter
│   ├── createAgent
│   └── callbacks (tool logs)
│
├── API
│   ├── POST /chat :3000
│   └── backend :9999
│
└── Demo
    └── 3 customers → users.json → list
```

---

## Fluxo end-to-end

```
Usuário POST /chat
        |
        v
+---------------+
| LangGraph     |
| agent node    |
+-------+-------+
        |
        v
+---------------+
| createAgent   |
+---+---+-------+
    |   |
    |   +-- filesystem MCP (write users.json)
    |
    +-- customers-mcp (npx)
            |
            | SERVICE_TOKEN
            v
        API :9999
```

---

## MultiServerMCPClient

```
getCustomersTool()  ──> npx @erickwendel/ew-customers-mcp
getFSTool()         ──> npx @modelcontextprotocol/server-filesystem

         |
         v
   client.getTools()
         |
         v
   [list_customers, create_customer, ..., write_file, ...]
```

---

## Grafo

```
START → agent ──error?──> agent (retry)
              └──ok──────> END
```

---

## Arco Módulo 03 (customers)

```
06 MCP local     07 +auth       08 npm        09 LangChain
     |               |              |              |
  wrapper        SERVICE_TOKEN   npx publish    MultiServerMCPClient
```

---

## Env vars

```
OPENROUTER_API_KEY  → LLM
SERVICE_TOKEN       → customers-mcp subprocess
LANGSMITH_*         → tracing (opcional)
```

---

## vs Aula 01

```
Aula 01                    Aula 09
-------                    -------
intentParser + agent  →    agent only
MongoDB MCP           →    customers-mcp npm
csv_to_json           →    (removido)
sem auth              →    SERVICE_TOKEN
```

---

## Arquivos-chave

| Arquivo | Papel |
|---------|-------|
| `services/mcpService.ts` | MultiServerMCPClient |
| `tools/customersTool.ts` | npx spawn config |
| `tools/fsTool.ts` | filesystem root ./data |
| `graph/graph.ts` | conditional retry |
| `graph/nodes/agentNode.ts` | tool calling |
| `services/openRouterService.ts` | createAgent + callbacks |
