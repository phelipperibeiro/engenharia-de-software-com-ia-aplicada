# Mapa mental — Módulo 07.10

```
Portfólio e OKRs
│
├── 🎯 Objetivo
│   └── Validar OKR → alinhar backlog → scorecard de portfólio
│
├── ✅ Parte A — Validação de OKRs
│   ├── Objetivo: inspiracional ou tarefa disfarçada?
│   ├── 6 critérios por KR:
│   │   ├── Mensurável, Baseline, Prazo, Responsável
│   │   └── Independente de output, Verificável por 3º
│   └── RouteWise: ambos KRs falham em Baseline
│
├── 🔗 Parte B — Alinhamento Backlog × OKR
│   ├── Alinhado Diretamente
│   ├── Alinhado Indiretamente
│   ├── Não Alinhado (não é ruim — dívida técnica/compliance)
│   ├── Épico Futuro sem OKR
│   └── Output ≠ Outcome (critério central)
│
├── 📊 Parte C — Scorecard de Portfólio
│   ├── Rúbrica FIXA (nunca ajustada por projeto)
│   │   ├── 🟢 KRs ≥60% do proporcional, sem blocker sem dono
│   │   ├── 🟡 KR 40-60% OU blocker com dono
│   │   └── 🔴 KR <40% OU blocker sem dono
│   ├── Riscos transversais (recurso compartilhado = ponto único de falha)
│   ├── Foco da reunião: máx. 3 itens
│   └── Sem Vermelho → dashboard assíncrono basta
│
└── 🚚 RouteWise — fechamento do módulo 07
    ├── OKRs desde o Módulo 1 (CSV)
    ├── Backlog US-01 a US-10 classificado
    ├── Portfólio fictício: RouteWise🟡 / Fintech🔴 / E-commerce🟢
    └── Board: snapshot Sprint 4 + épicos↔OKRs
```

---

## Fluxo da aula — e do módulo inteiro

```
A: Validar OKR    B: Alinhar backlog     C: Scorecard portfólio
(baseline?)  ──►  (output≠outcome) ──►   (rúbrica fixa)
                                                │
                                                ▼
        Fecha o arco: Módulo 1 (discovery) → ... → Módulo 10 (portfólio)
```

## Conceito ↔ arquivo

| Conceito | Onde aparece |
|---|---|
| 6 critérios de KR | `okr-aligner-prompt.md` (Parte A) |
| 4 categorias de alinhamento | `okr-aligner-prompt.md` (Parte B) |
| Rúbrica de portfólio | `okr-aligner-prompt.md` (Parte C) |
| Estado do board (fechamento) | `jira-estado-board.md` |

---

## Glossário (para quem não é de projetos)

| Termo | O que significa |
|---|---|
| **OKR** (Objectives and Key Results) | Metodologia de meta: um **Objetivo** qualitativo e inspiracional + **Key Results** mensuráveis que provam que ele foi atingido. Usada por Google, Intel e muitas empresas de tecnologia. |
| **KR** (Key Result) | Cada resultado-chave mensurável dentro de um Objetivo (ex: "reduzir sinistros de 7 para 5"). Um Objetivo pode ter vários KRs. |
| **Baseline** | O valor atual/de partida de uma métrica, antes de tentar melhorá-la — sem baseline, não dá pra provar que "melhorou X%". |
| **Outcome vs. Output** | Output é **o que você entrega** (ex: "lançamos o módulo de alertas"). Outcome é **o resultado que isso gera** (ex: "reduzimos acidentes"). OKR sempre mede outcome, nunca output. |
| **Ciclo** | O período de tempo em que um conjunto de OKRs vale (ex: um trimestre, "Q2-Q3 2026"). |
| **Portfólio** | O conjunto de todos os projetos que um gestor/empresa está tocando ao mesmo tempo — a visão "de cima", cruzando vários projetos. |
| **Ponto único de falha** | Um recurso (pessoa, sistema, fornecedor) do qual vários projetos dependem ao mesmo tempo — se ele falhar ou ficar indisponível, todos são afetados juntos. |
| **Rúbrica** | Um critério de avaliação fixo e pré-definido, aplicado da mesma forma a todos os itens avaliados (aqui, o critério que define Verde/Amarelo/Vermelho de cada projeto). |
