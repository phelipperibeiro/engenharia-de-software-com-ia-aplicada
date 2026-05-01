# OpenRouter nesta aula (06)

Site: **[openrouter.ai](https://openrouter.ai/)**

Quatro nós do grafo chamam o LLM via `generateStructured` + Zod — cada um com prompt especializado.

---

## Papel do OpenRouter

| Nó | Prompt | Schema | Saída |
|----|--------|--------|-------|
| `queryPlanner` | `queryAnalyzer.ts` | `QueryAnalysisSchema` | simple/complex, subQuestions |
| `cypherGenerator` | `cypherGenerator.ts` | `CypherQuerySchema` | `{ query }` |
| `cypherCorrection` | `cypherCorrection.ts` | `CypherCorrectionSchema` | `{ correctedQuery, explanation }` |
| `analyticalResponse` | `analyticalResponse.ts` | `AnalyticalResponseSchema` | `{ answer, followUpQuestions }` |

Nós **sem LLM**: `extractQuestion`, `cypherExecutor` (só Neo4j).

---

## Integração

`openRouterService.ts`:

- `ChatOpenAI` + OpenRouter API
- `createAgent` + `providerStrategy(schema)`
- Modelo: `arcee-ai/trinity-large-preview:free`
- `provider.sort.by: throughput`

---

## Por que structured output em cada etapa

| Etapa | Sem schema | Com schema |
|-------|------------|------------|
| Planner | Texto livre difícil de rotear | `requiresDecomposition` booleano |
| Cypher | Markdown ```cypher``` quebra executor | Campo `query` limpo |
| Response | Prosa sem follow-ups | `answer` + `followUpQuestions[]` |

---

## Contexto injetado nos prompts

**Gerador Cypher** recebe:

- Schema Neo4j dinâmico (`getSchema()`)
- `SALES_CONTEXT` (regras paid/refunded)
- Exemplos de queries complexas no system prompt

**Resposta analítica** recebe:

- Pergunta original
- Query executada
- `dbResults` JSON **ou** síntese multi-step

---

## analyticalResponse — 3 modos

1. **Erro** → `handleErrorResponse`
2. **Sem resultados** → `handleNoResultsResponse`
3. **Sucesso** → simples ou `getMultiStepSynthesisPrompt`

---

## Variáveis de ambiente

```
OPENROUTER_API_KEY=...
```

Testes E2E: Neo4j + OpenRouter reais.

---

## Resumo em uma frase

**OpenRouter orquestra planejamento, geração/correção de Cypher e redação analítica — sempre com JSON validado por Zod.**

Mais: [aula 01 — openrouter.md](../01-smart-model-router-gateway/classroom/openrouter.md).
