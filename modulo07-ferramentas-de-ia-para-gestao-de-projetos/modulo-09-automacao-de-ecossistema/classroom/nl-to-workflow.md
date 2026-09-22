# NL to Workflow — o framework do Módulo 9

Prompt completo: `../nl-to-workflow-prompt.md`. Diferente de todos os prompts anteriores do módulo, este é um **parser puro**: "Você não é um assistente de conversação. Você é um parser. Não responda em prosa. Retorne sempre JSON válido, sem texto antes ou depois."

## Schema de output

```json
{
  "type": "bug" | "task" | "feature" | "question" | "decision",
  "title": "...", "priority": "Highest|High|Medium|Low",
  "assignee": "nome" | null | "[A DEFINIR]",
  "dueDate": "ISO 8601 ou descrição relativa" | null,
  "component": "...", "requestedBy": "...", "reason": "...",
  "description": "expansão contextual, não cópia da mensagem",
  "tags": [...], "actionRequired": "..." | null,
  "confidence": "high" | "medium" | "low",
  "rawMessage": "mensagem original sem alteração"
}
```

## Regras de extração que fazem o parser ser confiável

- **assignee**: nome mencionado → usa; pedido de voluntário ("alguém pode?") → `"[A DEFINIR]"` + `actionRequired` pedindo confirmação; ninguém mencionado → `null`. Nunca inventa.
- **dueDate**: inferência de expressão relativa ("antes do fim do mês" → `"[fim do mês corrente]"`), nunca data inventada.
- **description**: **expande**, não copia — para bugs, já lista pontos de investigação mais prováveis.
- **confidence**: implementa fallback de automação — `high` cria o card direto; `medium` pede confirmação no Slack; `low` não cria nada e pede pra reformular.

## Casos especiais

| Caso | Comportamento |
|---|---|
| Mensagem com ações para pessoas diferentes | array de cards, cada um com `"linkedMessage": "Gerado da mesma mensagem"` |
| Mensagem que é pergunta | `type: "question"`, **não** cria card, retorna `suggestedAction` aguardando confirmação |
| Mensagem sem contexto suficiente | `type: "unknown"`, `confidence: "low"`, pede detalhes |

## Contexto de domínio embutido no prompt

O system prompt carrega o glossário do RouteWise (módulos, stack: Teltonika FMB920, MQTT, AWS IoT Core, Firebase FCM...) para que o parser infira componente/impacto sem precisar que a mensagem detalhe tudo — o mesmo princípio do "Contexto de Projeto" do Requirements Copilot (Módulo 1), aplicado a mensagens curtas de Slack.

## Duas formas de implementar (sem código vs. com código)

| | Make.com (sem código) | Node.js |
|---|---|---|
| Setup | `../make-blueprint-m9.json` — importar blueprint pronto no cenário | `../ecosystem-bot-template.js` — Slack Bolt + Anthropic SDK + Jira REST API |
| Quando usar | Prototipagem rápida, PM sem dev disponível | Time técnico, controle total do fluxo |
| Guia completo | `../setup-guide-m9.md` (Opção A) | `../setup-guide-m9.md` (Opção B) |

**A "segunda direção" do ecossistema** — Jira → Slack quando um card muda de status — não precisa de IA nem de Make.com: é uma regra de automação nativa do Jira (`Item transicionado` → `Enviar mensagem do Slack`) com um Incoming Webhook.

## Problemas comuns documentados (vale a leitura antes de tentar rodar)

`not_in_channel` (bot não convidado), `401` no Jira (token expirado), JSON inválido no response (reforçar "retorne APENAS o JSON"), cota de automação do plano Free do Jira estourada. Se o setup não funcionar no tempo da aula, o material é explícito: **a atividade continua válida testando só o parsing no AI Studio**, sem integração — o objetivo é entender onde estão os pontos de atrito, não ter produção rodando.

## Caso RouteWise nesta aula

3 mensagens de teste: um bug de alertas não chegando em Uberlândia (confidence high, assignee null), um pedido de antecipação de manutenção preditiva com voluntário implícito ("Alguém pode pegar isso?" → `[A DEFINIR]`), e um blocker crítico de deploy com decisão binária a tomar até amanhã. O terceiro caso vira o gancho de ajuste de prompt na aula: o `actionRequired` veio `null` quando deveria estar preenchido — mais um exemplo de que **curadoria humana do output continua necessária**, tema que já apareceu no Módulo 6.
