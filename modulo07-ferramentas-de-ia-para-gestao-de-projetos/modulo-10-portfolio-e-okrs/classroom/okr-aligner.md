# OKR Aligner — o framework do Módulo 10

Prompt completo: `../okr-aligner-prompt.md`. Três templates encadeados, cada um rodando em **conversa nova** no AI Studio, usando o output do anterior como input. Config: Gemini 3.1 Pro Preview, temperatura 0.3.

## Parte A — Validação de OKRs

Antes de alinhar backlog à estratégia, valida se os OKRs em si são bons. Para cada Objetivo: é inspiracional/orientado a resultado, ou tarefa disfarçada? Para cada Key Result, 6 critérios ✅/❌:

| Critério | O que verifica |
|---|---|
| Mensurável | número/indicador, não "melhorar" vago |
| Baseline declarada | sem valor atual explícito, não dá pra verificar atingimento |
| Prazo definido | data específica ou prazo do ciclo |
| Responsável implícito | há dono claro |
| Independente de output | mede outcome (resultado de negócio), não output (entrega) |
| Verificável por terceiro | um auditor externo confirmaria? |

No exemplo RouteWise, **ambos os KRs falham em "Baseline declarada"** — "reduzir 20%" sem dizer o índice atual não é verificável — e ambos recebem `⚠️ Dependência não declarada` (o KR depende de um módulo específico estar em produção com meses suficientes de dado).

## Parte B — Alinhamento Backlog × OKRs

Classifica cada item do backlog em 4 categorias:

| Categoria | Definição |
|---|---|
| Alinhado Diretamente | contribui de forma direta e mensurável para um KR |
| Alinhado Indiretamente | viabiliza um item direto, mas não move o KR sozinho |
| Não Alinhado | sem relação clara com nenhum OKR do ciclo |
| Épico Futuro sem OKR | valor potencial, mas sem OKR neste ciclo |

Não remove nada do backlog — só classifica; a decisão de cortar é do gestor. Regra importante: **item Não Alinhado não é necessariamente ruim** (pode ser dívida técnica, compliance obrigatório) — o prompt exige explicitar a razão.

No exemplo, das 11 US do RouteWise: 3 Diretas, 3 Indiretas, 3 Não Alinhadas (inclusive US-07 Relatório Executivo — útil, mas não move nenhum KR), 2 Épicos Futuros.

## Parte C — Scorecard de Portfólio Multi-Projeto

Para gestores com mais de um projeto. Aplica **rúbrica fixa e idêntica** a todos (nunca ajustada por projeto):

```
🟢 Verde:    todos os KRs ≥60% do proporcional ao tempo decorrido E nenhum blocker sem dono
🟡 Amarelo:  algum KR entre 40-60% do proporcional OU blocker com dono e plano
🔴 Vermelho: algum KR <40% do proporcional OU blocker sem dono identificado
```

Gera: tabela do scorecard (Projeto/Status/Dimensão crítica/Motivo/Próxima ação), riscos transversais (recursos compartilhados = ponto único de falha entre projetos), e foco da reunião de portfólio (**máximo 3 itens**, só o que exige decisão do gestor).

Regra de eficiência: **se nenhum projeto estiver Vermelho, a reunião de portfólio pode virar envio assíncrono do dashboard** — silêncio significa OK.

No exemplo (3 projetos fictícios: RouteWise, Fintech, E-commerce), o dev de integrações que atende os três projetos simultaneamente é sinalizado como **ponto único de falha** nos riscos transversais — um problema que só aparece quando se olha o portfólio inteiro, não projeto a projeto.

## Por que a ordem A → B → C importa

> "A validação dos OKRs deve acontecer antes do alinhamento — um OKR com baseline ausente invalida toda a análise de alinhamento subsequente."

E a distinção mais importante do módulo: **"Entregar o módulo de alertas" é output. "Reduzir acidentes em 20%" é outcome.** O alinhamento correto mapeia features para outcomes, não para outros outputs — é o mesmo critério "Independente de output" da Parte A aplicado ao backlog inteiro.

## Caso RouteWise nesta aula — fechamento do módulo 07

Os OKRs originais (definidos desde o CSV do Módulo 1: reduzir sinistros de 7 para 5, reduzir custo de manutenção em 15%) são validados, o backlog completo (US-01 a US-10) é classificado contra eles, e o portfólio fictício de 3 projetos ilustra a visão de gestor sênior. `../jira-estado-board.md`: mesmo snapshot da Sprint 4 do Módulo 7, com épicos visíveis e vinculados aos OKRs no backlog.
