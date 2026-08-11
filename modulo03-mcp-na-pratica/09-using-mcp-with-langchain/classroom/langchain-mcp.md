# LangChain + MCP publicado (Aula 09)

Agente LangGraph consome o **pacote npm** `@erickwendel/ew-customers-mcp` via `MultiServerMCPClient` — fechando o ciclo publish → consume.

Projeto: `01-multiple-mcp-tools-z/src/services/mcpService.ts`

---

## Visão geral

```
POST /chat
    |
    v
LangGraph agent node
    |
    v
OpenRouterService.createAgent
    |
    +-- customers-mcp (npx npm package)  → CRUD customers
    +-- filesystem MCP                   → salvar JSON em ./data
```

---

## MultiServerMCPClient

```typescript
const client = new MultiServerMCPClient({
  mcpServers: {
    ...getCustomersTool(),   // npx @erickwendel/ew-customers-mcp
    ...getFSTool(),          // @modelcontextprotocol/server-filesystem
  },
  onMessage: (log, source) => { /* logs por servidor */ },
  onInitialized: (source) => { /* conectado */ },
  onConnectionError: (source, error) => { process.exit(1) },
});

const mcpTools = await client.getTools();
return [...mcpTools];
```

Sem tools nativas (CSV, MongoDB) — **tudo via MCP**.

---

## customers-mcp via npx

`src/tools/customersTool.ts`:

```typescript
return {
  'customers-mcp': {
    transport: 'stdio',
    command: 'npx',
    args: ['-y', '@erickwendel/ew-customers-mcp@latest'],
    env: {
      SERVICE_TOKEN: process.env.SERVICE_TOKEN,
    },
  },
};
```

| Aspecto | Detalhe |
|---------|---------|
| Spawn | subprocess npx a cada startup do agente |
| Auth | SERVICE_TOKEN propagado pro subprocess |
| Registry privado | adicionar `--registry http://localhost:4873` nos args |

Falha se `SERVICE_TOKEN` não estiver no `.env`.

---

## filesystem MCP

`src/tools/fsTool.ts`:

```typescript
args: ['-y', '@modelcontextprotocol/server-filesystem', `${process.cwd()}/data`]
```

Root limitado a `./data/` — agente salva `users.json` após criar customers.

---

## vs Aula 01 (multiple MCP tools original)

| | Aula 01 | Aula 09 |
|---|---------|---------|
| Customers | MongoDB MCP direto | **customers-mcp npm** |
| ETL | csv_to_json nativa | removido |
| Grafo | intentParser → agent | **agent único** |
| Auth | não | **SERVICE_TOKEN** |
| Publish | — | consome pacote aula 08 |

Mesma pasta nome `01-multiple-mcp-tools-z`, evoluída para o pipeline customers publicado.

---

## Demo smoke test

`src/index.ts` envia pergunta automática:

```
Crie 3 clientes de teste usando as tools de customer,
depois guarde em ./data/users.json,
em seguida liste os clientes cadastrados.
```

Fluxo esperado: `create_customer` × 3 → filesystem write → `list_customers`.

---

## Infra necessária

```bash
# 1. API autenticada
cd nodejs-fastify-mongodb-crud-z && npm start

# 2. SERVICE_TOKEN no .env
cd 01-multiple-mcp-tools-z
./getServiceToken.sh

# 3. Agente
npm run dev   # :3000
```

Variáveis (`.env.example`):

- `OPENROUTER_API_KEY`
- `SERVICE_TOKEN`

---

## Resumo em uma frase

**MultiServerMCPClient spawna customers-mcp via npx com SERVICE_TOKEN + filesystem MCP — agente LangChain usa tools publicadas na aula 08.**

LangGraph: **[langgraph.md](./langgraph.md)**
