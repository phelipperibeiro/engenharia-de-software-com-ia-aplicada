# MCP autenticado (Aula 07)

No template, o MCP em `customers-mcp-z/` **já está implementado** — HttpClient com Bearer, erros tipados e tools com `isError`.

Sua tarefa principal é fazer a **API aceitar** o service token (ver **[exercicio.md](./exercicio.md)**).

---

## O que já vem pronto no template

| Componente | Status |
|------------|--------|
| `SERVICE_TOKEN` obrigatório (`index.ts`) | pronto |
| `CustomerHttpClient` + Bearer | pronto |
| `UnauthorizedError`, `ForbiddenError`, `RateLimitError` | pronto |
| Tools com try/catch → `isError` | pronto |
| `getServiceToken()` nos testes | pronto |
| `getServiceToken.sh` | pronto |

---

## Fluxo após implementar a API

```
getServiceToken.sh  →  UUID
        |
        v
SERVICE_TOKEN no env / mcp.json
        |
        v
MCP stdio → fetch com Bearer
        |
        v
API auth.js valida token
```

Enquanto `auth.js` estiver incompleto, testes MCP falham em `getServiceToken()` (404 na rota).

---

## Configurar MCP local

```bash
# 1. API com auth implementada
cd nodejs-fastify-mongodb-crud-z && npm start

# 2. Obter token
cd ../customers-mcp-z && ./getServiceToken.sh

# 3. Testar
SERVICE_TOKEN=<uuid> npm test
```

---

## Erros que o agente verá

| Situação | structuredContent |
|----------|-------------------|
| Token inválido | `{ isError: true, message: "...Unauthorized..." }` |
| Member tenta create | `{ isError: true, message: "...Forbidden..." }` |
| Rate limit | `{ isError: true, message: "...Rate limit exceeded..." }` |

Detalhes: **[../07-api-security-auth-rate-limiting-z/classroom/mcp-auth.md](../07-api-security-auth-rate-limiting-z/classroom/mcp-auth.md)**

---

## Resumo em uma frase

**Template MCP pronto — implemente auth na API, obtenha SERVICE_TOKEN e configure o env.**

Exercício: **[exercicio.md](./exercicio.md)**
