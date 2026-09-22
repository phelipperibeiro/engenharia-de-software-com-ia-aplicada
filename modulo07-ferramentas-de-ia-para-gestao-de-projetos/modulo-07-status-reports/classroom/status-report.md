# Status Report Prompt — o framework do Módulo 7

Prompt completo: `../status-report-prompt.md`. Configuração em **dois campos separados** no AI Studio: System Instructions (o prompt) + mensagem do usuário (os dados da sprint), temperatura 0.3. Em plataformas sem campo System separado (ChatGPT Free, Copilot), os dois blocos vão juntos na mensagem.

## As 3 audiências — mesma sprint, três relatórios

| Relatório | Audiência | Linguagem | Tamanho | Formato |
|---|---|---|---|---|
| **Técnico** | devs, QA, tech leads | métricas (Lead Time, WIP, SP, bugs), termos de engenharia | 150–250 palavras | texto corrido + ações pra próxima sprint |
| **Gestor/PM** | PMO, coordenador | risco e decisão, status Verde/Amarelo/Vermelho | 150–200 palavras | badge + contexto + "Decisão necessária" (máx. 2) + próximo marco |
| **Executivo** | C-level, diretoria | negócio, **zero** jargão técnico | 80–120 palavras | O que está pronto / Em risco / Próximo passo / Aprovação necessária |

## A regra mais importante do módulo

> O Relatório Executivo **NÃO** deve mencionar story points, velocity, Lead Time, bugs, nem siglas sem explicação: se não é acionável para um diretor, não inclua.

Story points e Lead Time são dado técnico útil pro time; pro diretor, viram "prazo", "custo", "risco". É tradução, não resumo.

## Restrições que amarram os 3 relatórios entre si

- Os três **precisam vir dos mesmos dados** — nenhuma informação nova em qualquer um deles.
- O Relatório Gerencial tem **no máximo 2 decisões necessárias** — mais que isso, as excedentes viram contexto adicional (evita paralisia de decisão).
- Se os dados indicam risco sério (velocidade caindo 3+ sprints seguidas, bugs acumulando), o status **tem** que virar Vermelho no gerencial e a linguagem tem que sinalizar urgência no executivo — não é opcional suavizar.

## Checklist de Curadoria (gerado junto com os 3 relatórios)

1. Números de velocidade e datas consistentes entre os três?
2. Tom calibrado pra audiência (técnico=específico, gestor=decisão, executivo=negócio)?
3. Decisões necessárias explícitas no gerencial e executivo?
4. O Executivo menciona SP/velocity/Lead Time? Se sim, substituir por linguagem de negócio.

## Caso RouteWise nesta aula

Fechamento histórico da **Sprint 4** (a mesma sprint com cockpit vermelho no Módulo 5): 2 de 5 histórias entregues, US-03 removida por blocker de hardware, saldo de 9 bugs acumulados, BUG-S4-10 crítico afetando 43 dos 140 veículos. Os três relatórios (`../output-exemplo-status-report-m72.md`) tratam o **mesmo dado bruto** de formas completamente diferentes: o técnico detalha o BUG-S4-10 e pede WIP mais rígido; o gerencial classifica 🔴 e pede aprovação de orçamento de hardware **ou** corte de escopo; o executivo fala só em "painel operacional" e "risco de equipamentos".

> Nota didática do próprio material: mesmo com o board ao vivo possivelmente já na Sprint 5 (pós Módulo 5), este módulo usa a Sprint 4 porque status report funciona melhor com um **período encerrado**, não uma sprint em andamento. `../jira-estado-board.md` documenta esse snapshot.
