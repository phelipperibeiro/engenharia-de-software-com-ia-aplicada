# Módulo 07.08 — resumo

## Contexto no curso

Oitava aula do Módulo 07. Sai do ciclo de sprint (backlog → cronograma → risco → comunicação) e entra em **governança**: como garantir que um deploy ou um PR não vira passivo jurídico ou técnico silencioso.

## Arquivos da aula

| Arquivo | Papel |
|---|---|
| `compliance-checklist-prompt.md` | Template de checklist (Bloqueadores/Operacionais/Informativos) + exemplo RouteWise |
| `output-exemplo-compliance-m82.md` | Backup do checklist gerado |
| `danger-config-template.js` | Dangerfile real (JS), pronto pra CI/GitHub Actions |
| `danger-config-routewise.py` | Mesmas 5 regras, mock offline em Python |
| `pr-mock-routewise.json` / `pr-mock-falhas.json` | PR que passa / PR que falha em tudo |
| `output-exemplo-dangerfile-m82.md` | Dangerfile **gerado por IA** a partir de 4 regras em linguagem natural |
| `Atividade - Módulo 8.pdf`, `Exemplo - Módulo 8.pdf` | Materiais complementares |

Não há `jira-estado-board.md` nesta aula — o foco é PR e deploy, não sprint.

## Como rodar

1. Checklist: colar tipo de evento + contexto do projeto no template, comparar com `output-exemplo-compliance-m82.md`.
2. Danger.js: `python danger-config-routewise.py --local` (passa) e `--mock pr-mock-falhas.json` (falha) para ver as 5 regras em ação sem precisar de GitHub.
3. Opcional: pedir pra IA gerar um `dangerfile.js` do zero a partir de regras em prosa e comparar com `output-exemplo-dangerfile-m82.md`.

## Takeaways

1. **14 itens é o teto prático de um checklist que alguém realmente lê** — acima disso, a taxa de conformidade real cai a zero.
2. **Bloqueador precisa de critério objetivo, não intenção** — "cobertura > 80% confirmada no CI" é válido; "testes passando" não é.
3. **Dado sensível (LGPD) sempre gera Bloqueador de consentimento** — não é opcional, é regra fixa do prompt.
4. **Governança como código roda sem esperar humano** — Danger.js bloqueia merge automaticamente quando arquivo crítico não tem 2 aprovadores.
5. Este módulo fecha o ciclo iniciado no risco (Módulo 5): o mesmo BUG-S4-10 que gerou alerta vermelho ali agora vira item documentado no checklist de deploy.

## Onde olhar

O framework completo (checklist + Danger.js/Python + geração por IA): [governanca-compliance.md](./governanca-compliance.md).
