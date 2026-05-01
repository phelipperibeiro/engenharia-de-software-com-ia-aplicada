# LangGraph nesta aula (07) — Document Q&A

O grafo mais **simples** do módulo 02: um único nó entre `START` e `END`. O LangGraph prepara estrutura para crescer; a lógica pesada está no modelo multimodal.

---

## Fluxo

```
START → answerGeneration → END
```

---

## Estado (`DocumentQAStateAnnotation`)

| Campo | Função |
|-------|--------|
| `messages` | `HumanMessage` com a pergunta |
| `documentBase64` | PDF em base64 (preenchido pelo server, não pelo cliente JSON) |
| `error` | Erro opcional no estado |

---

## Nó `answerGeneration`

1. Valida `documentBase64` (senão: "No document found in state")
2. System prompt fixo: assistente que analisa documentos
3. User prompt = texto da última mensagem
4. `llmClient.generateWithDocument(...)`
5. Retorna `AIMessage` com a resposta

Sem checkpointer — cada request é isolado.

---

## Quem prepara o estado?

**Não** é o cliente LangGraph direto — é o **Fastify** em `server.ts`:

```typescript
graph.invoke({
  messages: [new HumanMessage(question)],
  documentBase64,  // lido do upload multipart
});
```

Separação clara:

- **HTTP** — valida PDF, lê buffer, codifica base64
- **Grafo** — orquestra chamada ao LLM
- **OpenRouter** — inferência multimodal

---

## Factory

```typescript
buildDocumentQAGraphInstance() → { graph, llmClient }
```

`langgraph.json` → grafo `doc_analysis`.

---

## Por que usar LangGraph com 1 nó?

| Motivo | Benefício |
|--------|-----------|
| Consistência do módulo | Mesmo padrão das aulas 02–06 |
| Evolução futura | Fácil inserir: OCR → chunk → retrieve → answer |
| LangSmith | Trace do invoke |
| Studio | `npm run langgraph:serve` |

Possíveis nós futuros (não implementados):

```
START → extractPages → summarize → answerGeneration → END
```

---

## Comparação com aula 06

| | Aula 06 | Aula 07 |
|---|---------|---------|
| Nós | 7 | 1 |
| Dados | Neo4j | PDF base64 |
| LLM calls | 4 structured | 1 multimodal |
| API | JSON `{ question }` | multipart file + question |

---

## Resumo em uma frase

**LangGraph encapsula um pipeline de document Q&A de um passo — upload vira estado, nó chama vision LLM, resposta vira AIMessage.**

Detalhes multimodal: **[multimodal.md](./multimodal.md)**
