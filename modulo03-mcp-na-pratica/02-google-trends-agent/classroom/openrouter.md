# OpenRouter nesta aula (02)

Cliente LLM via OpenRouter com **`createAgent`** do LangChain — alternando entre **tool calling** e **saída estruturada**.

---

## OpenRouterService

Arquivo: `src/services/openRouterService.ts`

### ChatOpenAI apontando pro OpenRouter

```typescript
new ChatOpenAI({
  apiKey: config.apiKey,
  modelName: config.models[0],
  configuration: {
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': config.httpReferer,
      'X-Title': config.xTitle,
    },
  },
  modelKwargs: {
    models: config.models,      // fallback list
    provider: config.provider,  // sort by throughput
  },
});
```

---

## generateStructured — dois modos

```typescript
async generateStructured(systemPrompt, userPrompt, schema?) {
  const agentConfig = schema
    ? { responseFormat: providerStrategy(schema), tools: [] }
    : { tools: this.tools };

  const agent = createAgent({ ...agentConfig, model: this.llmClient });
  const data = await agent.invoke({ messages: [...] });

  return {
    data: schema
      ? data.structuredResponse
      : data.messages.at(-1)?.text,
  };
}
```

| Modo | `schema` | Tools | Uso nesta aula |
|------|----------|-------|----------------|
| **Agent + tools** | omitido | MCP + google_trends | researcher, responder |
| **Structured output** | Zod passado | `[]` (desligadas) | disponível, não usado nos nós |

---

## Tool calling no researcher

1. `getMCPTools()` carrega filesystem MCP + `google_trends`
2. Agente recebe system prompt (`keywords.ts`): extrair 2 keywords, chamar tool 1x
3. Loop interno: LLM → tool call → SerpAPI → LLM sintetiza
4. Retorno: texto da última mensagem → vira `trendsData`

---

## Config de modelos

Arquivo: `src/config.ts`

```typescript
models: ['arcee-ai/trinity-large-preview:free'],
provider: {
  sort: { by: 'throughput', partition: 'none' },
},
temperature: 0.7,
maxTokens: 2048,
```

Modelos comentados no config: gpt-oss, qwen, mistral — fácil trocar.

---

## Variáveis de ambiente

| Variável | Obrigatória | Uso |
|----------|-------------|-----|
| `OPENROUTER_API_KEY` | sim | LLM |
| `SERPAPI_API_KEY` | sim* | Google Trends (*fixture se `disabled: true`) |
| `LANGSMITH_API_KEY` | opcional | tracing |
| `LANGCHAIN_TRACING_V2` | opcional | observabilidade |

---

## Schemas Zod (preparados)

| Schema | Arquivo | Usado? |
|--------|---------|--------|
| `KeywordsSchema` | `prompts/v1/keywords.ts` | não (tool calling em vez de structured) |
| `VideoTrendsSchema` | `prompts/v1/videoTrends.ts` | não (mesmo motivo) |

Comentário em `keywords.ts` explica a escolha: limitar a **1 tool call** com array de keywords vs múltiplas chamadas em loop de reasoning.

---

## Observabilidade

Com LangSmith habilitado (`.env.example`):

```env
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=transforming-services-into-tools
```

Logs locais: `console.log('✅ LLM Response:', ...)` após cada invoke.

---

## Resumo em uma frase

**OpenRouter alimenta `createAgent` — com tools para pesquisar trends, com `providerStrategy` quando quiser Zod estruturado.**

Tools: **[tools.md](./tools.md)**
