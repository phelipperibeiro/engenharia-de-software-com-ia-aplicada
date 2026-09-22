# Backlog Scorer — o framework do Módulo 2

Prompt completo: `../backlog-scorer-prompt.md`. Diferente do Requirements Copilot (Módulo 1), **não é um system prompt fixo** — é um template preenchido por sessão e colado na mensagem do usuário (há uma variante para System Instructions, para scoring recorrente no mesmo projeto).

## Os dois frameworks calculados

### RICE

| Dimensão | Escala | Observação |
|---|---|---|
| Reach | nº usuários/transações por mês | estimar via contexto se não explícito |
| Impact | 3 massivo / 2 significativo / 1 médio / 0.5 baixo / 0.25 mínimo | |
| Confidence | 100% evidência sólida / 80% indicadores razoáveis / 50% intuição / <50% especulação | |
| Effort | pessoa-mês | considera integrações e dependências |

`RICE = (Reach × Impact × Confidence) / Effort`

### WSJF

| Dimensão | Escala |
|---|---|
| Business Value | 1–10 (contribuição pro OKR) |
| Time Criticality | 1–10 (o valor decai se atrasar?) |
| Risk Reduction/Opportunity Enablement | 1–10 |
| Job Size | 1–10 |

`Cost of Delay = BV + TC + RR` · `WSJF = CoD / Job Size`

## Formato de output

1. Tabela RICE
2. Tabela WSJF
3. Ranking combinado (desempate: maior Cost of Delay)
4. Justificativas (Impact e Confidence sempre com razão explícita — nunca "alta prioridade" sem argumento)
5. Flags ⚠️ para Confidence < 70%, dependência técnica não resolvida, ou Effort possivelmente subestimado

## O ponto pedagógico central: calibração

O módulo roda o scorer **duas vezes** sobre o mesmo backlog:

- **U2.2 (sem calibração)**: Reach estimado só a partir de "140 veículos" — números conservadores, Confidence 50%.
- **U2.3 (com calibração)**: Reach recalculado por **analogia** com uma feature parecida de outro cliente (ex.: 1.840 acessos/mês em frota de 200 veículos → ajustado por fator 0,7 para 140 veículos = 1.288), mais benchmarks de mercado (ex. McKinsey Fleet 2022) e dados financeiros de Cost of Delay (multa ANTT, risco ANVISA).

Resultado documentado em `../output-exemplo-scorer-m23.md`: o RICE de US01 salta de **420 → 3.091** só por trocar "140 veículos" (proxy fraco) por "1.288 acessos/mês estimados por analogia" (proxy calibrado). US03 cai de 2º para 5º lugar porque o Impact foi revisado para baixo ao explicitar o bloqueio de hardware.

**A lição não é "o número certo"** — é que **Reach e Impact são tão bons quanto a âncora usada para estimá-los**, e o prompt força você a declarar essa âncora.

## Prompt degradado — o contraste didático

O material mostra também o que acontece com um prompt genérico ("Priorize este backlog para mim: [lista]"): o modelo inventa critérios sem âncora no OKR, usa linguagem vaga ("importante", "alta prioridade") e não produz números auditáveis. É a diferença entre um ranking defensável em reunião de stakeholders e uma lista questionável.

## O que o prompt resolve vs. não resolve

| Resolve | Não resolve |
|---|---|
| Subjetividade não rastreável (escalas fixas + justificativa obrigatória) | Reach sem dado real — ainda é estimativa, revisar com produto |
| Viés de âncora na reunião | Dependências de outros times não mencionadas no input |
| Falta de números auditáveis | Effort real — o modelo não conhece a velocidade histórica do time |

## Caso RouteWise nesta aula

`../backlog-routewise-input.md`: 6 User Stories (US01 Alertas de Velocidade, US02 Manutenção Preditiva, US03 Score de Comportamento, US04 Sensor de Abertura de Baú, US05 Dashboard, US09 Carga Refrigerada) com o OKR de Carlos (reduzir sinistros de 7 para 5 até setembro/2026) como âncora. `../jira-estado-board.md` mantém o board no estado de backlog plano, Sprint 1 ainda não iniciada — a priorização acontece antes de qualquer sprint começar.
