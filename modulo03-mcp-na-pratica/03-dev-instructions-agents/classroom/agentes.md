# Agentes customizados (Aula 03)

Esta aula trata de **instruções persistentes** para agentes de IA no editor — papéis especializados com tools, regras e workflows definidos em arquivos `.agent.md`.

---

## O que são custom agents?

Arquivos em `.github/agents/*.agent.md` (GitHub Copilot / VS Code) que definem:

| Frontmatter | Função |
|-------------|--------|
| `description` | Quando invocar este agente |
| `tools` | Ferramentas permitidas (read, edit, MCP, etc.) |
| `model` | Modelo preferido (opcional) |
| `mcp-servers` | Servidores MCP embutidos (opcional) |

Corpo do arquivo = **system prompt** do agente: missão, princípios, workflow.

```
Usuário escolhe agente → IDE carrega .agent.md → LLM segue instruções + tools
```

---

## developer.agent.md — agente de código

**Missão:** edições mínimas e seguras, provadas por testes.

### Critérios de sucesso

1. TypeScript sem erros
2. Testes relevantes passam
3. Suite completa passa
4. Critérios de aceite do usuário

### Princípios (resumo)

| Área | Regra |
|------|-------|
| Design | Imutabilidade, SRP, injeção de dependência |
| Config | Env em arquivos config, sem hardcode |
| LLM | Prompts em arquivos, interface injetável, mock nos testes |
| Testes | `node:test`, E2E do pipeline, mock só fronteiras externas |
| Segurança | Input não confiável, sem secrets em logs |

### O que NÃO faz

- `eval`, shell injection
- Dependências sem justificativa
- `types.ts` separado / `index.ts` re-export
- Reorganizar arquivos sem pedido

### Workflow

```
Plan → Edit → Test (targeted) → Verify (full suite) → Summary
```

### Tools disponíveis

`vscode`, `execute`, `read`, `edit`, `search`, `web`, `agent`, `context7/*`, `todo`

**Uso:** desenvolvimento Node/TypeScript alinhado ao restante do curso (OpenRouter, LangGraph, MCP).

---

## Agentes vs Skills vs MCP

| Mecanismo | O que é | Onde fica |
|-----------|---------|-----------|
| **Agent** | Persona + workflow + tools | `.github/agents/*.agent.md` |
| **Skill** | Pacote de conhecimento/domínio | `.agents/skills/*/SKILL.md` |
| **MCP** | Ferramentas externas (API, browser, DB) | Servidor MCP + config |

Um agente pode usar **MCP tools** e carregar **skills** ao mesmo tempo.

---

## Quando usar o developer agent

- Implementar feature com TDD
- Corrigir bug com teste de regressão
- Integrar LLM (prompts em arquivo, mocks)
- Refatorar preservando comportamento

---

## Resumo em uma frase

**Custom agents são “contratos de comportamento” em markdown — o developer agent codifica as boas práticas do curso para coding assistido.**

Playwright agents: **[playwright-agents.md](./playwright-agents.md)**
