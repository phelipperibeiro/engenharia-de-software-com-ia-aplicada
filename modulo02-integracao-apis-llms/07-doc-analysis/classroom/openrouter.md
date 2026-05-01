# OpenRouter nesta aula (07)

Site: **[openrouter.ai](https://openrouter.ai/)**

Diferente das aulas com `generateStructured`, aqui o foco é **multimodal**: texto + PDF na mesma mensagem.

---

## Método principal

`generateWithDocument(systemPrompt, userPrompt, documentBase64)` em `openRouterService.ts`:

```typescript
new HumanMessage({
  content: [
    { type: "text", text: userPrompt },
    {
      type: "image_url",
      image_url: {
        url: `data:application/pdf;base64,${documentBase64}`,
      },
    },
  ],
})
```

Compatível com API estilo OpenAI Chat Completions (OpenRouter unifica provedores).

---

## Modelo configurado

```typescript
models: ['google/gemini-2.5-flash-lite-preview-09-2025']
provider.sort.by: 'throughput'
temperature: 0.7
```

Catálogo vision: [openrouter.ai/models](https://openrouter.ai/models) — filtrar modelos com suporte a imagem/PDF.

---

## Resposta

```typescript
{
  model: string,   // qual modelo atendeu (metadata)
  content: string  // resposta em texto
}
```

O nó `answerGeneration` loga o model usado e coloca `content` em `AIMessage`.

---

## Sem structured output nesta aula

| Aula 03–06 | Aula 07 |
|------------|---------|
| Zod + `providerStrategy` | `invoke()` texto livre |
| JSON validado | Prosa natural sobre o PDF |

Adequado para Q&A aberto sobre documentos.

---

## Variáveis de ambiente

```
OPENROUTER_API_KEY=...
LANGSMITH_API_KEY=...        # opcional
LANGCHAIN_PROJECT=07-doc-analysis
```

---

## Evolução vs aula 01

| Aula 01 | Aula 07 |
|---------|---------|
| `@openrouter/sdk` ou chat simples | LangChain `ChatOpenAI` |
| Só texto | Texto + PDF base64 |
| Smart routing `models[]` | Mesmo padrão `modelKwargs` |

---

## Resumo em uma frase

**OpenRouter executa um modelo vision que recebe a pergunta e o PDF na mesma chamada multimodal.**

Mais: [aula 01 — openrouter.md](../01-smart-model-router-gateway/classroom/openrouter.md).
