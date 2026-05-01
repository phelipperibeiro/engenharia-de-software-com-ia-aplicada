# Aula 07 — Doc Analysis (Q&A sobre PDF)

## Contexto no curso

Última aula do **Módulo 02**. Depois de Graph RAG com Neo4j (aula 06), você aprende **análise de documentos com modelos multimodais**: enviar um PDF e uma pergunta; o LLM vision responde com base no conteúdo visual/textual do arquivo.

> Ferramentas: **[multimodal.md](./multimodal.md)** · **[openrouter.md](./openrouter.md)** · **[langgraph.md](./langgraph.md)**

**Paper de referência:** [A Comprehensive Overview of Large Language Models](https://arxiv.org/pdf/2307.06435)

---

## O que você está construindo

Servidor na porta **4000** com endpoint:

```
POST /chat  (multipart/form-data)
  file: documento.pdf
  question: sua pergunta
```

Resposta JSON com `answer` interpretando o PDF.

---

## Ideia central

```
PDF + pergunta  →  modelo vision  →  resposta
```

**Não há** neste projeto:

- Chunking de texto
- Embeddings / vector DB
- Retrieval semântico
- Neo4j

O modelo recebe o documento **inteiro** (até o limite do contexto) via base64.

---

## Arquitetura

| Camada | Arquivo | Função |
|--------|---------|--------|
| Bootstrap | `index.ts` | Sobe server + teste automático com PDF default |
| HTTP | `server.ts` | Multipart, validação PDF 10MB, base64 |
| Grafo | `graph/graph.ts` | 1 nó |
| Nó | `answerGenerationNode.ts` | Chama multimodal |
| LLM | `openrouterService.ts` | `generateWithDocument` |
| Config | `config.ts` | Gemini vision + OpenRouter |

---

## Fluxo passo a passo

1. Cliente envia `multipart`: `file` (PDF) + `question`
2. Fastify valida mimetype e tamanho
3. `buffer.toString('base64')` → `documentBase64`
4. `graph.invoke({ messages: [HumanMessage(question)], documentBase64 })`
5. `answerGeneration` monta mensagem multimodal
6. OpenRouter → Gemini (ou fallback da lista `models[]`)
7. API retorna `{ filename, question, answer }`

---

## Estado do grafo

```typescript
messages, documentBase64, error?
```

---

## Modelo multimodal

Default: `google/gemini-2.5-flash-lite-preview-09-2025`

Deve suportar PDF/imagem na API OpenRouter.

---

## Como rodar

```bash
npm install
cp .env.example .env
# OPENROUTER_API_KEY

npm run dev    # http://0.0.0.0:4000
```

Exemplo curl:

```bash
curl -X POST http://localhost:4000/chat \
  -F "file=@document.pdf" \
  -F "question=What is the main topic of this paper?"
```

Coloque PDFs em `docs/` para o teste automático do `index.ts`.

---

## LangSmith (opcional)

```
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=07-doc-analysis
```

---

## Comparação com aula 06

| Critério | Aula 06 Graph RAG | Aula 07 Doc Analysis |
|----------|-------------------|---------------------|
| Fonte | Grafo Neo4j | Arquivo PDF |
| Consulta | Cypher gerado | Vision nativa |
| Complexidade grafo | 7 nós | 1 nó |
| Grounding | `dbResults` SQL-like | Conteúdo do PDF |
| Escala | Milhares de registros | PDFs individuais |
| API | JSON | Multipart |

---

## Takeaways

1. **Multimodal ≠ RAG vetorial** — atalho poderoso para docs únicos ou pequenos
2. **Base64 + data URL** — padrão comum em APIs vision
3. **Validação HTTP** — tipo MIME, tamanho, pergunta mínima
4. **Grafo mínimo** — LangGraph como casca extensível
5. **Escolha do modelo** — precisa capability vision/PDF no OpenRouter
6. Fecha o arco do módulo: roteamento → grafo → domínio → memória → segurança → graph DB → **documentos**

---

## Próximos passos sugeridos (estudo)

- Testar com PDF de muitas páginas e observar limites
- Adicionar nó de resumo antes da resposta (pipeline 2 steps)
- Comparar qualidade: multimodal vs extrair texto + RAG chunks
- Integrar guardrails da aula 05 no upload/pergunta

---

## Fechamento do Módulo 02

| # | Tema |
|---|------|
| 01 | OpenRouter / roteamento |
| 02 | LangGraph intro |
| 03 | Prompt chaining (medical) |
| 04 | Memória |
| 05 | Guardrails |
| 06 | Graph RAG Neo4j |
| **07** | **Doc analysis multimodal** |
