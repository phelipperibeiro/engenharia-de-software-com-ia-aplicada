# OpenRouter nesta aula (04)

Site oficial: **[openrouter.ai](https://openrouter.ai/)**

O OpenRouter executa o LLM em **dois nós** do grafo: `chat` e `summarize`. Ambos usam `generateStructured` com schemas Zod.

---

## Papel neste projeto

| Nó | Schema | Saída |
|----|--------|-------|
| `chat` | `ChatResponseSchema` | `message`, `preferences?`, `shouldSavePreferences` |
| `summarize` | `SummarySchema` | `name`, `favoriteGenres`, `keyPreferences`, etc. |

O LLM **conversa e extrai** preferências; **não persiste** sozinho — os nós `savePreferences` e `summarize` gravam no SQLite.

---

## Integração técnica

Igual à aula 03 (`openRouterService.ts`):

- `ChatOpenAI` com `baseURL: https://openrouter.ai/api/v1`
- `createAgent` + `providerStrategy(schema)` para JSON validado
- `modelKwargs`: `models[]` + `provider.sort` (throughput)

Modelo da aula: `arcee-ai/trinity-large-preview:free`

---

## Chat estruturado (`ChatResponseSchema`)

```typescript
{
  message: string,              // resposta amigável em PT
  preferences?: {               // só se usuário compartilhou algo novo
    name?, age?, favoriteGenres?, favoriteBands?, mood?, ...
  },
  shouldSavePreferences: boolean
}
```

O system prompt em `prompts/v1/chatResponse.ts` instrui:

- Recomendar músicas específicas (título + artista)
- Extrair apenas declarações do usuário
- Responder em português

---

## Sumarização estruturada (`SummarySchema`)

Segundo prompt em `prompts/v1/summarization.ts` — consolida o histórico em perfil textual estruturado para `storeSummary`.

---

## Variáveis de ambiente

```
OPENROUTER_API_KEY=...
OPENROUTER_HTTP_REFERER=...
OPENROUTER_X_TITLE=Song-Recommender
```

Testes e CLI precisam da chave — chamadas reais.

---

## Resumo em uma frase

**OpenRouter gera conversa musical e sumários estruturados; a memória persistente fica no PostgreSQL (thread) e SQLite (perfil).**

Mais sobre a plataforma: [aula 01 — openrouter.md](../01-smart-model-router-gateway/classroom/openrouter.md).
