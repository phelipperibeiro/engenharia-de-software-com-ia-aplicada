# Módulo 07.05 — resumo

## Contexto no curso

Quinta aula do Módulo 07 e o ponto de virada do case RouteWise: as métricas acumuladas desde o Módulo 1 (Lead Time subindo, bugs acumulando, hardware ainda bloqueado) chegam a um cockpit majoritariamente vermelho, às vésperas do marco com a diretoria.

## Arquivos da aula

| Arquivo | Papel |
|---|---|
| `risk-monitor-prompt.md` | Template de AIOps de projeto: cockpit, diagnóstico, mitigação, projeção |
| `risk-monitor-data-exemplo.csv` | Métricas de 4 sprints em formato tabular |
| `output-exemplo-riskmonitor-m52.md` | Output de referência: cockpit 4/5 vermelho |
| `jira-estado-board.md` | Estado esperado do board: Sprint 5 em andamento |
| `Atividade - Módulo 5.pdf`, `Exemplo - Módulo 5.pdf` | Materiais complementares |

## Como rodar

1. Colar métricas por sprint + contexto do projeto + limites de alerta no template.
2. Rodar no AI Studio e comparar com `output-exemplo-riskmonitor-m52.md`.
3. Observar a ordem fixa de avaliação: Fluxo → Qualidade → Dependências → Escopo → Prontidão para Marco.

## Takeaways

1. **Anomalia exige tendência, não ponto isolado** — o prompt recusa declarar risco com um único dado ruim; precisa de ≥2 sprints consecutivas.
2. **Sintoma ≠ causa** — sempre separar "o que os números mostram" de "o que provavelmente está acontecendo".
3. **Plano de mitigação tem que ser específico e mensurável** — ações genéricas ("revisar o processo") são rejeitadas pelo formato do prompt.
4. **O cockpit é a consequência acumulada de decisões dos módulos anteriores** — o blocker de hardware do Módulo 3, o P85 do Módulo 4 e a degradação de Lead Time aqui não são dados soltos, são a mesma história evoluindo.
5. Este é o dado-fonte que o **Módulo 7** (status reports) usa para comunicar o mesmo risco a audiências diferentes.

## Onde olhar

O framework completo (cockpit, diagnóstico, mitigação, projeção): [risk-monitor.md](./risk-monitor.md).
