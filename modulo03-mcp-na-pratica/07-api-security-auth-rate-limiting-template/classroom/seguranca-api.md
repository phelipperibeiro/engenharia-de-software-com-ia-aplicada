# Segurança na API (Aula 07 — Conceitos)

Conceitos que você **implementa** no template e encontra prontos na solução `-z`.

> Checklist prático: **[exercicio.md](./exercicio.md)**

---

## Por que segurança nesta aula?

Na aula 06, o MCP chamava a API **sem credencial**. Em produção:

- Agentes não devem ter acesso irrestrito
- Integrações machine-to-machine precisam de tokens dedicados
- Loops de tool calling podem derrubar a API (rate limit)

---

## Dois tipos de token

```
Humano (Copilot UI)          Serviço (MCP stdio)
        |                              |
        v                              v
 POST /auth/login              POST /auth/service-token
        |                              |
        v                              v
     JWT curto                   UUID long-lived
   (fastify.jwt)              (Map em memória)
```

| | JWT (login) | Service token |
|---|-------------|---------------|
| Endpoint | `/v1/auth/login` | `/v1/auth/service-token` |
| Extra | — | `adminSuperSecret` |
| Uso típico | testes manuais, UI | MCP server, CI |
| Formato | JWT assinado | UUID v4 |

---

## Fluxo de autenticação

```
Authorization: Bearer <token>
        |
        v
   É UUID no Map? ----sim----> request.user = { username, role }
        |
        não
        v
   jwtVerify() ----ok----> request.user do payload
        |
        fail
        v
      401 Unauthorized
```

Rotas públicas: `/v1/health`, `/v1/auth/login`, `/v1/auth/service-token`.

---

## RBAC (roles)

| Role | GET customers | POST/PUT/DELETE |
|------|---------------|-----------------|
| admin | sim | sim |
| member | sim | **403 Forbidden** |

Implementar `requireRole('admin')` como `preHandler` nas mutações.

---

## Rate limiting

- **90 requests/minuto** (`REQUESTS_PER_MINUTE` em `config.js`)
- Chave = Bearer token (cada MCP/agente tem cota própria)
- Resposta **429** — MCP deve tratar como erro graceful

---

## Credenciais de demo

| username | password | role |
|----------|----------|------|
| erickwendel | 123123 | admin |
| ananeri | 1234 | member |

`ADMIN_SUPER_SECRET`: `AM I THE BOSS?`

---

## O que falta no template

| Arquivo | Estado |
|---------|--------|
| `auth.js` | só exporta `authUsers` |
| `index.js` | sem jwt, rate-limit, hooks, requireRole |

Implemente seguindo os testes em `test/api.test.js` — eles definem o contrato.

Solução: **[../07-api-security-auth-rate-limiting-z/classroom/seguranca-api.md](../07-api-security-auth-rate-limiting-z/classroom/seguranca-api.md)**

MCP: **[mcp-auth.md](./mcp-auth.md)**
