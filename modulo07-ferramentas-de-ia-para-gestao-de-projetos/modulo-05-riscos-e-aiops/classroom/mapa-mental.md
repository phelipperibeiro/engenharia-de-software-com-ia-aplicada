# Mapa mental — Módulo 07.05

```
Riscos e AIOps de Projeto
│
├── 🎯 Objetivo
│   └── Detectar anomalia de fluxo/qualidade antes de virar crise
│
├── 📥 Input
│   ├── Métricas por sprint (Lead Time, Cycle Time, bugs, WIP parado)
│   ├── Contexto (sprint atual, blockers, marco próximo)
│   └── Limites de alerta definidos pelo próprio projeto
│
├── 🖥️ 1. Cockpit de Riscos (ordem fixa)
│   ├── Fluxo e Eficiência
│   ├── Qualidade
│   ├── Dependências Externas
│   ├── Escopo e Entregas
│   └── Prontidão para Marco
│   └── cada um: 🟢 / 🟡 / 🔴
│
├── 🔍 2. Diagnóstico de Anomalias
│   ├── Regra: exige tendência ≥2 sprints (nunca 1 ponto)
│   ├── Sintoma (o que os dados mostram)
│   └── Causa provável (WIP, scope creep, blocker, qualidade)
│
├── 🛠️ 3. Plano de Mitigação
│   ├── Ação imediata (esta sprint)
│   ├── Ação de processo (próxima sprint+)
│   └── Critério de sucesso mensurável
│
├── 📈 4. Projeção de Risco
│   └── Baixo <20% / Médio 20-50% / Alto >50%
│
└── 🚚 RouteWise — cockpit real
    ├── 🔴 Fluxo: Lead Time 6.2→10.8 dias
    ├── 🔴 Qualidade: saldo de bugs acumulado = 9
    ├── 🔴 Dependências: hardware ainda bloqueado
    ├── 🟡 Escopo: velocity estável, previsibilidade caindo
    ├── 🔴 Marco: hardware chega na mesma sprint da apresentação
    └── Board: Sprint 5 em andamento
```

---

## Fluxo da aula

```
Módulos 1-4 (backlog,            risk-monitor-prompt.md         output-exemplo-riskmonitor-m52.md
cronograma, forecast)     ──►    (cockpit+diagnóstico+          ──►  (4/5 componentes VERMELHO)
métricas acumuladas               mitigação+projeção)                       │
                                                                              ▼
                                                              Módulo 7: status reports (mesma crise,
                                                              audiências diferentes)
```

## Conceito ↔ arquivo

| Conceito | Onde aparece |
|---|---|
| Template de AIOps | `risk-monitor-prompt.md` |
| Dados de 4 sprints | `risk-monitor-data-exemplo.csv` |
| Cockpit majoritariamente vermelho | `output-exemplo-riskmonitor-m52.md` |
| Estado do board | `jira-estado-board.md` |

---

## Glossário (para quem não é de projetos)

| Termo | O que significa |
|---|---|
| **AIOps** | Uso de IA/análise de dados para detectar anomalias e automatizar diagnóstico — normalmente aplicado a infraestrutura (servidores); aqui aplicado a métricas de gestão de projeto. |
| **Lead Time** | Tempo total desde que uma tarefa é criada até ser entregue. Quanto maior, mais devagar as coisas saem da fila. |
| **Cycle Time** | Tempo desde que o trabalho **começou de fato** (alguém pegou a tarefa) até ser entregue — é o Lead Time sem o tempo de espera na fila. |
| **WIP** (Work In Progress) | Quantidade de tarefas em andamento ao mesmo tempo. WIP alto geralmente significa multitarefa e entrega mais lenta, não mais rápida. |
| **Velocity (velocidade)** | Quantos Story Points o time entrega, em média, por sprint. |
| **Scope Creep** | Quando o escopo de uma tarefa/história cresce durante a execução, sem ter sido replanejado — sintoma clássico de estimativa que "nunca fecha". |
| **Saldo de bugs** | Bugs abertos menos bugs resolvidos num período. Se positivo por várias sprints seguidas, o backlog de bugs está crescendo mais rápido do que o time consegue consertar. |
| **Marco (milestone)** | Uma data ou entrega importante e fixa (ex: apresentação pra diretoria), usada como referência de "prontidão" do projeto. |
