# Mapa mental — Módulo 07.03

```
Cronograma e Capacidade com IA
│
├── 🎯 Objetivo
│   └── Backlog priorizado (Mod. 2) → cronograma de sprints
│
├── 📥 Input
│   ├── Contexto do time (papel, capacidade real = 65% nominal)
│   ├── Backlog (ID | Título | Effort | Observações/Blocker)
│   ├── Dependências conhecidas
│   └── Restrições (marcos, feriados, prazos)
│
├── 📤 Output
│   ├── 1 Cronograma por Sprint (história+responsável+effort+capacidade)
│   ├── 2 Dependências Mapeadas (+ implícitas inferidas)
│   ├── 3 Caminho Crítico
│   ├── 4 Flags de Risco ⚠️
│   └── 5 Soluções de Contorno
│
├── ⚖️ Regras de alocação
│   ├── Nunca estoura capacidade de uma pessoa/sprint
│   ├── Sinaliza história empurrada por dependência
│   ├── "Fora do escopo do MVP" quando não cabe (ex: US-02, 34 SP)
│   └── Mesmo componente técnico → dependência candidata
│
├── 🔮 What-If (prompt separado)
│   ├── Cenário 1: atraso de hardware (60→88 dias)
│   ├── Cenário 2: dev sênior ausente
│   ├── Cenário 3: antecipação de prazo
│   └── Cada um: impacto + ≥2 opções + recomendação
│
└── 🚚 RouteWise
    ├── 6 devs, sprint 2 semanas, 6 sprints
    ├── Hardware chega semana 9 (blocker)
    ├── US-02 cortada do MVP (não cabe)
    └── Board: Sprint 1 ativa
```

---

## Fluxo da aula

```
Módulo 2 (ranking)    scheduling-routewise-input.md    scheduling-prompt.md      output-exemplo-scheduling-m32.md
(RICE/WSJF)     ──►    (time+backlog+deps+restr)  ──►   (cronograma+what-if) ──►  (6 sprints + 3 simulações)
                                                                                          │
                                                                                          ▼
                                                                            Módulo 4: Monte Carlo (P50/P85/P95)
```

## Conceito ↔ arquivo

| Conceito | Onde aparece |
|---|---|
| Capacidade real (65%) | `scheduling-prompt.md` |
| Corte de escopo justificado | `output-exemplo-scheduling-m32.md` (US-02) |
| What-if / trade-offs | `output-exemplo-scheduling-m32.md` (3 cenários) |
| Estado do board | `jira-estado-board.md` |

---

## Glossário (para quem não é de projetos)

| Termo | O que significa |
|---|---|
| **Sprint** | Ciclo curto e fixo de trabalho (aqui, 2 semanas) no qual o time entrega um conjunto de User Stories. |
| **Capacidade nominal vs. real** | Nominal é quanto o time "cabe" na conta (ex: 6 devs × horas); real é o que sobra depois de descontar reunião, imprevisto, revisão de código — por isso o módulo usa 65% do nominal. |
| **Story Points (SP)** | Unidade relativa de esforço/tamanho de uma User Story, não é hora. |
| **Caminho Crítico** | A sequência de tarefas cujo atraso atrasa **diretamente** a entrega final — se qualquer uma delas atrasa, o projeto inteiro atrasa. |
| **Blocker** | Algo que impede uma tarefa de começar ou continuar (ex: hardware que ainda não chegou). |
| **Enabler** | Tarefa que não entrega valor direto ao usuário, mas é pré-requisito técnico pra outras entregarem (ex: configurar ambiente de staging). |
| **What-if** | Simulação de "e se isso mudasse?" — usada pra comparar opções de resposta a um risco antes que ele aconteça de verdade. |
| **MVP** (Minimum Viable Product) | A menor versão do produto que já entrega valor real e pode ser lançada/testada. |
