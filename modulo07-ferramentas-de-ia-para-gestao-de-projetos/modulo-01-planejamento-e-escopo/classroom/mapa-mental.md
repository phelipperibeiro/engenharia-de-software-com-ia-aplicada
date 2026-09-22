# Mapa mental — Módulo 07.01

```
Planejamento e Escopo com IA
│
├── 🎯 Objetivo
│   ├── Transcrição de discovery → requisitos estruturados
│   └── Requirements Copilot (system prompt no AI Studio)
│
├── 🧩 Papel do modelo
│   ├── Analista, não transcrevedor
│   ├── Captura dito + implicado
│   └── Sinaliza ambiguidade, não inventa
│
├── ⚙️ Modos
│   ├── Completo (9 seções) — refinar e importar
│   └── Rápido — Stories + Perguntas + Cards Jira
│
├── 📐 Frameworks obrigatórios
│   ├── User Story: Como [papel específico], quero [capacidade], para [resultado mensurável]
│   ├── INVEST (falha → [INVEST-FAIL] → sem card)
│   ├── Gherkin (happy path + edge case, "Então" verificável)
│   └── WBS: Épico → Feature → Story (≤8 SP) → Task
│
├── 🚫 Anti-padrões detectados
│   ├── Voz passiva sem sujeito
│   ├── Resultado não verificável
│   ├── Escopo implicitamente infinito
│   ├── Requisito duplo (AND)
│   └── Dependência circular
│
├── ❓ Protocolo de ambiguidade
│   ├── [AMBIGUIDADE] inline + pergunta numerada
│   ├── Termos-gatilho: desempenho, escala, segurança, integração, aprovação
│   └── Nunca inventa número → [A CONFIRMAR COM STAKEHOLDER]
│
├── 📋 9 seções do output
│   ├── 1 Mapa de Domínios (confiança A/M/B)
│   ├── 2 Mapa de Stakeholders ([CONFLITO])
│   ├── 3 Estrutura de Épicos (P/M/G/GG)
│   ├── 4 User Stories (card+INVEST+Gherkin+deps)
│   ├── 5 Perguntas em Aberto
│   ├── 6 Flags de Risco (4 categorias)
│   ├── 7 Cards prontos para Jira
│   ├── 8 Dependências não declaradas
│   └── 9 Diagrama Mermaid (≤10 nós)
│
└── 🚚 Caso RouteWise (fio condutor do módulo 07)
    ├── transcricao-discovery-routewise.md → input
    ├── output-demo-m1.2-v1.0.md → output de referência
    ├── routewise-jira-import.csv → backlog estruturado
    └── guia-board-routewise.md → estado do board por módulo (1→10)
```

---

## Fluxo ponta a ponta

```
Reunião de discovery         Requirements Copilot          Backlog estruturado        Jira (RouteWise)
(Carlos, Marcus, Priya) ──►  (system prompt v1.2)   ──►    (CSV + Mermaid)      ──►    Módulos 2-10
transcricao-discovery-           requisitos                  routewise-jira-           priorização,
routewise.md                     rastreáveis                 import.csv                 cronograma, etc.
```

## Conceito ↔ arquivo

| Conceito | Onde aparece |
|----------|----------------|
| System prompt / modos | `requirements-copilot-system-prompt.md` |
| Protocolo de ambiguidade em ação | `exemplo-diagrama-mermaid.md` (nó `[?]`) |
| INVEST falhando | `output-demo-m1.2-v1.0.md` (US01, US02, US03) |
| Backlog pronto pro Jira | `routewise-jira-import.csv` |
| Estado do board por módulo | `guia-board-routewise.md` |

---

## Glossário (para quem não é de projetos)

| Termo | O que significa |
|---|---|
| **User Story** | Requisito escrito do ponto de vista de quem usa o sistema: "Como [papel], quero [ação], para [benefício]". É a unidade básica de trabalho em times ágeis — menor que um Épico, maior que uma Task. |
| **Épico** | Agrupamento grande de User Stories que juntas entregam uma capacidade de negócio (ex: "Motor de Alertas"). Geralmente leva semanas; é quebrado em Stories menores. |
| **INVEST** | Checklist de 6 letras pra saber se uma User Story está "boa o suficiente" pra entrar num sprint: **I**ndependent (não trava em outra), **N**egotiable (aberta a ajuste), **V**aluable (entrega valor), **E**stimable (dá pra estimar esforço), **S**mall (cabe num sprint), **T**estable (dá pra escrever teste a partir dela). |
| **Gherkin** | Formato padronizado de escrever critério de aceite: `Dado` (contexto) / `Quando` (ação) / `Então` (resultado esperado). Usado porque QA consegue transformar direto em teste automatizado. |
| **WBS** (Work Breakdown Structure) | Hierarquia de como o trabalho é quebrado: Épico → Feature → User Story → Task. Cada nível é menor e mais concreto que o anterior. |
| **Story Points (SP)** | Unidade relativa de esforço de uma User Story — não é hora, é uma medida de complexidade/tamanho comparada a outras histórias já feitas pelo time. |
| **Sprint** | Ciclo curto e fixo de trabalho (geralmente 1-2 semanas) no qual o time entrega um conjunto de User Stories. |
| **Backlog** | Lista de todas as User Stories/Épicos ainda não feitos, geralmente ordenada por prioridade. |
