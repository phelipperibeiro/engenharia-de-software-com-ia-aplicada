# Mapa mental — Módulo 07.07

```
Status Reports com IA
│
├── 🎯 Objetivo
│   └── Mesmos dados de sprint → 3 relatórios calibrados por audiência
│
├── 👥 3 Relatórios
│   ├── Técnico (devs/QA) — métricas, 150-250 palavras
│   ├── Gestor/PM — Verde/Amarelo/Vermelho + até 2 decisões, 150-200 palavras
│   └── Executivo — zero jargão, negócio, 80-120 palavras
│
├── 🚫 Regra de ouro
│   └── Executivo NUNCA menciona SP/velocity/Lead Time/bugs
│
├── 🔗 Restrições que amarram os 3
│   ├── Mesmos dados exatos, nenhuma invenção
│   ├── Gerencial: máx. 2 decisões necessárias
│   └── Risco sério → Vermelho + urgência obrigatórios
│
├── ✅ Checklist de Curadoria (4 itens)
│   ├── Números/datas consistentes entre os 3?
│   ├── Tom calibrado por audiência?
│   ├── Decisões explícitas no gerencial/executivo?
│   └── Executivo sem jargão técnico?
│
└── 🚚 RouteWise — Sprint 4 (mesma crise do Módulo 5)
    ├── 2/5 histórias entregues, US-03 removida (hardware)
    ├── BUG-S4-10: 43/140 veículos afetados
    ├── Técnico: detalha o bug, pede WIP mais rígido
    ├── Gestor: 🔴 + decisão orçamento hardware
    └── Executivo: "risco de equipamentos", sem SP
```

---

## Fluxo da aula

```
Módulo 5 (risk monitor,       status-report-prompt.md            output-exemplo-status-report-m72.md
Sprint 4 = 🔴)          ──►   (system + query + output)   ──►    (3 relatórios + checklist)
                                                                            │
                                                                            ▼
                                                              Módulo 10: scorecard de portfólio
                                                              (mesma disciplina, multi-projeto)
```

## Conceito ↔ arquivo

| Conceito | Onde aparece |
|---|---|
| Prompt + query + output completo | `status-report-prompt.md` |
| Backup isolado do output | `output-exemplo-status-report-m72.md` |
| Estado do board (snapshot Sprint 4) | `jira-estado-board.md` |

---

## Glossário (para quem não é de projetos)

| Termo | O que significa |
|---|---|
| **Status Verde/Amarelo/Vermelho (RAG status)** | Semáforo simples pra comunicar saúde de um projeto sem precisar explicar métrica nenhuma: Verde = tudo ok, Amarelo = atenção, Vermelho = risco confirmado. |
| **Story Points (SP) / Velocity / Lead Time** | Ver glossário do Módulo 5 — são métricas técnicas que só entram no relatório pro **time técnico**, nunca no executivo. |
| **Spillover** | Quando uma tarefa planejada pra um sprint não termina e "vaza" pro próximo sprint. |
| **Stakeholder** | Qualquer pessoa com interesse ou poder de decisão sobre o projeto (cliente, diretor, gestor, usuário-chave). |
| **C-level** | Cargos executivos de topo de uma empresa (CEO, CTO, CFO etc.) — a audiência do relatório "Executivo". |
