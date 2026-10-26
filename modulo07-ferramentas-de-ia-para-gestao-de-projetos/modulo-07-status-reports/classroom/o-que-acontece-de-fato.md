# O que acontece de fato — passo a passo mecânico do Módulo 7

Só chat, igual aos módulos 1, 2, 3, 5, 6 e 10. A "inteligência" aqui está inteira na forma como o prompt organiza a tradução de um dado técnico em três textos diferentes — não em nenhum processamento por trás.

---

## Passo a passo

### Passo 1: Configurar dois campos no AI Studio

Diferente de colar tudo numa mensagem só, este módulo usa explicitamente **dois campos separados**: o SYSTEM PROMPT (as regras dos 3 relatórios) em "System Instructions", e os dados da sprint na mensagem do usuário — com temperatura ajustada pra 0.3 (parâmetro do modelo que reduz a variação/criatividade da resposta, deixando ela mais previsível).

### Passo 2: Colar os dados da sprint (já preenchidos ou os seus)

`status-report-prompt.md` já traz um bloco "QUERY DE EXEMPLO — Sprint 4 RouteWise" pronto pra colar — números de velocidade, bugs, blockers, tudo que você mesmo levantaria olhando o Jira, como no Módulo 5.

### Passo 3: O modelo gera 3 textos na mesma resposta

Não são 3 chamadas separadas, nem 3 modelos diferentes — é **uma única resposta** de chat contendo os três relatórios em sequência (Técnico, Gestor, Executivo), cada um seguindo o formato e as restrições de linguagem descritas no prompt (ex: "Executivo nunca menciona story points").

### Passo 4: A Checklist de Curadoria também é gerada pelo modelo, não é uma verificação automática

O prompt pede, ao final, que o próprio modelo produza 4 perguntas de checklist ("os números batem entre os 3 relatórios?"). Isso é o modelo **escrevendo um lembrete de revisão**, não um validador rodando de verdade sobre o texto que ele mesmo gerou — ele não teria como "auditar a si mesmo" com garantia. Quem confere a checklist é você, lendo os 3 relatórios lado a lado.

### Passo 5: Nenhum relatório é enviado automaticamente

O texto sai pronto na tela do AI Studio. Enviar pro Slack, e-mail ou reunião é uma ação manual (copiar e colar, ou anexar num documento) — não existe aqui nenhuma integração de envio automatizado.

---

## Tabela-resumo: o que é o quê

| Etapa | Parece que é | De fato é |
|---|---|---|
| 3 relatórios distintos | 3 processamentos separados | Uma única resposta de chat com três blocos de texto, seguindo o mesmo prompt |
| Temperatura 0.3 | Um "modo preciso" que garante exatidão | Um parâmetro que reduz a aleatoriedade da geração — ajuda a manter consistência, mas não é garantia matemática |
| Checklist de Curadoria | Uma verificação automática de qualidade | Um lembrete gerado em texto — a checagem de fato é feita por você, lendo |
| Distribuição do relatório | Parte do módulo | Ação manual, fora do escopo do exercício |

## Por que isso importa

O ganho real deste módulo é a **velocidade de tradução**: pegar o mesmo dado técnico e reescrevê-lo 3 vezes pra 3 audiências diferentes, tarefa que manualmente toma tempo e tende a ficar inconsistente entre as versões. Mas a consistência entre os 3 textos (mesmos números, mesma data) ainda precisa ser conferida por quem vai assinar embaixo do relatório — é exatamente pra isso que a Checklist de Curadoria existe.
