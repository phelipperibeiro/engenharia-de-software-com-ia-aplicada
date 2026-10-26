# O que acontece de fato — passo a passo mecânico do Módulo 6

Só chat, igual aos módulos 1, 2, 3, 5, 7 e 10. A diferença aqui é que o output final (o JSON) **parece** algo que "vai automaticamente pro Jira" — mas não vai, a não ser que alguém copie e cole ou construa uma integração à parte (isso só acontece de verdade no Módulo 9).

---

## Passo a passo

### Passo 1: A transcrição já vem pronta — e ela também não foi "gerada por IA" neste módulo

`transcricao-sprint-review-s2.md` é um texto fictício, escrito para o curso, simulando uma reunião. Ele é o **input** do exercício, não algo que a IA produziu. (Em um cenário real, essa transcrição viria de uma ferramenta de transcrição de áudio tipo Whisper — mas isso está fora do escopo deste módulo, que começa já com o texto pronto.)

### Passo 2: Colar o system prompt em System Instructions

Igual ao Módulo 1: `meeting-digest-prompt.md` vai no campo "System Instructions" do AI Studio — é a instrução fixa que o modelo segue.

### Passo 3: Colar a query (metadados + transcrição) na mensagem

`meeting-digest-query-m62.md` já vem com os campos preenchidos (participantes, data, duração, transcrição colada). Você cola isso como mensagem do usuário e envia.

### Passo 4: O modelo gera as 5 seções — tudo texto, nada estruturado "de verdade" até aqui

Resumo, Tabela de Ações, Decisões, Perguntas em Aberto e o bloco JSON são **todos gerados como parte da mesma resposta de texto**. O bloco que parece um JSON válido é, na verdade, o modelo escrevendo caracteres que formam JSON — ele não roda um serializador de dados por trás. Na prática costuma sair um JSON bem formado (o prompt pede isso explicitamente), mas **vale validar** antes de alimentar qualquer sistema automaticamente com ele (é exatamente o "Problema comum" citado no Módulo 9: "JSON inválido no response da IA").

### Passo 5: A "importação pro Jira" não acontece sozinha

O prompt gera o JSON **pronto pra você usar** num importador ou script — mas neste módulo, ninguém importa de fato. É o Módulo 9 que mostra como pegar esse tipo de JSON e realmente criar o card no Jira (via bot Node.js ou Make.com).

### Passo 6: A curadoria humana (o ponto mais importante do módulo)

O output de referência (`output-digest-backup-sprint-review-m62.md`) documenta explicitamente **o que o modelo deixou passar** — uma decisão técnica e uma pergunta em aberto que estavam na transcrição mas não foram capturadas. Isso não é um bug de execução: é uma limitação de interpretação de linguagem natural, que só um humano revisando o texto detecta.

---

## Tabela-resumo: o que é o quê

| Etapa | Parece que é | De fato é |
|---|---|---|
| Transcrição de entrada | Produzida pela IA neste módulo | Texto fictício já pronto, usado como input |
| Bloco JSON no output | Dado estruturado processado por um sistema | Texto gerado pelo modelo que *parece* JSON — precisa ser validado antes de usar |
| "Importar pro Jira" | Uma etapa deste módulo | Não acontece aqui — o JSON fica pronto, mas a integração real só aparece no Módulo 9 |
| Decisões/perguntas capturadas | Extração automática garantida | Interpretação de linguagem, sujeita a omissão — por isso a curadoria humana é parte do processo, não um extra |

## Por que isso importa

O valor deste módulo não é "a IA lê a ata pra você" — é ela **acelerar** a primeira versão da ata, deixando pra você a parte que só um humano faz bem: notar quando uma decisão técnica foi dita de forma coloquial e quase escapou.
