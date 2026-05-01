# LangGraph nesta aula (06) — Sales Analytics QA

Pipeline **Text-to-Cypher** com correção automática e decomposição multi-step — o grafo mais completo do módulo 02 até aqui.

---

## Fluxo completo

```
START → extractQuestion → queryPlanner → cypherGenerator → cypherExecutor
                                    ↑                           |
                                    |         needsCorrection?  |
                                    |              ↓            |
                                    └── cypherCorrection ←──────┘
                                    |
                                    |  isMultiStep + mais steps?
                                    └── cypherGenerator (loop)
                                    |
                                    └── analyticalResponse → END
```

---

## Estado (`SalesStateAnnotation`)

| Grupo | Campos |
|-------|--------|
| Entrada | `messages`, `question` |
| Cypher | `query`, `originalQuery` |
| Execução | `dbResults` |
| Correção | `correctionAttempts`, `validationError`, `needsCorrection` |
| Multi-step | `isMultiStep`, `subQuestions`, `currentStep`, `subQueries`, `subResults` |
| Saída | `answer`, `followUpQuestions` |
| Erro | `error` |

---

## Nós (7)

| Nó | LLM | Função |
|----|-----|--------|
| `extractQuestion` | Não | Última mensagem → `question` |
| `queryPlanner` | Sim | Simple vs complex; subQuestions |
| `cypherGenerator` | Sim | Schema + context → Cypher |
| `cypherExecutor` | Não | EXPLAIN + query Neo4j |
| `cypherCorrection` | Sim | Corrige query com erro |
| `analyticalResponse` | Sim | Resposta + follow-ups |

---

## Arestas condicionais

### Após `extractQuestion`

```typescript
state.error ? END : 'queryPlanner'
```

### Após `cypherExecutor`

1. `needsCorrection && correctionAttempts < 1` → `cypherCorrection`
2. `isMultiStep && currentStep < subQuestions.length` → `cypherGenerator` (próximo step)
3. Senão → `analyticalResponse`

### Loop de correção

```
cypherExecutor (fail) → cypherCorrection → cypherExecutor (retry)
```

Máximo **1** correção (`config.maxCorrectionAttempts`).

### Loop multi-step

```
queryPlanner define subQuestions[0..n]
currentStep incrementa após cada execução bem-sucedida
cypherGenerator usa subQuestions[currentStep] como pergunta alvo
subQueries e subResults acumulam histórico
```

---

## Sem persistência de thread

`workflow.compile()` **sem** checkpointer — cada `POST /sales` é stateless (diferente da aula 04).

---

## Factory

```typescript
buildSalesGraph(llmClient, neo4jService)
```

`server.ts` expõe `POST /sales` e fecha Neo4j no `onClose`.

---

## Prompts versionados (`prompts/v1/`)

| Arquivo | Nó |
|---------|-----|
| `queryAnalyzer.ts` | queryPlanner |
| `cypherGenerator.ts` | cypherGenerator |
| `cypherCorrection.ts` | cypherCorrection |
| `analyticalResponse.ts` | analyticalResponse |
| `salesContext.ts` | contexto de negócio |
| `nlpResponse.ts` | (auxiliar se usado) |

---

## Comparação com aulas anteriores

| | 03 Medical | 06 RAG Neo4j |
|---|------------|--------------|
| Domínio | agendamento | vendas/academy |
| Dados | array memória | Neo4j grafo |
| LLM steps | 2 | 4 |
| Loop | não | correção + multi-step |
| Grounding | parcial | dbResults reais |

---

## Resumo em uma frase

**LangGraph encadeia planejar → gerar Cypher → executar → corrigir/repetir → responder com dados do grafo.**

Detalhes Neo4j: **[neo4j-rag.md](./neo4j-rag.md)**
