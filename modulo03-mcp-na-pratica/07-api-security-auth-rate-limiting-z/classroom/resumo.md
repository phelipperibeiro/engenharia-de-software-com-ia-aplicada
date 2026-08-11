# Aula 07 — API Security, Auth & Rate Limiting (Solução)

## Contexto no curso

Evolução direta da **aula 06**: mesmo MCP de customers, mas a API exige autenticação e o MCP propaga **service token** via env.

> Material: **[seguranca-api.md](./seguranca-api.md)** · **[mcp-auth.md](./mcp-auth.md)** · **[arquitetura.md](./arquitetura.md)**

---

## O que mudou vs aula 06

| Aspecto | Aula 06 | Aula 07 |
|---------|---------|---------|
| API auth | aberta | JWT + service token |
| Mutations | qualquer um | role `admin` |
| Rate limit | não | 90 req/min |
| MCP env | nenhum | `SERVICE_TOKEN` |
| Erros MCP | genérico | 401/403/429 tipados |
| HttpClient | fetch simples | Bearer + `#assertOk` |

---

## Dois projetos

1. **`nodejs-fastify-mongodb-crud-z`** — API segura
2. **`customers-mcp-z`** — MCP autenticado

---

## Fluxo operacional

```bash
# Terminal 1 — API
cd nodejs-fastify-mongodb-crud-z
docker compose up -d mongodb && npm start

# Terminal 2 — obter token + testar MCP
cd customers-mcp-z
./getServiceToken.sh
SERVICE_TOKEN=<uuid> npm test
```

---

## Tokens

| Tipo | Endpoint | Uso |
|------|----------|-----|
| JWT | `POST /v1/auth/login` | humano, curl, testes API |
| Service | `POST /v1/auth/service-token` | **MCP server** |

Service token requer `adminSuperSecret: "AM I THE BOSS?"`.

---

## Roles

- **admin** (erickwendel): CRUD completo via MCP
- **member** (ananeri): só leitura — mutações retornam 403

---

## Testes

| Suite | Pasta | Cobertura |
|-------|-------|-----------|
| API | `nodejs-fastify-mongodb-crud-z/test/` | auth, RBAC, rate limit |
| MCP | `customers-mcp-z/tests/` | CRUD, invalid token, rate limit |

---

## Takeaways

1. **Service token** — credencial M2M para MCP (não JWT de usuário)
2. **adminSuperSecret** — gate extra na emissão de tokens
3. **Rate limit por Bearer** — protege de loops de agente
4. **RBAC** — member lê, admin muta
5. **isError nas tools** — agente informa falhas sem crash
6. **Secrets no env** — SERVICE_TOKEN fora do código

---

## Evolução Módulo 03

| Aula | Tema |
|------|------|
| 06 | Legacy API as MCP |
| **07** | **Auth + rate limit + MCP seguro** |

Template exercício: **[../07-api-security-auth-rate-limiting-template/classroom/](../07-api-security-auth-rate-limiting-template/classroom/)**
