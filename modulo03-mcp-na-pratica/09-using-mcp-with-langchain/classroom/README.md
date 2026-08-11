# Classroom — Aula 09 (Módulo 03)

Material de estudo da aula **Using MCP with LangChain** — agente LangGraph que consome o **MCP publicado via npm** (`customers-mcp`) + filesystem MCP, com tool calling e retry em erro.

| Arquivo | Conteúdo |
|---------|----------|
| [langchain-mcp.md](./langchain-mcp.md) | MultiServerMCPClient, customers-mcp via npx |
| [langgraph.md](./langgraph.md) | Grafo agent com retry condicional |
| [openrouter.md](./openrouter.md) | createAgent, callbacks de observabilidade |
| [resumo.md](./resumo.md) | Resumo, fluxo demo, comparação com aula 01 |
| [mapa-mental.md](./mapa-mental.md) | Mapa mental em árvore + diagramas ASCII |

**Projeto principal:** `01-multiple-mcp-tools-z/`

**Infra de apoio:** `nodejs-fastify-mongodb-crud-z/` (API autenticada `:9999`)

**Aulas relacionadas:**
- [01 multiple MCP tools](../01-multiple-mcp-tools-z/classroom/) — versão original (MongoDB MCP + CSV)
- [08 publishing MCPs](../08-publishing-mcps-private-npm/classroom/) — pacote npm publicado
- [07 auth](../07-api-security-auth-rate-limiting-z/classroom/) — SERVICE_TOKEN
