# Arquitetura (Aula 07)

Mesma estrutura em camadas da aula 06, com **credenciais** fluindo da API para o MCP.

---

## Diagrama completo

```
+-------------+     stdio      +------------------+
| Copilot /   | <-----------> | customers-mcp-z  |
| Cursor      |               | SERVICE_TOKEN    |
+-------------+               +--------+---------+
                                       |
                              CustomerService
                                       |
                              CustomerHttpClient
                              Authorization: Bearer
                                       |
                                       v
                              +------------------+
                              | Fastify API      |
                              | auth.js          |
                              | jwt + rate-limit |
                              +--------+---------+
                                       |
                                       v
                                   MongoDB
```

---

## Camadas MCP (customers-mcp-z)

```
src/
├── domain/
│   ├── customer.ts      # Zod schemas (+ customer/customers no Mutation)
│   └── errors.ts        # Unauthorized, Forbidden, RateLimit
├── application/
│   └── customer-service.ts
├── infrastructure/
│   └── customer-http-client.ts   # Bearer + #assertOk
├── mcp/
│   ├── server.ts                 # SERVICE_TOKEN → CustomerService
│   ├── tools/                    # 5 tools, kebab-case files
│   ├── resources/api-info.ts
│   └── prompts/findCustomer.ts
└── index.ts                      # valida SERVICE_TOKEN
```

Diferença vs aula 06: kebab-case nos arquivos, `errors.ts`, token no constructor.

---

## Camadas API (nodejs-fastify-mongodb-crud-z)

```
src/
├── auth.js          # JWT, service token, rate limit, requireRole
├── config.js        # REQUESTS_PER_MINUTE = 90
├── index.js         # register plugins + preHandlers
├── db.js
└── ...
```

---

## Fluxo create_customer (admin)

```
Agente chama create_customer
        |
        v
MCP tool → CustomerService.createCustomer
        |
        v
HttpClient POST /customers + Bearer SERVICE_TOKEN
        |
        v
API: onRequest (valida token, role=admin)
        |
        v
requireRole('admin') → OK
        |
        v
MongoDB insert → { id, message }
        |
        v
Tool structuredContent → agente
```

Member token neste fluxo → **403** → `ForbiddenError` → `isError`.

---

## Separação de secrets

| Secret | Onde vive | Quem usa |
|--------|-----------|----------|
| username/password | API auth | emitir tokens (humano/script) |
| adminSuperSecret | API auth.js | emitir service token |
| SERVICE_TOKEN | env MCP | HttpClient |
| JWT | resposta login | testes manuais, curl |

O agente **nunca** vê password nem adminSuperSecret.

---

## Resumo em uma frase

**Mesmas camadas da aula 06, com errors.ts e Bearer token na infrastructure — API ganha auth.js como gatekeeper.**

Segurança API: **[seguranca-api.md](./seguranca-api.md)**
