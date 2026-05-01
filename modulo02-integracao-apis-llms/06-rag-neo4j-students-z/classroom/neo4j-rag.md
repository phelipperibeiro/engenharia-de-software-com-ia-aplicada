# Neo4j & Graph RAG nesta aula (06)

Esta aula implementa **Graph RAG** (não RAG por embeddings): a pergunta vira **Cypher**, o Neo4j retorna **dados reais** e o LLM só **interpreta** os resultados — reduz alucinação em analytics.

---

## Graph RAG vs RAG clássico

```
RAG vetorial (aulas comuns):
  pergunta → embedding → busca chunks similares → LLM responde com trechos

Graph RAG (esta aula):
  pergunta → LLM gera Cypher → Neo4j executa → LLM sintetiza números/nomes reais
```

| | Vetorial | Graph (esta aula) |
|---|----------|-------------------|
| Fonte | Texto indexado | Grafo estruturado |
| Consulta | Similaridade | Cypher gerado |
| Melhor para | Docs, PDFs | Relacionamentos, agregações |
| Risco | Chunk errado | Cypher errado (mitigado com correção) |

---

## Modelo de dados (EW Academy)

Gerado por `data/seedHelpers.ts` + `courses.json`:

```
(Student)-[:PURCHASED {status, paymentMethod, paymentDate, amount}]->(Course)
(Student)-[:PROGRESS {progress: 0-100}]->(Course)
```

| Nó / Rel | Campos importantes |
|----------|-------------------|
| `Course` | `name`, `url` |
| `Student` | `id`, `name`, `email`, `phone` |
| `PURCHASED` | `status`: `"paid"` \| `"refunded"` |
| `PURCHASED` | `paymentMethod`: `"pix"` \| `"credit_card"`, `amount` |
| `PROGRESS` | `progress` percentual |

---

## Regras de negócio (`salesContext.ts`)

- Receita: filtrar `status = "paid"`
- Refunds excluídos de analytics
- Progresso só em cursos comprados (paid)
- Um par student-course por compra/progresso

O contexto é injetado no prompt do **gerador de Cypher**.

---

## Neo4jService

| Método | Função |
|--------|--------|
| `getSchema()` | Schema do grafo via `Neo4jGraph` (LangChain) — vai no prompt |
| `validateQuery()` | `EXPLAIN {query}` antes de executar |
| `query()` | Executa Cypher e retorna registros |
| `clearDatabase()` | Limpa nós (seed) |

Conexão: `neo4j://localhost:7687`, user `neo4j`, password `password`.

---

## Infraestrutura

```bash
npm run docker:infra:up   # Neo4j 5.14 + Browser :7474, Bolt :7687
```

Seed (testes E2E rodam automaticamente no `before`):

- 20 alunos faker
- Vendas e progressos aleatórios
- 10 cursos reais da EW Academy em `courses.json`

---

## Text-to-Cypher + self-correction

1. LLM gera query com schema + regras + exemplos
2. `EXPLAIN` valida sintaxe
3. Se falhar → nó `cypherCorrection` (1 tentativa, `maxCorrectionAttempts: 1`)
4. Reexecuta no `cypherExecutor`

Isso é **self-healing query** — padrão comum em produção.

---

## Multi-step (perguntas complexas)

`queryPlanner` pode decompor em até 3 sub-perguntas:

```
"Compare revenue high vs low completion courses"
  → subQ1, subQ2, subQ3
  → loop: cypherGenerator → cypherExecutor (por step)
  → analyticalResponse sintetiza subResults
```

---

## API HTTP

`POST /sales` com `{ "question": "..." }` → `{ answer, followUpQuestions, query, error? }`

---

## Resumo em uma frase

**Neo4j é a fonte da verdade; o LLM traduz perguntas em Cypher e explica os resultados — isso é Graph RAG para analytics de vendas.**

Browser: http://localhost:7474
