# Arquitetura (Aula 07)

Mesma estrutura em camadas da aula 06, com **credenciais** fluindo da API para o MCP.

> No template, implemente a camada de auth na API — MCP já está completo.

---

## Diagrama completo

```
+-------------+     stdio      +------------------+
| Copilot /   | <-----------> | customers-mcp-z  |
| Cursor      |               | SERVICE_TOKEN    |
+-------------+               +--------+---------+
                                       |
                              CustomerHttpClient (Bearer)
                                       |
                                       v
                              +------------------+
                              | Fastify API      |
                              | auth.js ← VOCÊ   |
                              +--------+---------+
                                       |
                                       v
                                   MongoDB
```

---

## Camadas MCP (já prontas no template)

| Camada | Arquivo | Status template |
|--------|---------|-----------------|
| domain | `customer.ts`, `errors.ts` | pronto |
| application | `customer-service.ts` | pronto |
| infrastructure | `customer-http-client.ts` | pronto |
| mcp | tools, resource, prompt | pronto |

---

## Camadas API (você implementa)

| Arquivo | Template | Objetivo |
|---------|----------|----------|
| `auth.js` | stub | JWT, service token, rate limit, requireRole |
| `index.js` | sem plugins | registrar jwt + rate-limit + hooks |

---

## Fluxo de credenciais

```
getServiceToken.sh
       |
       v
SERVICE_TOKEN → MCP env
       |
       v
Bearer em cada fetch
       |
       v
API auth.js valida
```

Solução detalhada: **[../07-api-security-auth-rate-limiting-z/classroom/arquitetura.md](../07-api-security-auth-rate-limiting-z/classroom/arquitetura.md)**

Exercício: **[exercicio.md](./exercicio.md)**
