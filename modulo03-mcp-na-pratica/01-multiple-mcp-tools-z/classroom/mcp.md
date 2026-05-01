# MCP nesta aula (01) — Múltiplas tools

Esta aula foca em **consumir** várias fontes de ferramentas num único agente — padrão comum em produção quando o LLM precisa de filesystem, banco e utilitários locais.

---

## Visão geral

```
                    +---------------------------+
                    |   MultiServerMCPClient    |
                    +-------------+-------------+
                                  |
              +-------------------+-------------------+
              |                                       |
              v                                       v
    +------------------+                    +------------------+
    | MCP Filesystem   |                    | MCP MongoDB      |
    | (stdio npx)      |                    | (stdio npx)      |
    +------------------+                    +------------------+
    read_file, write_file                   insert, query, etc.

              +-------------------+
              | csv_to_json       |  ← LangChain tool nativa (NÃO é MCP)
              +-------------------+
```

Arquivo central: `src/services/mcpService.ts` → `getMCPTools()`

---

## MultiServerMCPClient

```typescript
const client = new MultiServerMCPClient({
  mcpServers: {
    ...getMongoDBTool(),
    ...getFSTool(),
  },
  onMessage: (log, source) => { /* logs por servidor */ }
})
const mcpTools = await client.getTools()
return [...mcpTools, getCSVTOJSONTool()]
```

| Pacote | Papel |
|--------|-------|
| `@langchain/mcp-adapters` | Ponte MCP → tools LangChain |
| SDK MCP (nos servidores externos) | Executa ações reais |

O agente LangChain vê **uma lista flat de tools** — não importa se veio de MCP ou foi escrita à mão.

---

## Servidor 1: Filesystem MCP

`src/tools/fsTool.ts`:

```typescript
npx -y @modelcontextprotocol/server-filesystem ${process.cwd()}
```

Tools típicas: `read_file`, `write_file`, `list_directory`, etc.

**Uso nesta aula:** salvar JSON exportado e relatório `.txt` em `./reports/`.

---

## Servidor 2: MongoDB MCP

`src/tools/mongodbTool.ts`:

```typescript
npx -y mongodb-mcp-server@latest
env: MDB_MCP_CONNECTION_STRING=mongodb://localhost:27017/dataprocessing
```

**Infra:** `docker compose up` → MongoDB `:27017`, mongo-express `:8081`.

**Uso nesta aula:** limpar collections, inserir registros de vendas, queries analíticas.

Repo: [mongodb-js/mongodb-mcp-server](https://github.com/mongodb-js/mongodb-mcp-server)

---

## Tool 3: csv_to_json (híbrida)

`src/tools/csvToJSONTool.ts` — **não** passa por MCP.

```typescript
tool(async ({ csvText }) => csvtojson().fromString(csvText), { name: 'csv_to_json', ... })
```

**Por quê misturar?**

- Nem tudo precisa ser MCP — conversão CSV→JSON é função local simples
- MCP para **integrações externas** (FS, DB); LangChain tool para **utilitário puro**

---

## Pipeline de tools (prompt do agent)

O system prompt em `agentNode.ts` define **sequência obrigatória**:

| Step | Ação |
|------|------|
| 0 | Apagar collections do usuário no MongoDB |
| 1 | Se CSV → `csv_to_json` |
| 2 | Se pedido → `write_file` JSON |
| 3 | Inserir documentos no MongoDB |
| 4 | Query analítica (ex.: receita total) |
| 5 | `write_file` relatório em `./reports/*.txt` |

O LLM **escolhe** qual tool chamar a cada passo — o prompt orienta a ordem.

---

## Logs de tool calling

`openRouterService.ts` registra callbacks:

```
🧠 LLM thinking...
🎯 Decided to call: csv_to_json, ...
🔧 Tool called: ...
✅ Tool done: ...
```

Útil para debugar cadeias multi-tool.

---

## Transporte

Ambos MCP servers usam **stdio** — o client spawna processos `npx` filhos.

---

## Consumer vs Producer

| | Aula 01 (esta) | Aula 05 mod 03 |
|---|----------------|----------------|
| Papel | Consumir 2 MCP + 1 tool | Publicar servidor MCP |
| Client | MultiServerMCPClient | McpServer |
| Orquestração | LangGraph agent | stdio puro |

---

## Resumo em uma frase

**Um agente LangChain agrega tools de dois servidores MCP (filesystem + MongoDB) e uma tool local CSV — o LLM encadeia chamadas para ETL + analytics + relatório.**

Grafo: **[langgraph.md](./langgraph.md)**
