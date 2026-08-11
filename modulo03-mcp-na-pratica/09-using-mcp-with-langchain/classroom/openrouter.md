# OpenRouter (Aula 09)

`OpenRouterService` com **`createAgent`** + **callbacks LangChain** para observar tool calling em tempo real.

Arquivo: `src/services/openRouterService.ts`

---

## createAgent + tools MCP

```typescript
const agentConfig = schema
  ? { responseFormat: providerStrategy(schema), tools: [] }
  : { tools: await this.#getTools() };

const agent = createAgent({ ...agentConfig, model: this.llmClient });
const data = await agent.invoke({ messages }, { callbacks: [...] });
```

Nó `agent` **não** passa schema → carrega MCP tools lazy via `#getTools()`.

---

## Lazy loading

```typescript
async #getTools() {
  if (!this.tools.length) {
    this.tools = await getMCPTools();  // spawna npx subprocesses
  }
  return this.tools;
}
```

Primeira chamada conecta customers-mcp + filesystem — pode demorar alguns segundos.

---

## Callbacks de observabilidade

| Callback | Log |
|----------|-----|
| `handleChatModelStart` | última message enviada ao LLM |
| `handleLLMEnd` | tools decididas (`tool_calls`) |
| `handleToolStart` | nome + input da tool |
| `handleToolEnd` | output da tool |

Exemplo console:

```
🧠 LLM thinking...
🎯 Decided to call: create_customer
🔧 Tool called: create_customer → { name: "...", phone: "..." }
✅ Tool done: create_customer → ...
```

Útil para debugar loops de agente e entender decisões do LLM.

---

## Config

`src/config.ts`:

```typescript
models: ['arcee-ai/trinity-large-preview:free'],
provider: { sort: { by: 'throughput', partition: 'none' } },
temperature: 0.7,
maxTokens: 2048,
```

Requer `OPENROUTER_API_KEY` no `.env`.

---

## LangSmith (opcional)

```env
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=transforming-services-into-tools
LANGSMITH_API_KEY=...
```

Complementa callbacks locais com trace na UI LangSmith.

---

## Resumo em uma frase

**createAgent com tools MCP lazy-loaded e callbacks que logam cada decisão e execução de tool — OpenRouter como backend LLM.**

MCP: **[langchain-mcp.md](./langchain-mcp.md)**
