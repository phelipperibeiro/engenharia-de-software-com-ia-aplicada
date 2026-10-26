# O que acontece de fato — passo a passo mecânico do Módulo 3

Mesma mecânica dos módulos anteriores: **nenhum programa roda**. O "cronograma" e as simulações "what-if" são texto gerado por um modelo de linguagem seguindo um template — não um algoritmo de otimização de agenda.

---

## Passo a passo

### Passo 1: Preencher o template de `scheduling-prompt.md`

Você substitui os campos `[PREENCHER]`: composição do time, capacidade real (65% da nominal — uma conta que **você** faz antes, não o modelo), backlog com Effort, dependências conhecidas e restrições (marcos, feriados).

### Passo 2: Colar no AI Studio e enviar

Texto entra, texto sai — igual aos módulos anteriores. O "Cronograma por Sprint" que volta é o modelo distribuindo as histórias entre sprints **seguindo o raciocínio descrito no prompt** (não estourar capacidade, respeitar dependência, sinalizar o que não cabe).

### Passo 3: Não existe verificação automática de que a "conta fecha"

Isso é importante: quando o output mostra "Capacidade utilizada: 18/22 SP", **ninguém somou isso com uma calculadora** — o modelo gerou esse número junto com o resto do texto, tentando ser consistente. É plausível e geralmente bate, mas não tem a garantia que teria uma ferramenta de scheduling real (tipo MS Project ou um solver de otimização). Vale conferir a soma manualmente antes de levar pra reunião.

### Passo 4: Rodar o prompt What-If — uma segunda conversa, não uma re-simulação

O "Prompt de Análise What-If" (final de `scheduling-prompt.md`) é enviado **depois**, numa mensagem separada, descrevendo a mudança de cenário em português ("o lead time do hardware aumentou pra 90 dias"). O modelo reescreve o raciocínio à luz dessa mudança — de novo, é geração de texto nova, não uma re-execução de um algoritmo com o parâmetro alterado.

### Passo 5: Ler e decidir

O cronograma final e as opções do what-if são lidas por um humano, que decide o que fazer. Nada disso escreve automaticamente no Jira (isso só aconteceria se você copiasse manualmente as datas pro board, ou usasse um script como o da Parte 3 do `guia-board-routewise.md` do Módulo 1 — que é código real, mas não faz parte deste módulo).

---

## Tabela-resumo: o que é o quê

| Etapa | Parece que é | De fato é |
|---|---|---|
| "Cronograma por Sprint" | Saída de uma ferramenta de scheduling/PM | Texto gerado seguindo as regras do prompt, sem verificação matemática automática |
| "Capacidade utilizada: 18/22 SP" | Um cálculo garantido | Um número plausível gerado junto com o texto — vale conferir a soma |
| What-if | Uma re-simulação do sistema | Uma segunda pergunta em texto natural, respondida do zero |

## Por que isso importa

O cronograma aqui é uma **ferramenta de raciocínio assistido**, não um solver determinístico. Ele ajuda a não esquecer dependência e a formalizar o raciocínio de alocação — mas antes de comprometer uma data com um cliente, a aritmética de capacidade merece uma conferência manual. É exatamente essa desconfiança saudável que o Módulo 4 formaliza: nele, o material é explícito que **pedir uma simulação numérica pro LLM produz um número que parece estatístico mas não é** — por isso o Monte Carlo daquele módulo roda em script de verdade, não em prompt.
