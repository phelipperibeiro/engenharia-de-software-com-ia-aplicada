# Aula 03 — Dev Instructions & Agents

## Contexto no curso

Terceira pasta do **Módulo 03**. Depois de consumir MCP em LangGraph (aula 01), você aprende a **configurar agentes especializados** via arquivos de instrução — sem código TypeScript neste repo, só **definições**.

> Material: **[agentes.md](./agentes.md)** · **[playwright-agents.md](./playwright-agents.md)**

---

## O que você está estudando

Quatro definições de agente em `.github/agents/`:

| Arquivo | Papel |
|---------|-------|
| `developer.agent.md` | Coding Node/TS + TDD + LLM |
| `playwright-test-planner.agent.md` | Planejar testes web |
| `playwright-test-generator.agent.md` | Gerar specs Playwright |
| `playwright-test-healer.agent.md` | Corrigir testes quebrados |

---

## Duas famílias

### 1. Developer (instruções puras)

- Sem MCP no frontmatter
- Tools do IDE: read, edit, execute, search...
- Regras alinhadas ao curso (prompts em arquivo, mocks, `node:test`)

### 2. Playwright (instruções + MCP)

- `mcp-servers: playwright-test` ou tools `playwright/*`
- Agente controla browser real
- Pipeline QA: plan → code → heal

---

## Estrutura de um .agent.md

```markdown
---
description: Quando usar
tools: [...]
model: ...          # opcional
mcp-servers: ...     # opcional
---

## Mission
...
## Workflow
...
```

O YAML frontmatter é lido pelo host (Copilot/VS Code); o markdown vira system prompt.

---

## developer.agent — highlights

- **Imutabilidade** e DI
- Prompts LLM em `prompts/*`, nunca inline
- Mock de LLM/HTTP/DB nos testes
- Não criar `types.ts` solto
- Workflow: Plan → Edit → Test → Verify

Ideal para projetos das aulas 01–07 do módulo 02.

---

## Playwright pipeline

```
1. Planner explora app → salva plano markdown
2. Generator executa passos → escreve .spec.ts
3. Healer roda suite → debug → fix até verde
```

Requer Playwright MCP server (`npx playwright run-test-mcp-server`).

---

## Como usar na prática

1. Abrir VS Code / Copilot com suporte a custom agents
2. Selecionar agente pelo `description`
3. Para Playwright: app rodando + MCP playwright configurado
4. Invocar com tarefa específica (ex.: "planeje testes para localhost:3000")

Este repo é **material de referência** — copie `.github/agents/` para seus projetos.

---

## Takeaways

1. **Instruções persistentes** > repetir regras a cada chat
2. **Agentes especializados** > um generalista para tudo
3. **MCP no agent definition** — mesmo protocolo da aula 01, outro ponto de config
4. **Planner/Generator/Healer** — decomposição clássica de QA automation
5. **developer.agent** — espelha padrões do curso (TDD, LLM, segurança)

---

## Próximos passos

- Copiar `developer.agent.md` para um repo com testes
- Rodar planner em app das aulas anteriores (`POST /sales`, `/chat`)
- Comparar com [04 skills](../04-skills/classroom/) — skills = conhecimento, agents = persona

---

## Evolução Módulo 03

| Aula | Tema |
|------|------|
| 01 | Multiple MCP (código) |
| **03** | **Custom agents (instruções)** |
| 04 | Skills (pacotes) |
| 05 | MCP do zero |
