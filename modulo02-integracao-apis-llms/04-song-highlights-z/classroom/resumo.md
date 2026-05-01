# Aula 04 — Song Highlights (recomendador musical com memória)

## Contexto no curso

Quarta aula do **Módulo 02**. Depois de roteamento (01), grafo básico (02) e prompt chaining médico (03), você aprende **memória em aplicações conversacionais**: a IA lembra preferências musicais entre mensagens, threads e sessões.

> Ferramentas: **[openrouter.md](./openrouter.md)** · **[langgraph.md](./langgraph.md)** · **[memoria.md](./memoria.md)**

---

## O que você está construindo

Um **assistente musical** que:

- Conversa em português sobre gosto musical
- Recomenda músicas específicas (título + artista)
- Extrai e salva nome, gêneros, bandas, humor, contexto
- Lembra o usuário na mesma thread (PostgreSQL)
- Mantém perfil entre conversas (SQLite)
- Compacta histórico longo via sumarização (LLM)

Interface principal: **CLI** (`src/index.ts`), não HTTP nesta versão.

---

## Arquitetura em camadas

| Camada | Arquivos | Função |
|--------|----------|--------|
| CLI | `index.ts` | Chat interativo, `thread_id`, `userId` |
| Grafo | `graph/graph.ts`, `factory.ts` | 3 nós + arestas condicionais |
| Nós | `nodes/chatNode.ts`, `savePreferencesNode.ts`, `summarizationNode.ts` | Lógica do fluxo |
| Roteamento | `nodes/edgeConditions.ts` | Decisões após chat e save |
| Prompts | `prompts/v1/chatResponse.ts`, `summarization.ts` | Templates JSON versionados |
| LLM | `openRouterService.ts` | OpenRouter + Zod |
| Memória thread | `memoryService.ts` | PostgresSaver + PostgresStore |
| Memória usuário | `preferencesService.ts` | SQLite `preferences.db` |
| Infra | `docker-compose.yml` | PostgreSQL local |

---

## Fluxo de uma mensagem do usuário

1. `graph.invoke({ messages: [HumanMessage(...)] }, { thread_id, context: { userId } })`
2. Checkpointer restaura estado anterior da thread
3. **`chat`**: carrega `getBasicInfo(userId)` → monta prompt → LLM responde
4. Se `shouldSavePreferences` → `extractedPreferences` preenchido
5. Roteamento:
   - Tem preferências? → **`savePreferences`** → `mergePreferences`
   - `needsSummarization`? → **`summarize`** → sumário + remove msgs antigas
   - Senão → **END**
6. Próxima mensagem reutiliza histórico + perfil atualizado

---

## Duas memórias (conceito-chave)

| Tipo | Tecnologia | Escopo | Conteúdo |
|------|------------|--------|----------|
| Conversa | PostgreSQL (LangGraph) | Por `thread_id` | Mensagens do grafo |
| Perfil | SQLite (Knex) | Por `userId` | Preferências consolidadas |

Ver detalhes em **[memoria.md](./memoria.md)**.

---

## Regras de extração (anti-alucinação)

O prompt do `chat` deixa explícito:

- `shouldSavePreferences: true` **somente** quando o usuário compartilha dados novos
- **Nunca** salvar bandas que a IA recomendou na mensagem anterior
- Saudações simples → não extrair

Exemplo: usuário diz *"Gostei das recomendações!"* → `shouldSavePreferences: false`.

---

## Sumarização

- **Quando:** `messages.length >= config.maxMessagesToSummary`
- **O que faz:** LLM gera sumário → `storeSummary` → `RemoveMessage` nas mensagens antigas (ficam 2)
- **Por quê:** limitar tokens e manter contexto essencial

---

## Estado do grafo

```typescript
messages, userContext, extractedPreferences,
needsSummarization, conversationSummary, userId
```

---

## Como rodar

```bash
# 1. Dependências
npm install

# 2. PostgreSQL (memória LangGraph)
npm run docker:up

# 3. Ambiente
cp .env.example .env
# OPENROUTER_API_KEY obrigatória

# 4. Chat
npm run chat:erickwendel
# ou: node --env-file .env src/index.ts --user seu-nome

# Testes E2E
npm test

# Visualizar grafo
npm run langgraph:serve
```

---

## Testes E2E

`tests/chat.e2e.test.ts`:

- Usa `./test-preferences.db` isolado
- Vários cenários comentados (`it.skip`) para estudo
- Teste ativo: histórico com múltiplas mensagens

Requer PostgreSQL rodando + API key.

---

## Dependências principais

| Pacote | Uso |
|--------|-----|
| `@langchain/langgraph-checkpoint-postgres` | Checkpointer + Store |
| `knex` + `better-sqlite3` | Preferências do usuário |
| `langchain` | Mensagens, agent, structured output |
| `@langchain/openai` | Cliente → OpenRouter |

---

## Takeaways

1. **Memória ≠ um único banco** — thread (curto prazo) vs perfil (longo prazo).
2. **Extração estruturada** alimenta persistência sem passar texto livre ao SQL.
3. **Sumarização** é padrão de produção para conversas longas.
4. **`runtime.context.userId`** liga nós ao perfil correto no SQLite.
5. Mesmo grafo da aula 03, domínio e persistência diferentes.

---

## Próximos passos sugeridos (estudo)

- Reativar testes `it.skip` e validar memória entre threads.
- Ajustar `maxMessagesToSummary` para 6 e testar sumarização.
- Expor `POST /chat` como nas aulas anteriores.
- Comparar com README do repo (pode mencionar LibSQL — o código `-z` usa Postgres + SQLite).

---

## Evolução no módulo

- **05** — safeguard / prompt injection
- **06** — RAG + Neo4j
- **07** — análise de documentos

A base de grafo + OpenRouter + memória se repete nesses projetos.
