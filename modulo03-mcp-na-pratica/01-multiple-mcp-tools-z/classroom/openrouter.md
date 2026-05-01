# OpenRouter nesta aula (01)

Site: **[openrouter.ai](https://openrouter.ai/)**

O `OpenRouterService` tem **dois modos** no mesmo método `generateStructured` — comportamento muda conforme passa ou não um schema Zod.

---

## Modo 1: Saída estruturada (sem tools)

Usado pelo nó **`intentParser`**.

```typescript
generateStructured(systemPrompt, userPrompt, IntentSchema)
// → agent com responseFormat + tools: []
```

Extrai:

| Campo | Conteúdo |
|-------|----------|
| `intent` | O que o usuário quer (sem colar CSV no intent) |
| `fileContent` | Bloco CSV/JSON bruto da mensagem |
| `fileName` | Nome inferido (ex.: `sales.csv`) |
| `fileType` | `csv` \| `json` \| `unknown` |

---

## Modo 2: Agente com tools (sem schema)

Usado pelo nó **`agent`**.

```typescript
generateStructured(systemPrompt, userMessage)
// → agent com tools: await getMCPTools()
```

- LLM decide **quais tools** chamar e em **quantas rodadas**
- Retorna texto final (`data.messages.at(-1).text`)
- Callbacks logam thinking, tool start/end

Modelo: `arcee-ai/trinity-large-preview:free` (config)

---

## Por que separar intent e agent?

```
Pergunta longa (texto + CSV embutido)
        │
        v
  intentParser (structured)     ← separa intent vs dados
        │
        v
  agent (tools)               ← recebe campos limpos, foca em executar
```

Evita que o agente com tools precise "adivinhar" o CSV dentro de texto livre.

---

## createAgent (LangChain)

```typescript
const agent = createAgent({
  model: llmClient,
  tools: await getMCPTools(),  // ou [] com schema
  responseFormat: providerStrategy(schema)  // só no intent
})
await agent.invoke({ messages }, { callbacks: [...] })
```

---

## Variáveis de ambiente

```
OPENROUTER_API_KEY=...
LANGSMITH_API_KEY=...   # opcional — traces
LANGCHAIN_PROJECT=01-multiple-mcp-tools-template
```

---

## Resumo em uma frase

**OpenRouter alimenta dois perfis de agente: extrator estruturado (intent) e executor multi-tool (MCP + csv_to_json).**

Mais: [aula 01 mod 02 — openrouter.md](../../modulo02-integracao-apis-llms/01-smart-model-router-gateway/classroom/openrouter.md)
