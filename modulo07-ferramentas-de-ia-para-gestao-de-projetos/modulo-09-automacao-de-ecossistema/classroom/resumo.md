# Módulo 07.09 — resumo

## Contexto no curso

Nona aula do Módulo 07. Generaliza o padrão "mensagem em linguagem natural → card estruturado" do Módulo 6 (que era específico para atas de reunião) para **qualquer mensagem de Slack**, e conecta isso a uma automação de verdade (Make.com ou bot Node.js) em vez de só um output que o PM cola manualmente.

## Arquivos da aula

| Arquivo | Papel |
|---|---|
| `nl-to-workflow-prompt.md` | System prompt do parser + 3 mensagens de teste com output esperado |
| `output-exemplo-nlworkflow-m92.md` | Backup do output das 3 mensagens |
| `setup-guide-m9.md` | Guia completo: Make.com (sem código), Node.js, e a direção reversa Jira→Slack |
| `ecosystem-bot-template.js` | Bot Node.js (Slack Bolt + Anthropic SDK + Jira API) |
| `make-blueprint-m9.json` | Blueprint pronto para importar no Make.com |
| `Atividade - Módulo 9.pdf`, `Exemplo - Módulo 9.pdf` | Materiais complementares |

Não há `jira-estado-board.md` — o foco é integração Slack↔Jira, não estado de sprint.

## Como rodar

1. Testar o parser isoladamente no AI Studio com as 3 mensagens de `nl-to-workflow-prompt.md`.
2. Escolher a via de integração: Make.com (importar `make-blueprint-m9.json`) ou Node.js (`ecosystem-bot-template.js`).
3. Configurar a direção reversa (Jira → Slack) via regra de automação nativa do Jira, sem código.

## Takeaways

1. **Parser puro retorna só JSON, nunca prosa** — é a diferença entre um output que humano lê e um que outro sistema consegue processar direto.
2. **`confidence` implementa fallback de automação** — high cria card automático, medium pede confirmação, low não cria nada.
3. **Voluntário implícito vira `[A DEFINIR]`, nunca um nome chutado** — mesma disciplina de não inventar responsável do Módulo 6.
4. **A automação mais simples (Jira→Slack) não usa IA nem código** — é regra nativa do Jira; nem tudo em "automação de ecossistema" precisa de LLM.
5. **Setup que falha ainda é aula válida** — o objetivo didático é mapear onde a integração quebra, não necessariamente ter produção rodando no tempo de uma aula.

## Onde olhar

O framework completo (schema, regras de extração, casos especiais, duas formas de implementar): [nl-to-workflow.md](./nl-to-workflow.md).
