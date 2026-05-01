# Aula 06 — RAG Neo4j Students (Sales Analytics)

## Contexto no curso

Sexta aula do **Módulo 02**. Você constrói um **assistente de analytics de vendas** da EW Academy que responde perguntas em linguagem natural consultando um **grafo Neo4j** — padrão **Graph RAG / Text-to-Cypher**.

> Ferramentas: **[neo4j-rag.md](./neo4j-rag.md)** · **[openrouter.md](./openrouter.md)** · **[langgraph.md](./langgraph.md)**

---

## O que você está construindo

API `POST /sales` que aceita perguntas como:

- *"List all available courses"*
- *"Who bought Formação JavaScript Expert?"*
- *"What is the total revenue from credit card payments?"*
- *"Show me the revenue distribution across all courses"*

Resposta: texto analítico + **follow-up questions** sugeridas + query Cypher usada.

---

## Por que Graph RAG aqui

Dados são **relacionais** (aluno comprou curso, tem progresso, método de pagamento). Neo4j expressa joins e agregações; o LLM não inventa números — lê `dbResults`.

---

## Arquitetura

```
Cliente → Fastify POST /sales
       → LangGraph (7 nós)
       → OpenRouter (4 chamadas LLM)
       → Neo4j (schema + execute)
       → { answer, followUpQuestions, query }
```

| Camada | Arquivos |
|--------|----------|
| HTTP | `server.ts`, `index.ts` |
| Grafo | `graph/graph.ts`, `factory.ts` |
| Nós | `graph/nodes/*.ts` |
| LLM | `openrouterService.ts`, `prompts/v1/*` |
| Banco | `neo4jService.ts`, `docker-compose.yaml` |
| Dados | `data/courses.json`, `data/seedHelpers.ts` |

---

## Modelo de grafo (resumo)

```
Student -[:PURCHASED]-> Course
Student -[:PROGRESS]-> Course
```

Seed: 20 alunos, vendas faker, 10 cursos reais.

Regras: receita só `paid`; refunds fora; progress 0–100.

---

## Pipeline em 7 passos

1. **extractQuestion** — texto da pergunta
2. **queryPlanner** — simples ou decompor em sub-perguntas (máx. 3)
3. **cypherGenerator** — LLM + schema Neo4j → Cypher
4. **cypherExecutor** — valida (`EXPLAIN`) e executa
5. **cypherCorrection** — (opcional) corrige query inválida
6. **Loop** — multi-step volta ao gerador; correção volta ao executor
7. **analyticalResponse** — LLM explica dados + sugere perguntas follow-up

---

## Self-correction

Query inválida → `needsCorrection: true` → LLM recebe erro + query original → nova query → reexecução.

Limite: **1** tentativa (`maxCorrectionAttempts: 1`).

---

## Multi-step

Perguntas comparativas ou com várias agregações → `queryPlanner` retorna `subQuestions[]`.

Cada step gera e executa seu Cypher; `analyticalResponse` **sintetiza** todos os `subResults`.

---

## Como rodar

```bash
npm install
cp .env.example .env
# OPENROUTER_API_KEY

npm run docker:infra:up
npm run dev          # servidor
npm test             # E2E (seed + 10 cenários)
npm run langgraph:serve
```

Exemplo:

```bash
curl -X POST http://localhost:3000/sales \
  -H "Content-Type: application/json" \
  -d '{"question":"List all available courses"}'
```

Neo4j Browser: http://localhost:7474

---

## Testes E2E (`sales.e2e.test.ts`)

| Cenário | O que valida |
|---------|--------------|
| List courses | Nomes JavaScript/Node no answer |
| Who bought course | Resposta analítica |
| Credit card revenue | Métricas |
| Revenue distribution | Percentuais/números |
| 100% progress | Insights |
| Payment methods | Comparativo |
| Edge cases | Progress sem compra, weather question |
| Follow-ups | ≥ 2 sugestões |

`before`: `seedDatabase()` limpa e repovoa Neo4j.

---

## Resposta HTTP

```json
{
  "answer": "...",
  "followUpQuestions": ["...", "..."],
  "query": "MATCH ...",
  "error": null
}
```

---

## Takeaways

1. **Grounding** — resposta final amarrada a `dbResults`, não ao “conhecimento” do modelo
2. **Schema no prompt** — essencial para Cypher correto
3. **Regras de domínio** (`SALES_CONTEXT`) — evitam receita com refund
4. **Decomposição** — perguntas complexas em steps menores
5. **Auto-correção** — resiliência a syntax errors do LLM
6. **Follow-ups** — UX de explorador de dados conversacional

---

## Próximos passos sugeridos (estudo)

- Abrir Neo4j Browser e rodar manualmente o `query` retornado pela API
- Perguntar algo multi-step e inspecionar `subQueries` no estado (LangSmith)
- Adicionar cache de queries frequentes
- Comparar com RAG vetorial da aula 07 (doc analysis)

---

## Evolução no módulo

| Aula | Tema |
|------|------|
| 05 | Segurança |
| **06** | **Graph RAG + Neo4j** |
| 07 | Análise de documentos |
