# O que acontece de fato — passo a passo mecânico do Módulo 1

Este arquivo existe porque "usar IA num módulo de gestão de projetos" soa como se algo estivesse **rodando** (um programa, um servidor, um script). Na maioria deste módulo, **não tem nada rodando** — é texto entrando num chat e texto saindo. Aqui está exatamente o que acontece em cada etapa, sem esconder nada atrás da palavra "IA".

---

## Parte 1 — O Requirements Copilot (a aula em si)

### Passo 1: Abrir o Google AI Studio

Você acessa o site `aistudio.google.com` no navegador. É um site com um campo de texto, igual a um chat do WhatsApp — não é instalado nada no computador.

### Passo 2: Colar o prompt no campo "System Instructions"

Você abre `requirements-copilot-system-prompt.md`, copia o texto de dentro do bloco de código (as ~330 linhas com as regras: INVEST, Gherkin, protocolo de ambiguidade etc.) e cola num campo específico do AI Studio chamado "System Instructions".

**O que isso faz de fato:** esse texto vira uma instrução fixa que o modelo (Gemini) vai seguir em toda a conversa. Não é executado — é só **texto que o modelo lê antes de responder**, igual a você dar instruções pra uma pessoa antes de pedir uma tarefa.

### Passo 3: Colar a transcrição como mensagem

Você copia o conteúdo de `transcricao-discovery-routewise.md` (a reunião fictícia do Carlos) e cola no campo de mensagem, como se estivesse mandando uma mensagem de chat.

### Passo 4: Enviar e esperar a resposta

Você aperta enviar. O Gemini **gera texto**, token por token, seguindo as regras que você colou no Passo 2. Isso é a única coisa que de fato "acontece" tecnicamente: uma chamada de API de LLM (texto de entrada → texto de saída). Não há banco de dados, não há cálculo determinístico, não há script — é geração de linguagem.

### Passo 5: Ler e comparar

A resposta que aparece na tela é o que está salvo em `output-demo-m1.2-v1.0.md` — alguém copiou a resposta do chat e colou num arquivo `.md` pra virar material de referência do curso.

> **Resumo da Parte 1:** copiar texto → colar em dois campos → apertar enviar → ler o texto que volta. Não tem código, não tem servidor, não tem "rodar" no sentido de programação.

---

## Parte 2 — Da resposta da IA até o Jira

### Passo 6: Transformar o output em backlog estruturado

A seção 7 do output ("Cards prontos para Jira") tem os cards em texto formatado. Alguém (o instrutor, nesse caso) pegou esse conteúdo e montou o arquivo `routewise-jira-import.csv` — uma planilha em formato de texto (linhas separadas por vírgula), com colunas como `Summary`, `Issue Type`, `Priority`, `Story Points`, `Epic Link`, `Sprint`.

**Isso não foi gerado automaticamente pelo modelo** — é um passo manual de formatação, feito uma vez, que já vem pronto pra você usar.

### Passo 7: Importar o CSV no Jira (ação manual na interface, não script)

Seguindo `guia-board-routewise.md`:

1. Criar uma conta grátis no Jira Cloud e um projeto tipo "Scrum".
2. No Jira: ⚙️ → "System" → "External System Import" → escolher "CSV" → selecionar o arquivo `routewise-jira-import.csv`.
3. Mapear as colunas do CSV pros campos do Jira (tela de "arrastar e conferir", não precisa digitar nada).
4. Clicar em "Begin Import". O próprio Jira lê o arquivo e cria as ~400 linhas como issues (épicos, histórias, tarefas) em alguns segundos a 1-2 minutos.

**O que "roda" aqui:** é o **importador interno do Jira**, uma funcionalidade pronta da ferramenta — você não escreve nem executa nenhum código. É equivalente a importar uma planilha do Excel num sistema qualquer.

---

## Parte 3 — O único código de verdade do módulo (e é opcional)

`guia-board-routewise.md` tem uma "Parte 3" com scripts reais em JavaScript e Python que chamam a **API REST do Jira** pra mudar o status das issues automaticamente (em vez de clicar item por item na tela).

- Isso **é** código de verdade — roda com `node script.mjs` ou `python script.py`.
- Ele faz requisições HTTP (`fetch`/`requests`) pro Jira, autenticando com um API Token.
- **Mas não é usado no Módulo 1.** Ele existe pra configurar o estado do board dos módulos **seguintes** (ex: simular que a Sprint 4 já terminou com certas issues "Feito"/"Fazendo", pro Módulo 7 ter esse cenário pronto). No Módulo 1 o board fica no estado mais simples: backlog recém-importado, nada além disso.

---

## Tabela-resumo: o que é o quê

| Etapa | O que parece que é | O que de fato é |
|---|---|---|
| Requirements Copilot responder | "A IA processou a reunião" | Chamada de API de LLM: texto entra, texto sai. Nenhum cálculo, nenhuma lógica de programa — é previsão de próxima palavra treinada pra seguir instruções. |
| `output-demo-m1.2-v1.0.md` | Um "resultado de execução" | Uma resposta de chat copiada e colada num arquivo `.md` |
| `routewise-jira-import.csv` | Algo "gerado pelo sistema" | Um arquivo de planilha (texto separado por vírgula) montado manualmente a partir do output |
| Importar no Jira | "Rodar a importação" | Clicar em botões numa tela — o Jira tem essa função pronta, ninguém escreveu código pra isso |
| Scripts da Parte 3 do guia-board | Parte do módulo 1 | Código real (JS/Python) que chama a API do Jira — mas é usado só pra preparar o board de **módulos futuros**, não faz parte do exercício do Módulo 1 |

## Por que isso importa

Nos módulos mais à frente (4, 8 e 9), isso muda de verdade:

- **Módulo 4**: o Monte Carlo (`monte-carlo-routewise.py`/`.js`) **é** código que roda 10.000 simulações reais — ali sim "rodar" significa executar um programa, porque o próprio material explica que **pedir isso pra IA geraria um número inventado**, não uma simulação real.
- **Módulo 8**: o `danger-config-routewise.py` roda de verdade e verifica regras contra um PR (real ou simulado em JSON).
- **Módulo 9**: o `ecosystem-bot-template.js` é um bot que roda continuamente, ouvindo mensagens do Slack.

O Módulo 1 é o extremo oposto desses três: **100% conversa com um modelo de linguagem + preenchimento manual de planilha**, sem nenhum programa em execução.
