# Aula 09 — Using MCP with LangChain

## Contexto no curso

Nona pasta do **Módulo 03** — **fechamento do arco customers**: consome o MCP publicado (aula 08) dentro de um agente LangGraph com OpenRouter.

> Material: **[langchain-mcp.md](./langchain-mcp.md)** · **[langgraph.md](./langgraph.md)** · **[openrouter.md](./openrouter.md)**

---

## O que você está estudando

Evolução da aula 01 (`multiple-mcp-tools`) substituindo MongoDB MCP + CSV por:

1. **`@erickwendel/ew-customers-mcp`** via npx
2. **filesystem MCP** para persistir `./data/users.json`
3. Grafo **agent único** com retry em erro

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| HTTP | Fastify `POST /chat` :3000 |
| Orquestração | LangGraph (1 nó + conditional edge) |
| LLM | OpenRouter + `createAgent` |
| MCP | customers-mcp (npm) + filesystem |
| Auth | SERVICE_TOKEN → subprocess MCP |
| API backend | nodejs-fastify-mongodb-crud-z :9999 |

---

## Fluxo demo

```
Pergunta: "Crie 3 clientes, salve em users.json, liste todos"
    |
    v
agent → create_customer × 3
    |
    v
agent → write_file (filesystem MCP)
    |
    v
agent → list_customers
    |
    v
Resposta final ao usuário
```

---

## Comandos

```bash
# Terminal 1 — API
cd nodejs-fastify-mongodb-crud-z
docker compose up -d mongodb && npm start

# Terminal 2 — agente
cd 01-multiple-mcp-tools-z
cp .env.example .env   # OPENROUTER + SERVICE_TOKEN
./getServiceToken.sh
npm install && npm run dev
```

---

## Comparação aula 01 vs 09

| Aspecto | Aula 01 | Aula 09 |
|---------|---------|---------|
| Customers data | MongoDB MCP | customers-mcp npm |
| CSV/ETL | sim | não |
| Intent parser | sim | não |
| Auth | não | SERVICE_TOKEN |
| MCP source | npx genérico | **pacote curso** |

---

## Takeaways

1. **Publish once, consume everywhere** — npm + npx no LangChain
2. **env propagation** — SERVICE_TOKEN pro subprocess MCP
3. **MultiServerMCPClient** — customers + filesystem na mesma lista
4. **Callbacks** — observabilidade de tool calls
5. **Retry condicional** — resiliência simples no grafo
6. **Arco completo** — API → MCP → publish → LangGraph agent

---

## Arco customers (Módulo 03)

| Aula | Etapa |
|------|-------|
| 06 | MCP wrapper API |
| 07 | + auth |
| 08 | + npm publish |
| **09** | **+ LangChain consume** |

---

## Evolução Módulo 03

| Aula | Tema |
|------|------|
| 01 | Multiple MCP (original) |
| 08 | Publish npm |
| **09** | **MCP + LangChain** |
