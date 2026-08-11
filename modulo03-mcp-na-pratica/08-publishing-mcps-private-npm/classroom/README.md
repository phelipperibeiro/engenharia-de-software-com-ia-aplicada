# Classroom — Aula 08 (Módulo 03)

Material de estudo da aula **Publishing MCPs (Private NPM)** — empacotar o servidor MCP customers como pacote npm e publicar no **Verdaccio** (registry privado) ou no **npm público**.

| Arquivo | Conteúdo |
|---------|----------|
| [publicacao.md](./publicacao.md) | package.json, bin, shebang, publish private/public |
| [verdaccio.md](./verdaccio.md) | Registry local Docker, login e release |
| [consumo.md](./consumo.md) | npx, mcp.json, SERVICE_TOKEN |
| [resumo.md](./resumo.md) | Resumo, comandos, comparação com aula 07 |
| [mapa-mental.md](./mapa-mental.md) | Mapa mental em árvore + diagramas ASCII |

**Projeto principal:** `customers-mcp-z/`

**Infra de apoio:** `nodejs-fastify-mongodb-crud-z/` (API `:9999` — mesma da aula 07)

**Aulas relacionadas:**
- [07 auth & rate limit](../07-api-security-auth-rate-limiting-z/classroom/) — MCP com SERVICE_TOKEN (base deste pacote)
- [09 MCP + LangChain](../09-using-mcp-with-langchain/classroom/) — consumir pacote publicado via npx

Site: [modelcontextprotocol.io](https://modelcontextprotocol.io)
