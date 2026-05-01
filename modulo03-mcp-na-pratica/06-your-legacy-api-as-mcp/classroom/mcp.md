# MCP nesta aula (06) — Legacy API wrapper

Diferente da aula 02 (LangChain tool nativa) e da aula 05 (lógica local no MCP), aqui o MCP **proxy** uma API REST externa com **CRUD completo**.

---

## Três abordagens no Módulo 03

```
Aula 02                    Aula 05                 Aula 06
---------                  -------                 -------
LangChain tool             MCP server              MCP server
(SerpAPI in-process)       (crypto local)          (HTTP → legacy API)
Sem MCP server             Sem backend externo     Fastify :9999
Consumido via createAgent  stdio direto            stdio direto
```

| Cenário | Abordagem |
|---------|-----------|
| API rápida no mesmo projeto | Tool nativa (aula 02) |
| Utilitário sem backend | MCP local (aula 05) |
| **API legada já em produção** | **MCP wrapper (aula 06)** |

---

## Primitivos MCP neste projeto

| Primitivo | Nome | Função |
|-----------|------|--------|
| Tool | `list_customers` | GET /customers |
| Tool | `get_customer` | Busca por `_id`, `name` ou `phone` |
| Tool | `create_customer` | POST /customers |
| Tool | `update_customer` | PUT /customers/:id |
| Tool | `delete_customer` | DELETE /customers/:id |
| Resource | `customers://api-info` | Documentação da API REST |
| Prompt | `find_customer_prompt` | Template de busca com args |

---

## Tools — padrão de registro

```typescript
server.registerTool(
  "list_customers",
  {
    description: "List all customers",
    inputSchema: {},
    outputSchema: { customers: z.array(CustomerSchema) },
  },
  async () => ({
    content: [{ type: "text", text: JSON.stringify(customers) }],
    structuredContent: { customers },
  })
);
```

Cada tool retorna:

- **`content`** — texto para o LLM ler
- **`structuredContent`** — JSON validado pelo `outputSchema`
- **`isError: true`** — em falhas (sem throw)

---

## Resource — descoberta da API

URI: `customers://api-info`

Descreve endpoints, base URL e shape do customer — o agente pode **ler antes de chamar tools**, sem adivinhar rotas.

Equivalente a OpenAPI em linguagem natural para o LLM.

---

## Prompt — workflow reutilizável

`find_customer_prompt` com `argsSchema: CustomerQuerySchema.shape`:

```
Please find the customer matching the following query
using the get_customer or list_customers tool.
Query: {"name":"John"}
```

Útil no Copilot Chat: usuário invoca prompt → agente já sabe quais tools usar.

---

## Transporte e configuração

`.vscode/mcp.json` em `customers-mcp-z/`:

```json
{
  "servers": {
    "customers-mcp": {
      "command": "node",
      "args": ["--experimental-strip-types", "./src/index.ts"]
    }
  }
}
```

Fluxo:

```
VS Code / Cursor
      |
      | stdio (JSON-RPC MCP)
      v
customers-mcp-z (index.ts)
      |
      | HTTP fetch
      v
localhost:9999/v1
```

---

## SDK

| Pacote | Uso |
|--------|-----|
| `@modelcontextprotocol/sdk` | `McpServer`, `StdioServerTransport` |
| `zod` | inputSchema / outputSchema |

Nome do servidor: `@erickwendel/ew-customers-mcp` v0.0.1

---

## Resumo em uma frase

**MCP traduz CRUD REST em tools tipadas + resource de documentação + prompt de busca — padrão ideal para integrar sistemas legados com agentes.**

Implementação: **[servidor.md](./servidor.md)**
