# LangGraph nesta aula (04) — Recomendador com memória

Evolução da aula 03: mesmo padrão de grafo + LLM, mas foco em **memória multi-turn**, **extração incremental de preferências** e **sumarização** do histórico.

---

## Grafo completo

```
START → chat
           │
           ├── extractedPreferences? → savePreferences ──┐
           ├── needsSummarization?   → summarize ────────┤ (prioridade no routeAfterChat)
           └── senão                 → END               │
                                                         │
           savePreferences ── needsSummarization? ───────┤
                    │              │                     │
                    └── summarize ─┴── END ──────────────┘
```

### Roteamento (`edgeConditions.ts`)

**Após `chat`:**

```typescript
extractedPreferences ? 'savePreferences' :
needsSummarization   ? 'summarize' :
'end'
```

**Após `savePreferences`:**

```typescript
needsSummarization ? 'summarize' : 'end'
```

Ordem importa: preferências são salvas **antes** de sumarizar, se ambos forem verdadeiros.

---

## Estado (`GraphState`)

| Campo | Função |
|-------|--------|
| `messages` | Histórico Human + AI (gerenciado pelo checkpointer) |
| `userContext` | Texto de preferências para o prompt |
| `extractedPreferences` | Dados extraídos na rodada atual |
| `needsSummarization` | Flag para compactar histórico |
| `conversationSummary` | Último sumário gerado |
| `userId` | Identificador do usuário |

---

## Nós

| Nó | LLM? | Responsabilidade |
|----|------|------------------|
| `chat` | Sim | Responde, recomenda músicas, extrai preferências, seta flags |
| `savePreferences` | Não | `mergePreferences(userId, extractedPreferences)` |
| `summarize` | Sim | Sumariza conversa, `storeSummary`, remove msgs antigas |

---

## Compilação com persistência

```typescript
graph.compile({
  checkpointer: memoryService.checkpointer,
  store: memoryService.store,
});
```

Sem isso, cada `invoke` começaria do zero — não haveria “memória” entre mensagens.

---

## CLI interativo (`index.ts`)

- `npm run chat:erickwendel` ou `--user <id>`
- Cria `threadId` único por sessão
- Carrega `getBasicInfo` antes da primeira resposta
- Loop: lê stdin → `graph.invoke` → imprime resposta da IA

---

## LangGraph CLI

```bash
npm run langgraph:serve
```

`langgraph.json` → grafo `song_highlights` em `factory.ts`.

---

## Comparação com aulas anteriores

| | Aula 02 | Aula 03 | Aula 04 |
|---|---------|---------|---------|
| LLM | Não | Sim (2 nós) | Sim (2 nós) |
| Domínio | upper/lower | consultas médicas | música |
| Persistência | Não | Não | PostgreSQL + SQLite |
| Nós extras | — | schedule/cancel | savePreferences/summarize |
| Objetivo | grafo | prompt chaining | **memória** |

---

## Resumo em uma frase

**LangGraph orquestra chat musical com ramificações para salvar preferências e sumarizar quando o histórico cresce — tudo persistido entre invocações.**

Detalhes das duas memórias: **[memoria.md](./memoria.md)**

Base da aula 02: [02-langchain-intro/classroom/langgraph.md](../02-langchain-intro/classroom/langgraph.md).
