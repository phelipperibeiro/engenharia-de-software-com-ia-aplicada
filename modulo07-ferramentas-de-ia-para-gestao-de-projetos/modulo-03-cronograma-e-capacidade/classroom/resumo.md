# Módulo 07.03 — resumo

## Contexto no curso

Terceira aula do Módulo 07. Recebe o ranking priorizado do Módulo 2 e transforma em cronograma real de sprints, considerando capacidade do time e o blocker de hardware (lead time de 60 dias) que atravessa o caso RouteWise inteiro.

## Arquivos da aula

| Arquivo | Papel |
|---|---|
| `scheduling-prompt.md` | Template de cronograma + prompt de análise what-if |
| `scheduling-routewise-input.md` | Time, capacidade, backlog priorizado, dependências e restrições do RouteWise |
| `output-exemplo-scheduling-m32.md` | Cronograma de 6 sprints + 3 simulações what-if |
| `jira-estado-board.md` | Estado esperado do board: Sprint 1 ativa |
| `Atividade - Módulo 3.pdf`, `Exemplo - Módulo 3.pdf` | Materiais complementares |

## Como rodar

1. Preencher contexto do time (capacidade real = 65% da nominal), backlog com Effort, dependências e restrições.
2. Rodar no AI Studio e comparar com `output-exemplo-scheduling-m32.md`.
3. Rodar o prompt what-if em cima do cronograma gerado, simulando um dos três cenários do exemplo.

## Takeaways

1. **Capacidade real ≠ capacidade nominal** — usar 65% do nominal evita o "planejamos com 100%, entregamos com 65%" clássico.
2. **Dependência implícita também conta** — duas histórias no mesmo componente técnico viram dependência candidata mesmo sem estar escrita.
3. **Cortar do MVP é uma saída válida e explícita** — quando uma história não cabe em nenhuma sprint com as restrições dadas, o prompt marca "Fora do escopo do MVP" com o motivo, em vez de forçar um encaixe artificial.
4. **What-if separa opções de trade-off, não dá uma resposta única** — cada cenário simulado traz pelo menos 2 alternativas com prós/contras antes da recomendação.
5. O blocker de hardware (semana 9) definido aqui reaparece no **Módulo 4** (Monte Carlo) e no **Módulo 5** (risk monitor).

## Onde olhar

O framework completo (cronograma, dependências, caminho crítico, what-if): [scheduling.md](./scheduling.md).
