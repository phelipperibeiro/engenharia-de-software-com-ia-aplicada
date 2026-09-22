# Risk Monitor Prompt — o framework do Módulo 5

Prompt completo: `../risk-monitor-prompt.md`. Aplica AIOps (detecção de anomalia usada em infraestrutura) a métricas de gestão de projeto.

## Onde buscar os dados no Jira

| Métrica | Onde |
|---|---|
| Lead Time / Cycle Time | Reports → Control Chart |
| Velocity | Reports → Velocity Chart |
| WIP (itens parados) | Board, filtro "In Progress" sem atualização recente |
| Bugs abertos | Issues tipo Bug, status Open, por período |

## Input

Métricas por sprint (Lead Time, Cycle Time, planejado/entregue, bugs abertos/resolvidos, itens parados >5 dias), contexto do projeto (sprint atual, blockers ativos, marco próximo) e **limites de alerta definidos pelo próprio projeto** (ex.: Lead Time alerta se ultrapassar `média das 2 primeiras sprints + 25%`).

## Análise em 4 partes

### 1. Cockpit de Riscos

Avalia, **nesta ordem fixa**: Fluxo e Eficiência → Qualidade → Dependências Externas → Escopo e Entregas → Prontidão para Marco. Cada componente recebe 🟢/🟡/🔴.

### 2. Diagnóstico de Anomalias

Para cada item Amarelo/Vermelho: qual métrica desviou, há quantas sprints, e diagnóstico mais provável (WIP excessivo, scope creep, blocker não resolvido, qualidade degradando). **Regra crítica**: nunca declarar anomalia com um único ponto de dado — exige tendência de ≥2 sprints consecutivas.

### 3. Plano de Mitigação

Ação imediata (esta sprint) + ação de processo (a partir da próxima) + critério de sucesso mensurável. `"revisar o processo"` não é aceito como ação — tem que ser específico (ex.: `"implementar Definition of Ready com 3 critérios obrigatórios"`).

### 4. Projeção de Risco

Classificação Baixo (<20%) / Médio (20–50%) / Alto (>50%) de não entregar o MVP no prazo, com raciocínio explícito.

## Regra de ouro: sintoma ≠ causa

O prompt exige separar sempre **o que os dados mostram** (sintoma) de **o que provavelmente está acontecendo** (causa) — evita a armadilha de tratar o número em vez do problema.

## Caso RouteWise nesta aula

`../risk-monitor-data-exemplo.csv` + o bloco de dados embutido no prompt trazem 4 sprints do RouteWise, todas as métricas já acumuladas dos módulos anteriores. O output (`../output-exemplo-riskmonitor-m52.md`) é revelador: **4 dos 5 componentes do cockpit ficam VERMELHO** — Lead Time subiu de 6,2 para 10,8 dias, saldo de bugs acumulado chegou a 9, o blocker de hardware (acelerômetro v2, o mesmo desde o Módulo 3) segue ativo, e o marco da diretoria em 2 semanas coincide com a chegada do hardware, sem buffer para testes. `../jira-estado-board.md`: board com **Sprint 5 em andamento** — o ponto mais avançado do case até aqui.
