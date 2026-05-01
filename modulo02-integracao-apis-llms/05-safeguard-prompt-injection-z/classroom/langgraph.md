# LangGraph nesta aula (05) — Guardrails no grafo

Grafo **enxuto**, sem checkpointer: uma mensagem entra, passa pelo filtro e termina em chat ou blocked.

---

## Fluxo do grafo

```
START → guardrails_check
              │
              ├── safe ou guardrails off → chat → END
              └── unsafe (guardrails on)  → blocked → END
```

Sem memória entre execuções — cada `graph.invoke()` é independente (CLI one-shot).

---

## Estado (`SafeguardStateAnnotation`)

| Campo | Função |
|-------|--------|
| `messages` | `HumanMessage` do usuário + `AIMessage` final |
| `user` | Objeto `User` (role, permissions, displayName) |
| `guardrailCheck` | Resultado `{ safe, reason?, analysis? }` |
| `guardrailsEnabled` | `false` quando `--unsafe` |

---

## Nós

| Nó | LLM? | Função |
|----|------|--------|
| `guardrails_check` | Safeguard | Classifica entrada; preenche `guardrailCheck` |
| `chat` | Chat + MCP tools | Resposta normal (admin pode usar filesystem) |
| `blocked` | Não | Formata mensagem de bloqueio (`prompts/blocked.txt`) |

---

## Roteamento (`edgeConditions.ts`)

```typescript
if (!state.guardrailsEnabled) return 'chat';
if (!check || check.safe) return 'chat';
return 'blocked';
```

Ordem de prioridade:

1. Guardrails desligados → sempre `chat`
2. Guardrails ligados + safe → `chat`
3. Guardrails ligados + unsafe → `blocked`

---

## `guardrailsCheckNode` (detalhe)

1. Lê última mensagem do usuário
2. Monta `systemPrompt` com `PromptTemplate` + role/name
3. Concatena: `systemPrompt + '\n' + userPrompt` → envia ao safeguard
4. Em erro de API: **fail-closed** (`safe: false`) — bloqueia por segurança

---

## `chatNode` (detalhe)

- Mesmo `PromptTemplate` do system prompt
- `openRouterService.generate()` com agent + MCP
- Fallback para LangSmith Studio: default `ananeri` + guardrails off se `user` ausente

---

## `blockedNode` (detalhe)

- Usa `guardrailCheck.reason` e `analysis`
- Injeta `USER_ROLE`, `PERMISSIONS` em `prompts/blocked.txt`
- Devolve `AIMessage` educativa (não chama LLM de chat)

---

## Compilação

```typescript
return workflow.compile();  // sem checkpointer/store
```

Diferente da aula 04: não há persistência de thread.

---

## Prompts em arquivos `.txt`

| Arquivo | Uso |
|---------|-----|
| `prompts/system.txt` | Regras + papel do usuário |
| `prompts/guardrails.txt` | Classificador SAFE/UNSAFE |
| `prompts/blocked.txt` | Mensagem quando bloqueado |
| `prompts/user/*.txt` | Ataques de exemplo para demos |

Carregados em `config.ts` via `readFileSync`.

---

## CLI → grafo

```typescript
graph.invoke({
  user,
  guardrailsEnabled: !unsafe,
  messages: [new HumanMessage(prompt)],
});
```

---

## Comparação com aula 04

| | Aula 04 | Aula 05 |
|---|---------|---------|
| Foco | Memória | Segurança |
| Nós | chat, save, summarize | guardrails, chat, blocked |
| Persistência | PostgreSQL | Nenhuma |
| Tools | Não | MCP filesystem |
| Dois LLMs | chat + summarize | chat + safeguard |

---

## Resumo em uma frase

**LangGraph coloca um nó de guardrails na entrada do fluxo; só entradas SAFE (ou modo unsafe) chegam ao agente com ferramentas de arquivo.**
