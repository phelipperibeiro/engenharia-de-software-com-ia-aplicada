# O que acontece de fato — passo a passo mecânico do Módulo 10

Só chat, igual aos módulos 1, 2, 3, 5, 6 e 7 — fecha o curso do mesmo jeito que a maioria dele funcionou: texto entrando, texto saindo, decisão humana no final. A diferença aqui é que são **3 conversas separadas**, cada uma usando o resultado da anterior como input.

---

## Passo a passo

### Passo 1: Parte A roda numa conversa nova

Você abre uma conversa nova no AI Studio, cola o system prompt da Parte A (validação de OKR) + os Objetivos/KRs do RouteWise. O modelo responde marcando ✅/❌ por critério — de novo, isso é **julgamento em texto**, seguindo os 6 critérios descritos no prompt, não uma checagem programática (não existe, por exemplo, um algoritmo verificando se "baseline está declarada" — é o modelo interpretando se o texto que você deu tem ou não um valor de referência).

### Passo 2: Você decide o que fazer com os ❌ antes de prosseguir

Se o modelo aponta "baseline não declarada", a correção (descobrir o índice atual de acidentes, por exemplo) é uma tarefa **sua**, fora do chat — o modelo não tem acesso a nenhum sistema de dados real do RouteWise pra buscar esse número sozinho.

### Passo 3: Parte B roda em outra conversa nova, com os OKRs (já validados) como input

Você copia os OKRs validados da Parte A + o backlog completo e cola numa **conversa nova** (não a mesma da Parte A — o prompt é explícito sobre isso). O modelo classifica cada item em 4 categorias, de novo por julgamento de linguagem, não por comparação automática contra um banco de dados de OKRs.

### Passo 4: Parte C (opcional) roda em outra conversa, com dados de múltiplos projetos

Aqui o "cálculo" da rúbrica (`🟢/🟡/🔴` baseado em % do proporcional ao tempo decorrido) é, mais uma vez, o modelo fazendo uma conta simples dentro do texto de resposta — plausível, mas sem garantia matemática, igual ao cockpit do Módulo 5.

### Passo 5: Nada é escrito de volta em nenhum sistema

As 3 partes produzem só texto lido por um humano. Não existe atualização automática de OKR num sistema de gestão, nem qualquer sincronização com o board do Jira — a "consolidação de portfólio" aqui é um exercício de leitura e decisão, não um dashboard vivo.

---

## Tabela-resumo: o que é o quê

| Etapa | Parece que é | De fato é |
|---|---|---|
| Validação de OKR (✅/❌ por critério) | Uma checagem automática de estrutura | Julgamento em linguagem sobre o texto que você forneceu |
| "% do proporcional ao tempo decorrido" | Um cálculo de sistema de BI | Uma conta simples feita dentro da resposta de texto — vale conferir |
| As 3 partes rodando em conversas separadas | Um pipeline automatizado (A alimenta B automaticamente) | Você, copiando manualmente o output de uma conversa pra colar como input da próxima |
| Scorecard de portfólio | Um dashboard atualizado em tempo real | Uma foto única, gerada a partir dos dados que você colou naquele momento |

## Fechando o padrão do módulo 07

Dos 10 sub-módulos, só **4, 8 e 9** têm código executando de verdade (Monte Carlo, Danger.js/mock, bot Node.js/Make.com) — e cada um deles tem uma razão específica e explicada pelo próprio material para sair do chat: necessidade de aleatoriedade real (Módulo 4), necessidade de determinismo em governança (Módulo 8), e necessidade de rodar continuamente reagindo a eventos externos (Módulo 9). Todo o resto do módulo 07 — incluindo este, o de fechamento — é deliberadamente **assistência de raciocínio via linguagem natural**, não automação.
