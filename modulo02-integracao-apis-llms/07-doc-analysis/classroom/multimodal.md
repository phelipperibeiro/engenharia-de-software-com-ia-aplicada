# Análise multimodal de documentos (Aula 07)

Esta aula fecha o módulo 02 com **Q&A sobre PDF**: o arquivo vai direto para um **modelo com visão** — sem chunking, sem embeddings, sem Neo4j.

---

## Três formas de "RAG" no módulo

```
+-------------+---------------------------+---------------------------+
| Abordagem   | Aula                      | Como obtém contexto       |
+-------------+---------------------------+---------------------------+
| Roteamento  | 01                        | N/A (só chat)             |
| Graph RAG   | 06                        | Cypher → Neo4j            |
| Multimodal  | 07 (esta)                 | PDF inteiro → vision LLM  |
| Vetorial    | (conceito, não neste repo)| chunks + embedding search |
+-------------+---------------------------+---------------------------+
```

**Esta aula não implementa** indexação vetorial. O modelo **lê** o PDF via API multimodal (como "ver" páginas).

---

## Fluxo de dados

```
Upload PDF (multipart)
      │
      v
buffer → base64 → state.documentBase64
      │
      v
HumanMessage(question) + PDF em content block
      │
      v
Modelo vision (Gemini) → resposta textual
```

---

## Por que base64 no estado?

| Campo | Função |
|-------|--------|
| `documentBase64` | PDF serializado para o LangGraph transportar até o nó |
| `messages` | Pergunta do usuário (`HumanMessage`) |

O OpenRouter recebe:

```typescript
{
  type: "image_url",
  image_url: {
    url: `data:application/pdf;base64,${documentBase64}`
  }
}
```

Formato **data URL** — padrão para múltiplos provedores vision.

---

## Modelo vision (config)

Padrão: `google/gemini-2.5-flash-lite-preview-09-2025`

Alternativas comentadas no `config.ts`:

- `anthropic/claude-3.5-sonnet`
- `openai/gpt-4o`
- `google/gemini-pro-vision`

Precisa ser modelo que aceite **PDF/imagem** na API — modelos só-texto não funcionam.

---

## API HTTP — multipart

`POST /chat` (porta **4000**):

| Campo form | Tipo | Regra |
|------------|------|-------|
| `file` | PDF | `application/pdf`, máx. 10 MB |
| `question` | string | mín. 3 caracteres |

Resposta:

```json
{
  "filename": "...",
  "question": "...",
  "answer": "...",
  "error": null
}
```

---

## Grafo propositalmente simples

```
START → answerGeneration → END
```

Toda a "inteligência" está no **modelo multimodal**, não em pipeline de nós. LangGraph organiza o fluxo e permite evoluir depois (OCR, chunking, citações).

---

## Documento de exemplo

O `index.ts` testa com (se existir em `docs/`):

`a-comprehensive-overview-of-large-language-models.pdf`

Paper: https://arxiv.org/pdf/2307.06435

Pergunta padrão: *"describe what's on this document"*

---

## Limitações pedagógicas (importante)

| Limitação | Implicação |
|-----------|------------|
| PDF inteiro de uma vez | PDFs muito grandes podem estourar contexto/custo |
| Sem citações de página | Resposta não aponta trecho exato |
| Sem vector store | Não escala para milhares de docs |
| Confiança no modelo | Alucinação ainda possível — validar respostas críticas |

Para produção em escala: chunking + embeddings + rerank (RAG vetorial) ou pipeline híbrido.

---

## Resumo em uma frase

**Envie o PDF + pergunta a um LLM vision via OpenRouter — análise de documento sem pipeline de retrieval separado.**

Comparar com aula 06: [neo4j-rag.md](../06-rag-neo4j-students-z/classroom/neo4j-rag.md).
