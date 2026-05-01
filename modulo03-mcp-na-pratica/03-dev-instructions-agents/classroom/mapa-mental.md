# Mapa mental — Dev Instructions & Agents (Aula 03)

## Visão em árvore

```
Dev Instructions & Agents (Aula 03)
│
├── Objetivo
│   ├── Agentes customizados (.agent.md)
│   ├── Instruções persistentes
│   └── MCP em agentes Playwright
│
├── developer.agent
│   ├── Node/TS + TDD
│   ├── SOLID, DI, immutability
│   ├── Prompts em arquivo, mock LLM
│   └── tools: read, edit, execute...
│
├── Playwright pipeline
│   ├── planner → plano .md
│   ├── generator → .spec.ts
│   └── healer → fix failures
│
├── MCP Playwright
│   ├── run-test-mcp-server
│   ├── browser_*, test_*
│   └── stdio no frontmatter
│
├── Localização
│   └── .github/agents/*.agent.md
│
└── vs Skills (aula 04)
    ├── Agent = persona + workflow
    └── Skill = conhecimento de domínio
```

---

## Diagrama: famílias de agentes

```
                    +----------------------+
                    |  Custom Agents 03    |
                    +----------+-----------+
                               |
              +----------------+----------------+
              |                                 |
              v                                 v
     +----------------+              +-------------------+
     | developer      |              | Playwright x3     |
     | (instruções)   |              | (instruções + MCP)|
     +----------------+              +-------------------+
     TDD, LLM mocks                  browser automation
     sem MCP server                  playwright-test MCP
```

---

## Pipeline Playwright

```
   App Web
      |
      v
 +----------+    plan.md    +------------+    *.spec.ts   +----------+
 | Planner  | -----------> | Generator  | -------------> |  CI run  |
 +----------+              +------------+                +-----+----+
                                                              |
                                                         fail |
                                                              v
                                                        +----------+
                                                        |  Healer  |
                                                        +----------+
```

---

## Agent vs Skill vs MCP

```
+----------+---------------------------+------------------+
|          | Agent (03)                | Skill (04)       |
+----------+---------------------------+------------------+
| Arquivo  | .github/agents/*.md       | .agents/skills/  |
| Foco     | Quem sou, workflow        | O que sei fazer  |
| MCP      | Opcional (Playwright)     | Não              |
+----------+---------------------------+------------------+

MCP (aula 01/05): ferramentas executáveis (filesystem, DB, browser)
```

---

## developer workflow

```
Plan → Edit → Test (target) → Verify (full) → Summary
  |      |        |              |
  ask    minimal   node:test      all green
  if     diff      mock ext
  unclear
```

---

## Arquivos

| Agente | Arquivo |
|--------|---------|
| Developer | `developer.agent.md` |
| Planner | `playwright-test-planner.agent.md` |
| Generator | `playwright-test-generator.agent.md` |
| Healer | `playwright-test-healer.agent.md` |
