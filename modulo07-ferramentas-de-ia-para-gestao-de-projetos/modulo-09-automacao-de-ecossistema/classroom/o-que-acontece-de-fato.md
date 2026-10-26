# O que acontece de fato — passo a passo mecânico do Módulo 9

Este é o módulo com mais mecanismos diferentes do curso inteiro: tem chat puro, tem automação sem código (Make.com), tem um bot rodando de verdade (Node.js), e tem uma automação nativa do Jira sem nenhuma IA envolvida. Vale separar cada peça.

---

## Peça 1 — Testar o parser isoladamente: só chat

### Passo 1: Colar o system prompt + uma mensagem de teste

`nl-to-workflow-prompt.md` no campo "System Instructions", uma das 3 mensagens de exemplo (ex: "Preciso investigar por que os alertas...") na mensagem do usuário.

### Passo 2: O modelo devolve um bloco JSON

Igual ao Módulo 6: isso é **texto que parece JSON**, gerado pelo modelo seguindo o schema do prompt — não um serializador de dados de verdade. É por isso que o guia de setup lista, nos "Problemas comuns", `"JSON inválido no response da IA"` como algo que acontece na prática e exige reforçar a instrução "retorne APENAS o JSON".

Até aqui, **nada foi criado no Jira nem no Slack** — é só a resposta de um chat, exatamente como nos módulos anteriores.

---

## Peça 2 — Make.com: automação real, mas sem escrever código

### O que é, de fato

Make.com é uma plataforma (SaaS) que fica **rodando de verdade, continuamente, na nuvem** — mas você não escreve código pra configurar: monta o fluxo arrastando módulos numa tela visual (gatilho: "nova mensagem no Slack" → ação: "chamar a IA" → ação: "criar issue no Jira").

`make-blueprint-m9.json` é um arquivo de configuração desse fluxo, pronto pra importar (Make.com lê esse JSON e recria os módulos visuais automaticamente, sem você montar do zero). Depois de importado e ativado, esse cenário **fica escutando de verdade** o canal do Slack — cada nova mensagem dispara a execução real do fluxo, chamando a API de IA e depois a API do Jira.

**Diferença chave pros módulos anteriores:** aqui, uma vez configurado, o processo roda sozinho, sem você copiar/colar nada — é automação de produção, não um exercício de chat.

---

## Peça 3 — Bot Node.js: código rodando de verdade, por você

### O que `ecosystem-bot-template.js` exige pra rodar

```bash
npm install @slack/bolt @anthropic-ai/sdk axios dotenv
node ecosystem-bot-template.js   # (ou script equivalente do package.json)
```

Isso é um **processo real do Node.js**, ficando ativo (`App` do Slack Bolt escutando eventos), que:
1. Recebe mensagens do Slack em tempo real via WebSocket (Socket Mode).
2. Chama a **API real da Anthropic** (`ANTHROPIC_API_KEY`) pra rodar o parser.
3. Chama a **API REST real do Jira** (`JIRA_API_TOKEN`) pra criar o card.

Nada disso é simulado — são três chamadas de rede reais em sequência, disparadas por um evento real do Slack. Pra rodar localmente em desenvolvimento, o guia usa `ngrok` pra expor seu computador na internet temporariamente (porque o Slack precisa conseguir alcançar seu servidor local).

---

## Peça 4 — Jira → Slack: automação real, sem IA e sem código

A "segunda direção" (avisar o Slack quando um card muda de status) não usa IA, Make.com nem o bot Node.js. É uma **regra de automação nativa do próprio Jira** (Project settings → Automação → "Item transicionado" → "Enviar mensagem do Slack"), configurada só clicando em telas. Quando ativada, o Jira dispara essa notificação sozinho a cada transição de status — automação real, mas 100% dentro da ferramenta, sem escrever nada.

---

## Tabela-resumo: o que é o quê

| Mecanismo | Precisa de código? | Fica rodando sozinho depois de configurado? | O que de fato executa |
|---|---|---|---|
| Testar no AI Studio | Não | Não | Uma resposta de chat, nada mais |
| Make.com (`make-blueprint-m9.json`) | Não (visual) | **Sim** | Fluxo real na nuvem: escuta Slack → chama IA → chama Jira |
| Bot Node.js (`ecosystem-bot-template.js`) | Sim | **Sim**, enquanto o processo estiver ativo | Servidor real, 3 chamadas de API reais por mensagem |
| Automação Jira→Slack | Não | **Sim** | Webhook nativo do Jira, sem IA envolvida |

## Por que isso importa

Este módulo mostra o espectro completo: da conversa isolada (Peça 1, sem consequência nenhuma fora da tela) até um bot de produção rodando 24/7 (Peça 3). O próprio guia reconhece que configurar tudo isso pode não dar tempo numa aula — e por isso deixa explícito que **testar só o parsing no AI Studio já é uma atividade válida**: entender o comportamento do modelo primeiro, antes de conectar consequências reais a ele.
