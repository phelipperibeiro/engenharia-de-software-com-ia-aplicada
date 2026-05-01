# Memória nesta aula (04)

Esta aula é sobre **fazer a IA lembrar do usuário** em conversas longas. O projeto usa **duas camadas de memória** — não confundir uma com a outra.

---

## Visão geral

```
                    +---------------------------+
                    |     Usuário (userId)      |
                    +-------------+-------------+
                                  |
              +-------------------+-------------------+
              |                                       |
              v                                       v
   +----------------------+              +----------------------+
   | Memória de THREAD    |              | Memória de USUÁRIO   |
   | (curto prazo)        |              | (longo prazo)        |
   +----------------------+              +----------------------+
   | PostgreSQL           |              | SQLite               |
   | Checkpointer + Store |              | PreferencesService   |
   | thread_id            |              | user_id              |
   +----------------------+              +----------------------+
   | Histórico de msgs    |              | Nome, gêneros, bandas|
   | no grafo LangGraph   |              | sumário consolidado  |
   +----------------------+              +----------------------+
```

---

## 1. Memória de conversa (PostgreSQL + LangGraph)

**Onde:** `memoryService.ts` — `PostgresSaver` + `PostgresStore`

**Para quê:** Persistir o **estado do grafo** entre chamadas `graph.invoke()` com o mesmo `thread_id`.

```typescript
const config = {
  configurable: { thread_id: threadId },
  context: { userId: actualUserId }
};
```

| Conceito | Significado |
|----------|-------------|
| `thread_id` | Sessão/conversa isolada (ex.: `erickwendel-1730000000`) |
| `checkpointer` | Salva checkpoints do grafo (mensagens, flags) |
| `store` | Store LangGraph para dados associados ao grafo |
| `context.userId` | Identificador do usuário passado aos nós via `runtime` |

**Subir o banco:**

```bash
npm run docker:up
```

URI em `config.ts`: `postgresql://postgres:mysecretpassword@localhost:5432/song_recommender`

Docs: [LangGraph Persistence](https://docs.langchain.com/oss/javascript/langgraph/persistence)

---

## 2. Memória de preferências (SQLite)

**Onde:** `preferencesService.ts` — Knex + `better-sqlite3`

**Arquivo:** `./preferences.db` (ou `./test-preferences.db` nos testes)

**Para quê:** Guardar **perfil musical** do usuário que sobrevive entre threads e reinícios do app.

| Método | Quando é chamado |
|--------|------------------|
| `mergePreferences` | Nó `savePreferences` — após o chat extrair novos dados |
| `storeSummary` | Nó `summarize` — consolida conversa em sumário estruturado |
| `getBasicInfo` | Nó `chat` — injeta contexto no system prompt |
| `getSummary` | Testes / leitura do perfil completo |

Tabela `user_preferences`: `name`, `age`, `favorite_genres`, `favorite_bands`, `key_preferences`, `important_context`.

---

## 3. Sumarização (compactar histórico)

Quando `needsSummarization === true`, o grafo vai ao nó `summarize`:

1. LLM gera `ConversationSummary` (Zod)
2. Salva em SQLite via `storeSummary`
3. Remove mensagens antigas com `RemoveMessage` — **mantém as 2 últimas** (1 usuário + 1 IA)
4. Reduz tokens nas próximas chamadas ao LLM

Gatilho em `chatNode.ts`:

```typescript
needsSummarization = state.messages.length >= config.maxMessagesToSummary
```

O valor está em `config.maxMessagesToSummary` (ajustável). Os comentários no código descrevem o cenário pedagógico ideal (~6 mensagens = 3 trocas).

---

## 4. Fluxo de dados na prática

```
1ª mensagem do usuário
    → chat lê getBasicInfo(userId)  [SQLite — pode estar vazio]
    → chat responde + talvez extractedPreferences
    → savePreferences? → mergePreferences [SQLite]
    → summarize? → storeSummary + apaga msgs antigas [PostgreSQL + SQLite]

2ª mensagem (mesmo thread_id)
    → checkpointer restaura messages [PostgreSQL]
    → chat já vê histórico + preferências salvas
```

**Mesmo `userId`, threads diferentes:** preferências SQLite são **compartilhadas**; histórico PostgreSQL é **por thread**.

---

## 5. O que extrair vs o que não extrair

Regra central nos prompts (`chatResponse.ts`):

- **Salvar** só o que o **usuário declarou** (nome, bandas que ele gosta)
- **Não salvar** bandas que a **IA recomendou** na resposta anterior

Isso evita “memória falsa” — um problema comum em chatbots com extração automática.

---

## Resumo em uma frase

**PostgreSQL guarda a conversa; SQLite guarda quem o usuário é musicalmente; a sumarização une os dois quando o histórico fica grande demais.**
