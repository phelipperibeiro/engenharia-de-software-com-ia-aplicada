# Segurança na API (Aula 07 — Solução)

A API em `nodejs-fastify-mongodb-crud-z/` evolui da aula 06 com **autenticação**, **autorização por role**, **service tokens para MCP** e **rate limiting**.

Arquivo central: `src/auth.js` + wiring em `src/index.js`.

---

## Visão geral

```
Request
   |
   v
onRequest hook -----> rota pública? skip
   |                      |
   |                      v
   |              Bearer token?
   |                 /        \
   |         service token    JWT verify
   |         (Map UUID)       (@fastify/jwt)
   v
rate-limit (90/min por token)
   |
   v
requireRole('admin')  --> POST/PUT/DELETE only
   |
   v
Handler CRUD
```

---

## Rotas públicas

Sem autenticação:

| Rota | Função |
|------|--------|
| `GET /v1/health` | Health check |
| `POST /v1/auth/login` | JWT para usuários humanos |
| `POST /v1/auth/service-token` | Token UUID para serviços/MCP |

Todas as outras rotas exigem `Authorization: Bearer <token>`.

---

## Login JWT (`POST /v1/auth/login`)

```json
{ "username": "erickwendel", "password": "123123" }
→ { "token": "<jwt>" }
```

- Valida contra `authUsers`
- Payload JWT: `{ username, role }`
- Secret: `JWT_SECRET = 'supersecret'`

Usuários:

| User | Role | Pode mutar CRUD? |
|------|------|------------------|
| erickwendel | admin | sim |
| ananeri | member | não (403) |

---

## Service token (`POST /v1/auth/service-token`)

Para **integrações machine-to-machine** (MCP server):

```json
{
  "username": "erickwendel",
  "password": "123123",
  "adminSuperSecret": "AM I THE BOSS?"
}
→ { "serviceToken": "<uuid>", "role": "admin" }
```

| Campo | Função |
|-------|--------|
| `adminSuperSecret` | Segunda camada — impede emissão casual de tokens |
| `serviceToken` | UUID via `randomUUID()`, guardado em `Map` |
| `role` | Propagada para `request.user` no hook |

O MCP usa **service token**, não JWT — ideal para processos stdio de longa duração.

---

## Hook onRequest

```javascript
const token = request.headers?.authorization?.replace(/bearer /i, '')
const serviceUser = issuedServiceTokens.get(token)
if (serviceUser) {
  request.user = serviceUser
  return
}
await request.jwtVerify()  // JWT humano
```

Ordem: service token primeiro → JWT depois → 401.

---

## RBAC — requireRole

```javascript
export function requireRole(role) {
  return async (request, reply) => {
    if (request.user.role === role) return
    return reply.code(403).send({ message: 'Forbidden: insufficient permissions' })
  }
}
```

Aplicado em:

- `POST /v1/customers`
- `PUT /v1/customers/:id`
- `DELETE /v1/customers/:id`

GET permanece para **admin e member**.

Member com service token: pode listar/ler, **não** criar/atualizar/deletar.

---

## Rate limiting

```javascript
// config.js
export const REQUESTS_PER_MINUTE = 90

// auth.js
rateLimitOptions = {
  max: REQUESTS_PER_MINUTE,
  timeWindow: '1 minute',
  keyGenerator: (request) =>
    request.headers?.authorization?.replace(/bearer /i, '') ?? request.ip,
}
```

| Aspecto | Valor |
|---------|-------|
| Limite | 90 requests / minuto |
| Chave | Bearer token (fallback: IP) |
| Resposta | HTTP **429** |
| Plugin | `@fastify/rate-limit` |

Protege API de loops de agente ou abuse do MCP.

---

## Testes API

`test/api.test.js` cobre:

- service-token (admin/member, secrets inválidos)
- rate limit após 90 requests
- login JWT
- CRUD com admin vs member (403)
- 401 sem token

---

## Comandos

```bash
cd nodejs-fastify-mongodb-crud-z
docker compose up -d mongodb
npm start

# Login
curl -X POST http://localhost:9999/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"erickwendel","password":"123123"}'

# Service token
curl -X POST http://localhost:9999/v1/auth/service-token \
  -H "Content-Type: application/json" \
  -d '{"username":"erickwendel","password":"123123","adminSuperSecret":"AM I THE BOSS?"}'
```

---

## vs Aula 06

| | Aula 06 | Aula 07 |
|---|---------|---------|
| Auth | nenhuma | JWT + service token |
| Mutations | abertas | admin only |
| Rate limit | não | 90/min |
| MCP | sem credencial | `SERVICE_TOKEN` |

---

## Resumo em uma frase

**API protegida com JWT para humanos, service token UUID para MCP, RBAC admin/member e rate limit por Bearer token.**

MCP: **[mcp-auth.md](./mcp-auth.md)**
