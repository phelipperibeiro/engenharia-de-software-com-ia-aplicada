# Mapa mental — Aula 07 (Solução)

## Visão em árvore

```
API Security & Rate Limiting (Aula 07)
│
├── API (nodejs-fastify-mongodb-crud-z)
│   ├── JWT login (/v1/auth/login)
│   ├── Service token (/v1/auth/service-token)
│   ├── onRequest hook (Bearer obrigatório)
│   ├── requireRole('admin') → mutações
│   └── Rate limit 90/min por token
│
├── MCP (customers-mcp-z)
│   ├── SERVICE_TOKEN env
│   ├── HttpClient + Bearer
│   ├── errors: 401/403/429
│   └── tools → isError graceful
│
├── Usuários
│   ├── erickwendel (admin)
│   └── ananeri (member)
│
└── vs Aula 06
    └── + auth + rate limit + token env
```

---

## Fluxo de autenticação

```
                    +------------------+
                    |  POST service-   |
                    |  token (+ secret)|
                    +--------+---------+
                             |
                             v
                      UUID serviceToken
                             |
              +--------------+--------------+
              |                             |
              v                             v
     SERVICE_TOKEN env              Authorization:
     (mcp.json)                     Bearer UUID
              |                             |
              v                             v
         MCP server ----------------> Fastify API
                                            |
                                     onRequest hook
                                            |
                              +-------------+-------------+
                              |                           |
                         Map lookup                   jwtVerify
                              |                           |
                              v                           v
                        request.user               request.user
```

---

## RBAC

```
GET /customers     → admin OK | member OK
POST/PUT/DELETE    → admin OK | member 403
```

---

## Rate limit

```
Request 1..90   → 200 OK
Request 91+     → 429 → RateLimitError → isError no MCP
```

Chave: Bearer token (fallback IP).

---

## Camadas MCP

```
Tool → Service → HttpClient(Bearer) → API auth → MongoDB
         ↑
    errors.ts (401/403/429)
```

---

## Secrets

```
adminSuperSecret  → emite service token (script admin)
SERVICE_TOKEN     → MCP runtime (env)
JWT               → sessão humana (login)
password          → nunca no MCP
```

---

## Comandos

```
API:  docker compose up && npm start && npm test
MCP:  ./getServiceToken.sh && SERVICE_TOKEN=x npm test
IDE:  .vscode/mcp.json + reload
```
