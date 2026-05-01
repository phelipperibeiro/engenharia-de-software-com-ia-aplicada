# Aula 05 — Safeguard & Prompt Injection

## Contexto no curso

Quinta aula do **Módulo 02**. Depois de integrar LLMs, grafos, domínios e memória, você aprende **segurança em aplicações com IA**: por que prompt injection existe e como **guardrails** mitigam o risco **antes** do modelo principal processar a mensagem.

> Ferramentas: **[openrouter.md](./openrouter.md)** · **[langgraph.md](./langgraph.md)** · **[seguranca.md](./seguranca.md)**

---

## O que você está estudando

Um **assistente CLI** com acesso a arquivos (MCP filesystem) e dois perfis de usuário:

- **Admin** (`erickwendel`) — pode pedir leitura de `package.json`
- **Member** (`ananeri`) — não deveria acessar arquivos

A lição central: **o mesmo system prompt** com regras claras ainda pode ser violado por injection **sem** guardrails.

---

## Demonstração prática

**Modo safe (padrão):**

```bash
npm run chat:member:safe
```

Member tenta ataque via `prompts/user/read-env.txt` → **bloqueado** em `guardrails_check`.

**Modo unsafe:**

```bash
npm run chat:member:unsafe:package
```

Guardrails desligados → injection pode levar o agente a usar tools de filesystem.

**Admin legítimo:**

```bash
npm run chat:admin
```

Funciona com guardrails — permissão real + prompt coerente.

---

## Arquitetura

| Peça | Arquivo | Função |
|------|---------|--------|
| CLI | `index.ts` | `--user`, `--message`, `--prompt-path`, `--unsafe` |
| Grafo | `graph/graph.ts` | 3 nós, 1 condicional |
| Guardrails | `guardrailsCheckNode.ts` | Safeguard model |
| Chat | `chatNode.ts` | Agent + MCP |
| Bloqueio | `blockedNode.ts` | Template de recusa |
| LLM | `openrouterService.ts` | `generate` + `checkGuardRails` |
| Tools | `mcpService.ts` | MCP filesystem no cwd |
| Usuários | `data/users.json` | RBAC |
| Prompts | `prompts/*.txt` | system, guardrails, blocked, ataques |

---

## Fluxo resumido

1. CLI monta `user`, `guardrailsEnabled`, `HumanMessage`
2. `guardrails_check` → safeguard analisa (ou pula se unsafe)
3. `routeAfterGuardrails` → `chat` ou `blocked`
4. `chat`: agent pode chamar MCP read
5. `blocked`: mensagem formatada sem passar pelo chat model

---

## Dois modelos OpenRouter

| Modelo | Papel |
|--------|-------|
| `qwen/qwen-2.5-7b-instruct` | Conversa + tools (demo "vulnerável") |
| `openai/gpt-oss-safeguard-20b` | Classifica SAFE / UNSAFE |

---

## Conceitos de segurança

1. **Não confie só no system prompt** para autorização
2. **Guardrails na entrada** — defense in depth
3. **Fail-closed** — se safeguard falha, bloqueia
4. **RBAC no prompt** — última camada, não a única
5. **Tools reais** — LLM com filesystem é superfície de ataque alta
6. **`--unsafe`** — só para ensino, ver o ataque funcionando

Detalhes: **[seguranca.md](./seguranca.md)**

---

## Como rodar

```bash
npm install
cp .env.example .env
# OPENROUTER_API_KEY

npm run chat -- --user ananeri --message "Olá"
npm run chat:member:safe
npm run chat:member:unsafe:package
npm run langgraph:serve
```

---

## Estado do grafo

```typescript
messages, user, guardrailCheck, guardrailsEnabled
```

Sem `thread_id` — não é app conversacional multi-turn nesta versão.

---

## Takeaways

1. Injection é manipulação de **linguagem**, não exploit de SQL
2. Safeguard model especializado > regex frágil (escala melhor)
3. LangGraph encaixa guardrails como **primeiro nó** — padrão reutilizável
4. Em produção: validar permissões no **backend**, não no LLM
5. MCP/tools amplificam impacto de um injection bem-sucedido

---

## Próximos passos sugeridos (estudo)

- Ler `prompts/user/read-package-version.txt` e prever SAFE vs UNSAFE
- Testar member **sem** `--unsafe` com pedido legítimo ("qual seu nome?")
- Comparar `PromptTemplate` vs `.replace` nos comentários do código
- Ver aula 06 (RAG) — outro tipo de risco (dados, não só tools)

---

## Evolução no módulo

| Aula | Tema |
|------|------|
| 04 | Memória |
| **05** | **Segurança / injection** |
| 06 | RAG + Neo4j |
| 07 | Análise de documentos |
