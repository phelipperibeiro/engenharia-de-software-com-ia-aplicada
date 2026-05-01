# Mapa mental — RAG Neo4j Students (Aula 06)

## Visão em árvore (texto)

```
RAG Neo4j Sales Analytics (Aula 06)
│
├── Objetivo da aula
│   ├── Graph RAG (Text-to-Cypher)
│   ├── Perguntas NL → analytics reais
│   └── Self-correction + multi-step
│
├── Neo4j
│   ├── Student, Course
│   ├── PURCHASED, PROGRESS
│   ├── seedHelpers + courses.json
│   ├── docker-compose :7687
│   └── Detalhes: classroom/neo4j-rag.md
│
├── OpenRouter
│   ├── queryPlanner (analyzer)
│   ├── cypherGenerator
│   ├── cypherCorrection
│   ├── analyticalResponse
│   └── Detalhes: classroom/openrouter.md
│
├── LangGraph (7 nós)
│   ├── extractQuestion
│   ├── queryPlanner → cypherGenerator → cypherExecutor
│   ├── loop correção / multi-step
│   └── analyticalResponse → END
│
├── Prompts v1
│   ├── queryAnalyzer, cypherGenerator
│   ├── cypherCorrection, analyticalResponse
│   └── salesContext (regras paid/refund)
│
├── API
│   ├── POST /sales { question }
│   └── answer + followUpQuestions + query
│
├── Testes E2E
│   ├── seed antes dos testes
│   └── 10 cenários sales.e2e.test.ts
│
└── Evolução
    ├── 05 segurança
    └── 07 doc analysis
```

---

## Mapa mental (visão radial)

```
                         +-----------------------------+
                         |   RAG Neo4j Sales QA 06     |
                         +--------------+--------------+
                                        |
        +---------------+---------------+---------------+---------------+
        |               |               |               |               |
   +----+----+     +----+----+     +----+----+     +----+----+     +----+----+
   | Graph   |     |OpenRouter|    |LangGraph|     | Neo4j   |     | Domain  |
   | RAG     |     | 4 LLMs   |     | 7 nós   |     | Cypher  |     | EW Acad |
   +----+----+     +----+----+     +----+----+     +----+----+     +----+----+
        |               |               |               |               |
   Text2Cypher      structured      loops           EXPLAIN+query   paid only
   grounding         Zod             correct/multi   schema          follow-ups
        |               |               |               |               |
        +---------------+---------------+---------------+---------------+
```

---

## Diagrama do grafo

```
                              +-------+
                              | START |
                              +---+---+
                                  |
                                  v
                         +------------------+
                         | extractQuestion  |
                         +--------+---------+
                                  |
                           error? └──► END
                                  |
                                  v
                         +------------------+
                         |  queryPlanner    | (LLM)
                         +--------+---------+
                                  |
                                  v
                         +------------------+
                         | cypherGenerator  | (LLM)
                         +--------+---------+
                                  |
                                  v
                         +------------------+
                         | cypherExecutor   | (Neo4j)
                         +--------+---------+
                                  |
              +-------------------+-------------------+
              |                   |                   |
      needsCorrection         multi-step          ok/fim steps
      attempts < 1            more steps?
              |                   |                   |
              v                   v                   |
     +----------------+    +--------------+           |
     |cypherCorrection|    |cypherGenerator|◄────────┘
     |     (LLM)      |    +--------------+
     +-------+--------+
             |
             └──► cypherExecutor (retry)
                                  |
                                  v
                         +-------------------+
                         | analyticalResponse| (LLM)
                         +---------+---------+
                                   |
                                   v
                               +-------+
                               |  END  |
                               +-------+
```

---

## Modelo de dados (ASCII)

```
    +----------+  PURCHASED {status, amount,     +----------+
    | Student  |  paymentMethod, paymentDate}   |  Course  |
    |          |------------------------------>|          |
    | id       |                                 | name     |
    | name     |  PROGRESS {progress: 0-100}     | url      |
    | email    |------------------------------>|          |
    +----------+                                 +----------+

  status "paid"     → conta em receita
  status "refunded" → excluído de analytics
```

---

## Graph RAG vs alucinação

```
  Sem Neo4j (só LLM):
    "Receita total?" → número inventado

  Com Graph RAG:
    "Receita total?" → Cypher → SUM(amount) → LLM cita valor real
```

---

## Sequência POST /sales

```
  Cliente          Fastify           LangGraph                    Neo4j
     |                |                   |                          |
     | POST question  |                   |                          |
     |--------------->|                   |                          |
     |                | invoke            |                          |
     |                |------------------>|                          |
     |                |                   | planner → generator      |
     |                |                   | (LLM + schema)           |
     |                |                   | executor                 |
     |                |                   |------------------------->|
     |                |                   | dbResults                |
     |                |                   |<-------------------------|
     |                |                   | analyticalResponse (LLM) |
     |                | answer+followUps  |                          |
     |                |<------------------|                          |
     |<---------------|                   |                          |
```

---

## Ligação arquivo ↔ conceito

| Conceito | Onde |
|----------|------|
| Grafo | `src/graph/graph.ts` |
| Estado | `SalesStateAnnotation` em `graph.ts` |
| Extrair pergunta | `extractQuestionNode.ts` |
| Decomposição | `queryPlannerNode.ts` |
| Gerar Cypher | `cypherGeneratorNode.ts` |
| Executar | `cypherExecutorNode.ts` |
| Corrigir | `cypherCorrectionNode.ts` |
| Resposta final | `analyticalResponseNode.ts` |
| Neo4j client | `neo4jService.ts` |
| LLM | `openrouterService.ts` |
| Seed | `data/seedHelpers.ts` |
| HTTP | `server.ts` |
| E2E | `tests/sales.e2e.test.ts` |

---

## Comparação módulo 02 (01–06)

```
+--------+----------+-------------+-------------+-------------+-------------+-------------+
|        | 01       | 02          | 03          | 04          | 05          | 06          |
+--------+----------+-------------+-------------+-------------+-------------+-------------+
| Foco   | roteamento| grafo       | domínio     | memória     | segurança   | Graph RAG   |
| DB     | —        | —           | memória     | PG+SQLite   | MCP FS      | Neo4j       |
| LLM n  | 1        | 0           | 2           | 2           | 2           | 4           |
| Loop   | —        | —           | —           | summarize   | —           | correct+step|
| API    | /chat    | /chat       | /chat       | CLI         | CLI         | /sales      |
+--------+----------+-------------+-------------+-------------+-------------+-------------+
```
