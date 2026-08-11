# Classroom — Aula 07 (Solução)

Material de estudo da aula **API Security, Auth & Rate Limiting** — evolução da aula 06 com **JWT, service tokens, RBAC e rate limiting** na API, e **propagação de credenciais** no servidor MCP.

| Arquivo | Conteúdo |
|---------|----------|
| [seguranca-api.md](./seguranca-api.md) | Auth JWT, service token, roles, rate limit |
| [mcp-auth.md](./mcp-auth.md) | SERVICE_TOKEN, HttpClient, erros 401/403/429 |
| [arquitetura.md](./arquitetura.md) | Camadas + fluxo de credenciais |
| [resumo.md](./resumo.md) | Resumo, comandos, comparação com aula 06 |
| [mapa-mental.md](./mapa-mental.md) | Mapa mental em árvore + diagramas ASCII |

**Projetos nesta pasta:**

| Pasta | Papel |
|-------|-------|
| `nodejs-fastify-mongodb-crud-z/` | API segura (REST `:9999`) |
| `customers-mcp-z/` | MCP com Bearer token |

**Versão exercício:** [07-api-security-auth-rate-limiting-template](../07-api-security-auth-rate-limiting-template/classroom/)

**Aulas relacionadas:**
- [06 legacy API as MCP](../06-your-legacy-api-as-mcp/classroom/) — mesma base, sem auth
- [05 MCP do zero](../05-mcps-do-zero-z/classroom/) — servidor MCP básico
