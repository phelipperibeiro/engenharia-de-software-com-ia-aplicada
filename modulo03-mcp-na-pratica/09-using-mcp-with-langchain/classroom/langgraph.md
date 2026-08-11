# LangGraph (Aula 09)

Grafo **simplificado** vs aula 01 — um nó `agent` com **retry condicional** em erro.

Arquivo: `src/graph/graph.ts`

---

## Fluxo

```
START --> agent --+--> END (sucesso)
                  |
                  +--> agent (retry se error)
```

```typescript
new StateGraph(GraphAnnotation)
  .addNode('agent', agentNode(openRouterService))
  .addEdge(START, 'agent')
  .addConditionalEdges('agent', (state) =>
    state.error ? 'agent' : END
  )
  .compile();
```

| Estado | Próximo nó |
|--------|------------|
| `error` definido | volta para `agent` (retry) |
| sem error | END |

Sem `intentParser` — o agente decide tools direto pelo prompt.

---

## Estado (GraphAnnotation)

| Campo | Uso |
|-------|-----|
| `messages` | HumanMessage in, AIMessage out |
| `answer` | resposta final textual |
| `error` | trigger de retry |
| `intent`, `fileType`, ... | reservados (legado aula 01) |

---

## agentNode

`src/graph/nodes/agentNode.ts`:

```
1. Lê última message do usuário
2. openRouterService.generateStructured(systemPrompt, question)
   (sem schema → tool calling)
3. Sucesso → { answer, messages: AIMessage, error: undefined }
4. Falha   → { messages: fallback, error: message }
```

Prompt (`prompts/v1/agentNode.ts`):

- Operações de customer via tools
- Perguntas gerais respondidas direto
- Idioma do usuário
- JSON válido ao salvar arquivos
- Executar autonomamente (sem pedir confirmação)
- Retry se tool falhar

---

## API HTTP

`src/server.ts`:

```
POST /chat
Body: { "question": "..." }  (min 10 chars)
Response: answer ou última AIMessage
```

Porta **3000**.

---

## Retry loop — cuidado

```
agent falha → error set → agent de novo → ...
```

Útil para falhas transitórias (rate limit, timeout). Em produção, limite max retries para evitar loop infinito (não implementado neste repo — ponto de melhoria).

---

## vs Aula 01

| | Aula 01 | Aula 09 |
|---|---------|---------|
| Nós | intentParser + agent | **agent only** |
| Intent | structured output Zod | prompt no system |
| Edges | linear | **conditional retry** |
| Domínio | ETL vendas CSV | **customers MCP** |

---

## Resumo em uma frase

**Grafo de um nó com retry em error — agente autônomo usa customers-mcp + filesystem via tool calling.**

OpenRouter: **[openrouter.md](./openrouter.md)**
