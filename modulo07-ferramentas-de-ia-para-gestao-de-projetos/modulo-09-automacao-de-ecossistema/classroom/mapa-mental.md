# Mapa mental — Módulo 07.09

```
Automação de Ecossistema
│
├── 🎯 Objetivo
│   └── Mensagem Slack (NL) → card estruturado → Jira, automaticamente
│
├── 🧠 Parser puro (só JSON, nunca prosa)
│   ├── type: bug/task/feature/question/decision
│   ├── assignee: nome | null | [A DEFINIR] (nunca inventa)
│   ├── dueDate: inferência relativa | null
│   ├── description: expande, não copia
│   └── confidence: high/medium/low → fallback de automação
│
├── 🔀 Casos especiais
│   ├── Múltiplas ações → array de cards (linkedMessage)
│   ├── Pergunta → não cria card, pede confirmação
│   └── Sem contexto → type:unknown, confidence:low
│
├── 🔧 Duas formas de implementar
│   ├── Make.com (make-blueprint-m9.json) — sem código
│   └── Node.js (ecosystem-bot-template.js) — Slack Bolt + Claude + Jira API
│
├── 🔁 Segunda direção (Jira → Slack)
│   ├── Sem IA, sem Make.com
│   └── Automação nativa do Jira + Incoming Webhook
│
├── 🩹 Problemas comuns documentados
│   ├── not_in_channel, 401 Jira, JSON inválido
│   └── Setup falho ainda é atividade válida
│
└── 🚚 RouteWise — 3 mensagens de teste
    ├── Bug de alertas (confidence high)
    ├── Antecipação com voluntário implícito ([A DEFINIR])
    └── Blocker crítico — actionRequired null (gancho de ajuste)
```

---

## Fluxo da aula

```
Módulo 6 (Meeting Digest,      nl-to-workflow-prompt.md          ecosystem-bot-template.js /
JSON de reunião)         ──►   (parser generalizado p/           make-blueprint-m9.json
                                 qualquer mensagem)         ──►   (integração real Slack↔Jira)
```

## Conceito ↔ arquivo

| Conceito | Onde aparece |
|---|---|
| Schema JSON + regras de extração | `nl-to-workflow-prompt.md` |
| Implementação sem código | `make-blueprint-m9.json` |
| Implementação com código | `ecosystem-bot-template.js` |
| Setup + problemas comuns | `setup-guide-m9.md` |

---

## Glossário (para quem não é de projetos)

| Termo | O que significa |
|---|---|
| **NL** (Natural Language) | Linguagem natural — texto escrito como as pessoas falam (ex: uma mensagem de Slack), em vez de um formato estruturado como JSON. |
| **Parser** | Programa (ou prompt de IA) que lê um texto e extrai dele dados estruturados — aqui, transforma mensagem solta em card com campos definidos. |
| **JSON** | Formato de dado estruturado (chave: valor) que sistemas conseguem processar diretamente sem "interpretar" texto. |
| **Webhook** | Mecanismo pelo qual um sistema avisa outro automaticamente quando algo acontece (ex: Jira avisa o Slack quando um card muda de status), sem precisar checar manualmente. |
| **Make.com** | Ferramenta de automação "sem código" (no-code) que conecta apps diferentes (Slack, Jira etc.) através de fluxos visuais, sem precisar programar. |
| **Bot** | Programa que age como um usuário automatizado dentro de um app (ex: um bot no Slack que lê mensagens e cria cards no Jira sozinho). |
| **Blueprint** | Arquivo que descreve um cenário/fluxo pronto do Make.com, pra importar de uma vez em vez de montar do zero. |


