# Servidor customers-mcp-z (Aula 06)

Implementação completa do MCP que envolve a API de customers — registro modular, schemas Zod e testes com MCP Client.

---

## Estrutura de arquivos

```
customers-mcp-z/
├── src/
│   ├── index.ts                    # stdio transport
│   ├── domain/customer.ts          # schemas Zod
│   ├── application/customerService.ts
│   ├── infrastructure/customerHttpClient.ts
│   └── mcp/
│       ├── server.ts               # wiring central
│       ├── tools/
│       │   ├── listCustomers.ts
│       │   ├── getCustomer.ts
│       │   ├── createCustomer.ts
│       │   ├── updateCustomer.ts
│       │   └── deleteCustomer.ts
│       ├── resources/apiInfo.ts
│       └── prompts/findCustomer.ts
├── tests/
│   ├── helpers.ts                  # StdioClientTransport
│   ├── tools/customers.test.ts
│   ├── resources/apiInfo.test.ts
│   └── prompts/findCustomer.test.ts
└── .vscode/mcp.json
```

---

## server.ts — wiring

```typescript
const BASE_URL = "http://localhost:9999/v1";
const customerService = new CustomerService(BASE_URL);

export const mcpServer = new McpServer({
  name: "@erickwendel/ew-customers-mcp",
  version: "0.0.1",
});

// Tools (5)
registerListCustomersTool(mcpServer, customerService);
registerGetCustomerTool(mcpServer, customerService);
// ... create, update, delete

// Prompt + Resource
registerFindCustomerPrompt(mcpServer);
registerApiInfoResource(mcpServer, BASE_URL);
```

Ordem: service → tools → prompt → resource.

---

## Tools em detalhe

| Tool | Input | Output structured |
|------|-------|-------------------|
| `list_customers` | `{}` | `{ customers: Customer[] }` |
| `get_customer` | `CustomerQuerySchema` | `{ customer: Customer \| null }` |
| `create_customer` | `{ name, phone }` | `{ id, message }` |
| `update_customer` | `CustomerUpdateSchema` | `CustomerMutationSchema` |
| `delete_customer` | `{ _id }` | `CustomerMutationSchema` |

`get_customer` usa `CustomerService.findCustomer` — suporta busca parcial por nome/telefone quando não há `_id`.

---

## Resource apiInfo

```typescript
server.registerResource(
  "customers://api-info",
  "customers://api-info",
  { description: "describes the customers rest API..." },
  () => ({ contents: [{ uri, mimeType: "text/plain", text: `...` }] })
);
```

Texto inclui base URL dinâmica e tabela de endpoints.

---

## Prompt findCustomer

```typescript
server.registerPrompt(
  "find_customer_prompt",
  {
    description: "Prompt to search a customer...",
    argsSchema: CustomerQuerySchema.shape,
  },
  (query) => ({ messages: [{ role: "user", content: { type: "text", text: `...` } }] })
);
```

Args: `_id?`, `name?`, `phone?` — qualquer combinação.

---

## Testes

Helper `createTestClient()` — conecta via stdio ao servidor real:

```typescript
new StdioClientTransport({
  command: 'node',
  args: ['--experimental-strip-types', 'src/index.ts'],
});
```

### Suite tools (`customers.test.ts`)

Requer API legada rodando em `:9999`:

1. `list_customers` — retorna array
2. `create_customer` — retorna `id` + message `user ${name} created!`
3. `update_customer` — create → update → valida message/id
4. `delete_customer` — create → delete → message `User ${id} deleted!`

### Suite resources

- `listResources` contém `customers://api-info`

### Suite prompts

- `getPrompt({ name: 'find_customer_prompt', arguments: { name: 'John' } })`
- Texto referencia `get_customer` e inclui query

---

## Comandos

```bash
# Terminal 1 — API legada
cd nodejs-fastify-mongodb-crud
docker compose up -d mongodb && npm start

# Terminal 2 — MCP (via client ou inspector)
cd customers-mcp-z
npm install
npm test                    # testes MCP (precisa API up)
npm run mcp:inspect         # UI em localhost:5173
npm start                   # stdio (usado pelo VS Code)
```

Node **v24.14.0** (ver `engines` no package.json).

---

## Usar no VS Code / Cursor

1. Subir API legada (`:9999`)
2. Configurar `.vscode/mcp.json`
3. Reload window
4. Copilot Chat (Agent mode):

```
Liste todos os customers usando o MCP
```

```
Use find_customer_prompt com name "Ana"
```

```
Leia o resource customers://api-info
```

---

## vs aula 05 (CipherSuite)

| | Aula 05 | Aula 06 |
|---|---------|---------|
| Lógica | crypto em memória | HTTP para API externa |
| Arquivos | `mcp.ts` monolítico | camadas + register por arquivo |
| Tools | encrypt/decrypt | CRUD REST |
| Dependência | nenhuma | API `:9999` running |

---

## Resumo em uma frase

**customers-mcp-z registra 5 tools CRUD + resource + prompt com Zod e DI — testável via MCP Client stdio contra a API legada.**

API legada: **[legacy-api.md](./legacy-api.md)**
