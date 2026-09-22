# Mapa mental — Módulo 07.02

```
Priorização Inteligente de Backlog
│
├── 🎯 Objetivo
│   └── RICE + WSJF ancorados no OKR (não em intuição)
│
├── 📊 RICE
│   ├── Reach (usuários/mês)
│   ├── Impact (3/2/1/0.5/0.25)
│   ├── Confidence (100/80/50/<50%)
│   ├── Effort (pessoa-mês)
│   └── RICE = (R × I × C) / E
│
├── 📊 WSJF
│   ├── Business Value (1-10)
│   ├── Time Criticality (1-10)
│   ├── Risk Reduction (1-10)
│   ├── Job Size (1-10)
│   └── WSJF = (BV+TC+RR) / Job Size
│
├── 📋 Output
│   ├── Tabela RICE
│   ├── Tabela WSJF
│   ├── Ranking combinado (desempate: maior CoD)
│   ├── Justificativas (Impact/Confidence sempre com razão)
│   └── Flags ⚠️ (Confidence<70%, dependência, effort subestimado)
│
├── 🔑 Calibração (ponto pedagógico central)
│   ├── U2.2 sem calibração → Reach = "140 veículos" → RICE US01 = 420
│   ├── U2.3 com calibração → Reach por analogia (1.288/mês) → RICE US01 = 3.091
│   └── Reach/Impact valem o que vale a âncora usada
│
├── ⚠️ Prompt degradado (contraste)
│   ├── "Priorize isso pra mim" (sem OKR)
│   ├── → inventa critério, linguagem vaga
│   └── → ranking indefensável em reunião
│
└── 🚚 RouteWise
    ├── OKR Carlos: sinistros 7→5 até set/2026
    ├── 6 User Stories (US01,02,03,04,05,09)
    └── Board: backlog plano, Sprint 1 não iniciada
```

---

## Fluxo da aula

```
backlog-routewise-input.md      backlog-scorer-prompt.md         output-exemplo-scorer-m23.md
(OKR + 6 stories)         ──►   (template RICE/WSJF)      ──►    (ranking calibrado)
                                                                          │
                                                                          ▼
                                                            Módulo 3: cronograma por sprint
```

## Conceito ↔ arquivo

| Conceito | Onde aparece |
|---|---|
| Template RICE/WSJF | `backlog-scorer-prompt.md` |
| Contexto + backlog de input | `backlog-routewise-input.md` |
| Calibração (U2.2 vs U2.3) | `output-exemplo-scorer-m23.md` |
| Estado do board | `jira-estado-board.md` |

---

## Glossário (para quem não é de projetos)

| Termo | O que significa |
|---|---|
| **RICE** | Framework de priorização: `(Reach × Impact × Confidence) / Effort`. Quanto maior o RICE, maior a prioridade. |
| **Reach** | Quantas pessoas/transações aquele item vai afetar por mês. |
| **Impact** | O tamanho do impacto por pessoa afetada (numa escala de 0.25 a 3). |
| **Confidence** | Quão confiante você está nos números de Reach/Impact que colocou (em %) — baixa confidence = você está chutando. |
| **Effort** | Quanto trabalho aquele item exige, em pessoa-mês (1 pessoa-mês = 1 pessoa trabalhando 1 mês inteiro nisso). |
| **WSJF** (Weighted Shortest Job First) | Outro framework de priorização, usado em SAFe/escala: `Cost of Delay / Job Size`. Prioriza o que é urgente **e** rápido de fazer. |
| **Cost of Delay (CoD)** | Quanto custa (em valor perdido) atrasar aquele item — soma de Business Value + Time Criticality + Risk Reduction. |
| **Business Value** | O quanto aquele item contribui diretamente pro objetivo estratégico (OKR), numa escala de 1 a 10. |
| **Time Criticality** | O quanto o valor daquele item "evapora" se atrasar — tem prazo externo? Evento de mercado? (escala 1-10). |
| **Job Size** | Tamanho relativo do trabalho, numa escala de 1 a 10 (versão simplificada do Effort, usada no WSJF). |
| **OKR** (Objectives and Key Results) | Metodologia de meta: um **Objetivo** qualitativo (ex: "reduzir sinistros") + **Key Results** mensuráveis que provam que ele foi atingido (ex: "de 7 para 5 acidentes até setembro"). |
