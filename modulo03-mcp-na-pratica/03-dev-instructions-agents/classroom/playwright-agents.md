# Playwright Test Agents (Aula 03)

Três agentes especializados em **testes E2E de browser**, cada um com **MCP Playwright** embutido — pipeline plan → generate → heal.

---

## Pipeline de qualidade web

```
  +----------------+     +------------------+     +----------------+
  | test-planner   | --> | test-generator   | --> | test-healer    |
  | (explorar UI)  |     | (gravar testes)  |     | (corrigir CI)  |
  +----------------+     +------------------+     +----------------+
         |                        |                       |
         v                        v                       v
    plano .md              *.spec.ts              testes verdes
```

---

## MCP Playwright nos agentes

Planner e Healer declaram:

```yaml
mcp-servers:
  playwright-test:
    type: stdio
    command: npx
    args: [playwright, run-test-mcp-server]
    tools: ["*"]
```

Generator usa tools `playwright/*` (variante do servidor).

**Tools típicas:** `browser_navigate`, `browser_click`, `browser_snapshot`, `test_run`, `test_debug`, etc.

O agente **navega de verdade** no browser via MCP — não simula.

---

## 1. playwright-test-planner

**Quando usar:** criar plano de testes para app web.

**Fluxo:**

1. `planner_setup_page` — prepara página
2. Explorar UI com `browser_*` (snapshot, click, type...)
3. Mapear user journeys, happy path, edge cases
4. `planner_save_plan` — salva markdown

**Output:** documento com cenários, passos, critérios de sucesso.

**Model:** Claude Sonnet 4

---

## 2. playwright-test-generator

**Quando usar:** transformar item do plano em teste automatizado.

**Fluxo:**

1. Recebe XML com `<test-suite>`, `<test-name>`, `<test-file>`, `<seed-file>`, `<body>`
2. `generator_setup_page`
3. Executa cada passo manualmente com tools Playwright
4. `generator_read_log` → `generator_write_test`

**Output:** arquivo `.spec.ts` com comentários por step.

**Convenções:**

- Um test por arquivo
- `describe` = suite do plano
- Comentário antes de cada step

---

## 3. playwright-test-healer

**Quando usar:** testes Playwright falhando no CI ou local.

**Fluxo:**

1. `test_run` — lista falhas
2. `test_debug` — pausa no erro
3. Investigar: snapshot, selectors, network, console
4. `edit` no código do teste
5. Repetir até passar ou marcar `test.fixme()` com comentário

**Princípios:** selectors robustos, regex para dados dinâmicos, sem `networkidle`, não interativo (não pergunta ao user).

**Model:** Claude Sonnet 4

---

## Comparação dos três

| Agente | Entrada | Saída | MCP |
|--------|---------|-------|-----|
| Planner | URL / app | plano .md | playwright-test |
| Generator | item do plano | .spec.ts | playwright |
| Healer | testes falhando | testes corrigidos | playwright-test |

---

## Relação com aula 01 (multiple MCP)

| Aula 01 | Aula 03 Playwright |
|---------|-------------------|
| MCP no **código** (LangGraph agent) | MCP no **agent definition** |
| MultiServerMCPClient | `mcp-servers` no frontmatter |
| Tools para ETL | Tools para browser |

Mesmo protocolo MCP — **contextos diferentes** de configuração.

---

## Resumo em uma frase

**Três agentes formam uma linha de produção de testes E2E: explorar → codificar → consertar — todos powered by Playwright MCP.**

Developer agent: **[agentes.md](./agentes.md)**
