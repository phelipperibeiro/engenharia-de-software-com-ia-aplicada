# Aula 07 — API Security (Template / Exercício)

## Contexto no curso

Mesma aula 07, versão **exercício**. O MCP já está pronto; você implementa segurança na API.

> Material: **[exercicio.md](./exercicio.md)** · **[seguranca-api.md](./seguranca-api.md)** · **[mcp-auth.md](./mcp-auth.md)**

---

## Divisão de trabalho

| Projeto | Você implementa? |
|---------|------------------|
| `nodejs-fastify-mongodb-crud-z` | **sim** — `auth.js` + wiring em `index.js` |
| `customers-mcp-z` | **não** — já tem Bearer, erros, tests |

---

## Passos

1. Completar `auth.js` (JWT, service-token, rate limit, requireRole)
2. Registrar plugins em `index.js`
3. `npm test` na API
4. `./getServiceToken.sh` + `SERVICE_TOKEN=... npm test` no MCP
5. Configurar `.vscode/mcp.json`

---

## Critério de sucesso

Todos os testes passam em **ambos** os projetos — espelhe a solução `-z` se travar.

Solução: **[../07-api-security-auth-rate-limiting-z/classroom/resumo.md](../07-api-security-auth-rate-limiting-z/classroom/resumo.md)**

Checklist: **[exercicio.md](./exercicio.md)**

---

## Base

[Aula 06 — Legacy API as MCP](../06-your-legacy-api-as-mcp/classroom/)
