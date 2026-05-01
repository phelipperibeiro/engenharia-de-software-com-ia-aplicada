# Arquitetura em camadas (Aula 06)

O projeto `customers-mcp-z` separa **domínio**, **aplicação**, **infraestrutura** e **MCP** — padrão essencial quando a API legada já existe e o MCP é só a fachada para IAs.

---

## Visão geral

```
+--------------------------------------------------+
|  MCP Layer (src/mcp/)                            |
|  tools · resources · prompts · server.ts         |
+--------------------------------------------------+
                        |
                        v
+--------------------------------------------------+
|  Application (src/application/)                  |
|  CustomerService — regras de negócio             |
+--------------------------------------------------+
                        |
                        v
+--------------------------------------------------+
|  Infrastructure (src/infrastructure/)            |
|  CustomerHttpClient — fetch REST                 |
+--------------------------------------------------+
                        |
                        v
+--------------------------------------------------+
|  Legacy API (nodejs-fastify-mongodb-crud)        |
|  Fastify + MongoDB :9999                         |
+--------------------------------------------------+
```

---

## Domain (`src/domain/customer.ts`)

Schemas Zod compartilhados:

| Schema | Uso |
|--------|-----|
| `CustomerSchema` | `{ _id?, name, phone }` |
| `CustomerQuerySchema` | busca por `_id`, `name` ou `phone` |
| `CustomerUpdateSchema` | update com `_id` obrigatório |
| `CustomerMutationSchema` | resposta de create/update/delete |

`CustomerMutationSchema` inclui `customer` e `customers` opcionais — evita erro *"Structured content does not match tool's output schema"* quando o MCP valida saída estruturada.

---

## Application (`CustomerService`)

Regras que **não** pertencem ao MCP nem ao HTTP:

```typescript
async findCustomer(query: CustomerQuery): Promise<Customer | null> {
  if (query._id) return this.client.getCustomerById(query._id)

  const customers = await this.client.listCustomers()
  return customers.find(customer =>
    Object.entries(query).every(([key, value]) =>
      customer[key]?.includes(value)
    )
  ) ?? null
}
```

| Método | Comportamento |
|--------|---------------|
| `listCustomers` | delega ao client |
| `createCustomer` | delega ao client |
| `findCustomer` | by ID **ou** match parcial (includes) em name/phone |
| `updateCustomer` | delega ao client |
| `deleteCustomer` | delega ao client |

A busca fuzzy por `name`/`phone` é **lógica de aplicação** — a API legada só tem list + get by id.

---

## Infrastructure (`CustomerHttpClient`)

Wrapper `fetch` sobre a API REST:

```typescript
GET    ${baseUrl}/customers
GET    ${baseUrl}/customers/${id}   // 404 → null
POST   ${baseUrl}/customers
PUT    ${baseUrl}/customers/${_id}
DELETE ${baseUrl}/customers/${_id}
```

`BASE_URL` em `server.ts`: `http://localhost:9999/v1`

---

## MCP Layer (`src/mcp/`)

| Pasta | Responsabilidade |
|-------|------------------|
| `server.ts` | `McpServer` + wiring de tudo |
| `tools/` | 5 tools CRUD (uma função `register*` por arquivo) |
| `resources/` | `customers://api-info` |
| `prompts/` | `find_customer_prompt` |

Cada tool recebe `CustomerService` por **injeção de dependência** — testável e desacoplado.

---

## Entry point

`src/index.ts`:

```typescript
const transport = new StdioServerTransport();
await mcpServer.connect(transport);
```

Sem HTTP no MCP — comunicação **stdio** com VS Code / Cursor / Inspector.

---

## Template vs solução

| | `customers-mcp-template/` | `customers-mcp-z/` |
|---|---------------------------|------------------|
| Papel | ponto de partida | implementação completa |
| Tools | esqueleto | CRUD + schemas |
| Testes | mínimos | suite tools/resources/prompts |

---

## Por que não colocar fetch dentro da tool?

| Monolito | Camadas (esta aula) |
|----------|---------------------|
| Tool chama fetch direto | Tool → Service → HttpClient |
| Difícil testar sem MCP | Service testável isolado |
| Schema misturado com HTTP | Domain Zod reutilizado |
| Trocar API = reescrever tools | Trocar só infrastructure |

---

## Resumo em uma frase

**Domain define tipos, Application encapsula regras, Infrastructure fala HTTP, MCP expõe tudo ao agente — cada camada com uma responsabilidade.**

Servidor MCP: **[servidor.md](./servidor.md)**
