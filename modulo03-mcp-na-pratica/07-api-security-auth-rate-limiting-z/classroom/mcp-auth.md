# MCP autenticado (Aula 07)

O servidor MCP propaga credenciais via **`SERVICE_TOKEN`** — nunca expõe senha ou `adminSuperSecret` ao agente.

Projeto: `customers-mcp-z/`

---

## Fluxo de credenciais

```
1. Admin obtém service token (fora do MCP)
        |
        v
2. SERVICE_TOKEN no env (mcp.json / terminal)
        |
        v
3. CustomerHttpClient envia Bearer em todo fetch
        |
        v
4. API valida token + rate limit + role
        |
        v
5. Tool retorna dados ou isError graceful
```

---

## SERVICE_TOKEN obrigatório

`src/index.ts`:

```typescript
const SERVICE_TOKEN = process.env.SERVICE_TOKEN ?? "";
if (!SERVICE_TOKEN) {
  console.error('[error]: SERVICE_TOKEN env var is required');
  process.exit(1);
}
```

`src/mcp/server.ts`:

```typescript
const SERVICE_TOKEN = process.env.SERVICE_TOKEN!
const service = new CustomerService(BASE_URL, SERVICE_TOKEN);
```

O token **não** fica hardcoded no código — só no env do client MCP.

---

## CustomerHttpClient

`src/infrastructure/customer-http-client.ts`:

```typescript
constructor(baseUrl: string, serviceToken: string) {
  this.authHeaders = { Authorization: `Bearer ${serviceToken}` };
}

async #assertOk(res: Response): Promise<void> {
  if (res.status === 401) throw new UnauthorizedError();
  if (res.status === 403) throw new ForbiddenError();
  if (res.status === 429) throw new RateLimitError();
  if (!res.ok) throw new Error(`HTTP ${res.status} - ...`);
}
```

Todo request inclui `Authorization: Bearer`.

---

## Erros de domínio

`src/domain/errors.ts`:

| Classe | HTTP | Mensagem |
|--------|------|----------|
| `UnauthorizedError` | 401 | token missing/invalid |
| `ForbiddenError` | 403 | insufficient permissions |
| `RateLimitError` | 429 | rate limit exceeded |

Mapeamento HTTP → exceção tipada → mensagem amigável nas tools.

---

## Tools — erro graceful

Padrão em todas as tools (ex.: `list-customers.ts`):

```typescript
try {
  const customers = await service.listCustomers();
  return {
    content: [{ type: "text", text: JSON.stringify(customers) }],
    structuredContent: { customers },
  };
} catch (err) {
  const message = `Failed to list customers. Error: ${err.message}`;
  return {
    content: [{ type: "text", text: message }],
    structuredContent: { isError: true, message },
  };
}
```

**Sem throw** — o agente recebe `isError: true` e pode informar o usuário.

---

## Obter token

Script `getServiceToken.sh`:

```bash
curl -X POST http://localhost:9999/v1/auth/service-token \
  -d '{"username":"erickwendel","password":"123123","adminSuperSecret":"AM I THE BOSS?"}'
```

Para MCP admin (mutações CRUD), use usuário **admin**.

---

## VS Code / Cursor

`.vscode/mcp.json`:

```json
{
  "servers": {
    "customers-mcp": {
      "command": "node",
      "args": ["--experimental-strip-types", "./src/index.ts"],
      "env": { "SERVICE_TOKEN": "<uuid-do-service-token>" }
    }
  }
}
```

Reload window após trocar token.

---

## Testes MCP

`tests/helpers.ts`:

```typescript
export async function getServiceToken() {
  const res = await fetch(`${API_URL}/auth/service-token`, { ... })
  return serviceToken
}

export async function createTestClient(serviceToken) {
  env: { ...process.env, SERVICE_TOKEN: serviceToken }
}
```

`tests/tools/customers.test.ts` valida:

- CRUD completo com token admin
- `isError` + "unauthorized" com token inválido
- `isError` + rate limit após ~90 chamadas a `list_customers`

---

## Segurança — boas práticas

| Faça | Não faça |
|------|----------|
| Token via env | Senha no MCP |
| Service token para MCP | JWT de usuário no stdio server |
| Erros tipados nas tools | Stack trace pro LLM |
| Token admin p/ mutações | Token member p/ create/delete |

---

## vs Aula 06

| | Aula 06 MCP | Aula 07 MCP |
|---|-------------|-------------|
| Auth header | nenhum | Bearer SERVICE_TOKEN |
| Erros HTTP | genérico | 401/403/429 tipados |
| Env obrigatório | não | `SERVICE_TOKEN` |
| Rate limit | N/A | propagado como RateLimitError |

---

## Resumo em uma frase

**MCP carrega SERVICE_TOKEN no env, injeta Bearer em todo fetch, e traduz 401/403/429 em isError para o agente.**

API: **[seguranca-api.md](./seguranca-api.md)**
