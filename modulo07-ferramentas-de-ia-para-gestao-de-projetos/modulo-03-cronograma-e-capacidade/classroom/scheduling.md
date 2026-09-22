# Scheduling Prompt — o framework do Módulo 3

Prompt completo: `../scheduling-prompt.md`. Recebe o ranking de prioridade do Módulo 2 e transforma em cronograma de sprints.

## Input que o template exige

- **Contexto do time**: composição (papel/senioridade), capacidade real por sprint (**65% da capacidade nominal** — desconta cerimônias), duração de sprint, período total.
- **Backlog**: `ID | Título | Effort | Observações` (com blockers explícitos, ex. "BLOCKER: hardware — lead time 60 dias").
- **Dependências conhecidas**: declaradas manualmente (ex. "US-05 depende de US-01 em produção").
- **Restrições**: marcos obrigatórios, feriados, prazos de cotação.

## Output

1. **Cronograma por Sprint** — história, responsável, effort, capacidade utilizada.
2. **Dependências Mapeadas** — inclusive as **implícitas** que o modelo infere do conteúdo das histórias.
3. **Caminho Crítico** — sequência cujo atraso empurra a data final do MVP.
4. **Flags de Risco ⚠️** — cada blocker não resolvido.
5. **Soluções de Contorno** — abordagem paralela para continuar desenvolvendo enquanto o blocker não resolve.

## Regras de comportamento que fazem o cronograma ser confiável

- Nunca aloca a mesma pessoa em duas histórias que juntas estourem a capacidade da sprint.
- Sinaliza explicitamente quando uma história foi empurrada pra sprint posterior por dependência.
- Se uma história não cabe em nenhuma sprint com as restrições dadas → `"Fora do escopo do MVP"` com o porquê (no exemplo, **US-02 Manutenção Preditiva, 34 SP**, é cortada: não cabe em uma sprint de 22 SP reais e depende de hardware que só chega na semana 9).
- Duas histórias que tocam o mesmo componente técnico viram dependência candidata mesmo sem estar declarada.

## Prompt de análise What-If

Depois do cronograma inicial, um segundo prompt simula mudança de cenário e pede: impacto nas datas, ≥2 alternativas com trade-offs explícitos, e recomendação justificada. No exemplo (`../output-exemplo-scheduling-m32.md`) são simulados 3 cenários:

1. **Atraso de hardware** (60 → 88 dias)
2. **Dev Sênior ausente 1 semana na Sprint 3**
3. **Antecipação de prazo pelo cliente** — com 3 opções de resposta (corte de escopo, negociar frete expresso, troca de escopo na Sprint 5)

## O que o prompt resolve vs. não resolve

| Resolve | Não resolve |
|---|---|
| Dependências esquecidas (força declaração + infere implícitas) | Estimativas de Effort erradas na entrada |
| Otimismo de capacidade (usa 65% real, não 100% nominal) | Dependências de times externos não declaradas |
| Falta de plano B para blocker | Velocidade histórica sem dados de sprints anteriores |

## Caso RouteWise nesta aula

`../scheduling-routewise-input.md`: time de 6 devs (sênior backend, pleno fullstack ×2, pleno frontend, júnior QA...), sprint de 2 semanas, 6 sprints totais, backlog priorizado do Módulo 2 já com Effort em SP. `../output-exemplo-scheduling-m32.md` mostra o cronograma final: o hardware (blocker de 60 dias) empurra US-09 e US-04 pras sprints 5–6, US-02 é cortada do MVP por não caber na capacidade real, e a demo operacional pro Carlos vira marco explícito na Sprint 3. `../jira-estado-board.md` mantém o board com **Sprint 1 ativa, trabalho em andamento**.
