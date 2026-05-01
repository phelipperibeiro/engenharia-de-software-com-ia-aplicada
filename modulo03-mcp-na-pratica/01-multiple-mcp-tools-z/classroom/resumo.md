# Aula 01 — Multiple MCP Tools

## Contexto no curso

Primeira aula do **Módulo 03 (MCP na prática)**. Você aprende a **orquestrar várias ferramentas** — servidores MCP externos + tool LangChain — dentro de um **agente LangGraph** que processa dados de vendas.

> Material: **[mcp.md](./mcp.md)** · **[langgraph.md](./langgraph.md)** · **[openrouter.md](./openrouter.md)**

---

## O que você está construindo

Assistente que recebe uma **pergunta com CSV embutido** e:

1. Entende o que fazer (intent)
2. Converte CSV → JSON
3. Persiste no MongoDB
4. Responde pergunta analítica (ex.: receita total)
5. Salva relatório em `./reports/`

Exemplo:

```
What's the total revenue from this sales data?
<csv...>
```

---

## Arquitetura

| Camada | Arquivos |
|--------|----------|
| HTTP | `server.ts`, `index.ts` |
| Grafo | `graph/graph.ts`, `state.ts`, `factory.ts` |
| Nós | `intentNode.ts`, `agentNode.ts` |
| Tools MCP | `mcpService.ts`, `fsTool.ts`, `mongodbTool.ts` |
| Tool local | `csvToJSONTool.ts` |
| LLM | `openRouterService.ts` |
| Prompts | `prompts/v1/identifyIntent.ts`, `agentNode.ts` |
| Infra | `docker-compose.yaml` |

---

## Três fontes de tools

| Fonte | Tipo | Exemplos |
|-------|------|----------|
| `@modelcontextprotocol/server-filesystem` | MCP stdio | read/write file |
| `mongodb-mcp-server` | MCP stdio | insert, find, drop |
| `csv_to_json` | LangChain `tool()` | parse CSV string |

Detalhes: **[mcp.md](./mcp.md)**

---

## Fluxo em 2 nós LangGraph

### intentParser

- LLM + Zod (`IntentSchema`)
- Separa pergunta vs dados brutos
- Se falhar → `error` → END

### agent

- LLM + **todas** as tools
- System prompt com steps 0–5
- Tool calling multi-turn até resposta final

---

## Pipeline orientado por prompt (steps)

```
Step 0: Limpar MongoDB
Step 1: csv_to_json (se CSV)
Step 2: write_file JSON (se pedido)
Step 3: Insert MongoDB
Step 4: Query analítica
Step 5: write_file relatório ./reports/
```

O modelo **não** recebe código fixo para cada step — o prompt + tools permitem flexibilidade.

---

## Como rodar

```bash
npm install
cp .env.example .env
# OPENROUTER_API_KEY

npm run docker:infra:up
npm run dev          # :3000 + teste auto com sales-complete.csv
npm run langgraph:serve
```

Mongo Express: http://localhost:8081 (user `erickwendel` / pass `abc123`)

Manual:

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"Here is sales.csv. What is total revenue?\nproduct,amount\nA,100\nB,200"}'
```

---

## Observabilidade

- Console: callbacks em `openRouterService` (tool calls)
- LangSmith: `LANGCHAIN_TRACING_V2=true`
- MCP: `onMessage` no `MultiServerMCPClient`

---

## Takeaways

1. **MultiServerMCPClient** agrega N servidores MCP numa lista de tools
2. **Híbrido MCP + tool local** — nem tudo precisa ser protocolo MCP
3. **Intent node** limpa entrada antes do agente com tools
4. **Prompt com sequência** guia ETL multi-step sem hardcode
5. **MongoDB + filesystem** — padrão analytics: ingest → query → report file
6. Base para aulas seguintes do módulo 03 (trends, MCP do zero, etc.)

---

## Próximos passos sugeridos (estudo)

- Inspecionar `reports/` após rodar `npm run dev`
- Ver collections no mongo-express
- Adicionar terceiro MCP (ex.: HTTP fetch)
- Comparar com [05-mcps-do-zero](../05-mcps-do-zero-z/classroom/) — lado producer

---

## Evolução Módulo 03

| Aula | Tema |
|------|------|
| **01** | **Múltiplos MCP + agent** |
| 02+ | Outros agentes (Google Trends, etc.) |
| 05 | Criar servidor MCP |
