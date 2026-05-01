# LangGraph nesta aula (02)

Grafo **linear de 2 nós** — separar **pesquisa** (tool calling) de **resposta** (análise para o usuário).

---

## Fluxo

```
START --> researcher --> responder --> END
              |              |
         trendsData      AIMessage
         question         (resposta final)
```

Arquivo: `src/graph/graph.ts`

```typescript
new StateGraph(GraphAnnotation)
  .addNode('researcher', createResearcherNode(openRouterService))
  .addNode('responder', createResponderNode(openRouterService))
  .addEdge(START, 'researcher')
  .addEdge('researcher', 'responder')
  .addEdge('responder', END)
  .compile();
```

---

## Estado (GraphAnnotation)

Arquivo: `src/graph/state.ts`

| Campo | Tipo | Quem preenche |
|-------|------|---------------|
| `messages` | `BaseMessage[]` | Entrada (`HumanMessage`) + saída (`AIMessage`) |
| `trendsData` | `string?` | researcher |
| `question` | `string?` | researcher |
| `keywords` | `string[]?` | reservado (não usado nos nós atuais) |

`messages` usa `MessagesZodMeta` — reducer padrão LangGraph para histórico.

---

## Nó 1: researcher

Arquivo: `src/graph/nodes/researcherNode.ts`

```
Entrada: última message do usuário
    |
    v
OpenRouterService.generateStructured(keywordsPrompt, userQuestion)
    |  (sem schema → agente COM tools)
    v
LLM extrai keywords → chama google_trends
    |
    v
Saída: { trendsData, question }
```

- `trendsData` = texto da última mensagem do agente (após tool calls)
- Em erro: mensagem fallback em `trendsData`

---

## Nó 2: responder

Arquivo: `src/graph/nodes/responderNode.ts`

```
Entrada: question + trendsData
    |
    v
OpenRouterService.generateStructured(responderPrompt, userPrompt)
    |
    v
Saída: { messages: [new AIMessage(content)] }
```

Prompt (`src/prompts/v1/videoTrends.ts`):

- Análise data-driven do título de vídeo
- Recomendações concretas (confirmar, melhorar, alternativas)
- **Mesmo idioma do usuário** (preferência PT-BR)

Existe `VideoTrendsSchema` no arquivo de prompts, mas o nó **não** passa schema — usa tool calling mode como o researcher.

---

## API HTTP

Arquivo: `src/server.ts`

```
POST /chat
Body: { "question": "..." }  (min 10 chars)
Response: texto da última AIMessage
```

Factory: `src/graph/factory.ts` → `buildGraph()` instancia `OpenRouterService` + grafo.

Entry: `src/index.ts` — Fastify na porta **3000** + request de smoke test via `app.inject()`.

---

## Por que 2 nós?

| Monolito (1 nó) | 2 nós (esta aula) |
|-----------------|-------------------|
| Mistura tool call + redação | Pesquisa isolada da síntese |
| Difícil debugar | Logs por etapa (`🔍 Researcher`, `💬 Responder`) |
| Prompt gigante | Prompts especializados em arquivos |

Padrão **research → synthesize** comum em agents de produção.

---

## LangGraph Studio

`langgraph.json` na raiz — comando:

```bash
npm run langgraph:serve
```

---

## Resumo em uma frase

**researcher busca trends via tools; responder transforma dados em recomendação de conteúdo — pipeline linear em LangGraph.**

OpenRouter: **[openrouter.md](./openrouter.md)**
