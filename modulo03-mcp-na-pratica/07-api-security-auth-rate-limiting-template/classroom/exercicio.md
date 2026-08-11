# Exercício — Template vs Solução (Aula 07)

Este repo é o **ponto de partida**. Compare com `07-api-security-auth-rate-limiting-z` quando terminar.

---

## Estado do template

| Componente | Template | Solução `-z` |
|------------|----------|--------------|
| `auth.js` | só `authUsers` | JWT, hooks, service-token, requireRole |
| `index.js` | CRUD aberto | `@fastify/jwt`, rate-limit, preHandler admin |
| `customers-mcp-z` | HttpClient + erros + SERVICE_TOKEN | igual (completo) |
| Testes API | esperam auth | passam com auth |
| Testes MCP | esperam service token | passam |

---

## Parte 1 — API (`nodejs-fastify-mongodb-crud-z`)

### 1. Completar `src/auth.js`

Implementar (ver solução `-z`):

- `JWT_SECRET`, `ADMIN_SUPER_SECRET`
- `rateLimitOptions` (`REQUESTS_PER_MINUTE` de `config.js` = **90**)
- `initAuthRoute(fastify)`:
  - hook `onRequest` — rotas públicas vs Bearer obrigatório
  - service token em `Map` (UUID)
  - `POST /v1/auth/login` → JWT
  - `POST /v1/auth/service-token` → UUID + role
- `requireRole('admin')` — preHandler para mutações

Usuários em `authUsers`:

| username | password | role |
|----------|----------|------|
| erickwendel | 123123 | admin |
| ananeri | 1234 | member |

### 2. Atualizar `src/index.js`

```javascript
import fastifyJwt from '@fastify/jwt'
import fastifyRateLimit from '@fastify/rate-limit'
import { initAuthRoute, JWT_SECRET, rateLimitOptions, requireRole } from './auth.js'

await fastify.register(fastifyJwt, { secret: JWT_SECRET })
await fastify.register(fastifyRateLimit, rateLimitOptions)
initAuthRoute(fastify)
```

Adicionar `preHandler: [requireRole('admin')]` em POST, PUT, DELETE `/v1/customers`.

### 3. Validar API

```bash
cd nodejs-fastify-mongodb-crud-z
docker compose up -d mongodb
npm test
```

---

## Parte 2 — MCP (`customers-mcp-z`)

O MCP **já está pronto** no template. Falta só a API responder com auth.

### Obter service token

```bash
./getServiceToken.sh
# ou
curl -X POST http://localhost:9999/v1/auth/service-token \
  -H "Content-Type: application/json" \
  -d '{"username":"erickwendel","password":"123123","adminSuperSecret":"AM I THE BOSS?"}'
```

### Configurar VS Code

`.vscode/mcp.json`:

```json
{
  "servers": {
    "customers-mcp": {
      "command": "node",
      "args": ["--experimental-strip-types", "./src/index.ts"],
      "env": { "SERVICE_TOKEN": "<token-aqui>" }
    }
  }
}
```

### Validar MCP

```bash
cd customers-mcp-z
SERVICE_TOKEN=<token> npm test
```

---

## Checklist

- [ ] `POST /v1/auth/login` retorna JWT
- [ ] `POST /v1/auth/service-token` retorna UUID + role
- [ ] Rotas protegidas retornam 401 sem token
- [ ] POST/PUT/DELETE exigem role `admin` (403 para member)
- [ ] Rate limit 429 após 90 req/min por token
- [ ] MCP lista customers com SERVICE_TOKEN válido
- [ ] MCP retorna `isError` com token inválido
- [ ] Teste de rate limit no MCP passa

---

## Dicas

- Descomente os blocos `inject` no final de `index.js` para testar manualmente
- `requireRole` usa `request.user` — preenchido pelo hook (JWT ou service token)
- Rate limit key: token Bearer (não IP) — ver `keyGenerator` em auth.js

Solução: **[../07-api-security-auth-rate-limiting-z/classroom/](../07-api-security-auth-rate-limiting-z/classroom/)**
