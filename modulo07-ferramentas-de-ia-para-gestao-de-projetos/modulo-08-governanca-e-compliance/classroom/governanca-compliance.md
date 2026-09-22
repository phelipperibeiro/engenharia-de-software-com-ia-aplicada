# Governança e Compliance — o framework do Módulo 8

Diferente dos módulos anteriores, este não tem `jira-estado-board.md` — a aula sai do fluxo de sprint e entra em **dois momentos de governança**: antes de deployar (checklist) e a cada Pull Request (Danger.js). Dois artefatos, dois prompts.

## Parte 1 — Compliance Checklist Prompt

Prompt completo: `../compliance-checklist-prompt.md`. Gera checklist **específico pro contexto**, nunca genérico, em 3 categorias:

| Categoria | Limite | Regra |
|---|---|---|
| **Bloqueadores** | máx. 5 itens | impede o evento se não estiver OK; cada item tem critério de "passou" objetivo (`"cobertura > 80% confirmada no CI"`, nunca `"testes passando"`) |
| **Verificações Operacionais** | máx. 5 itens | não bloqueiam, mas geram risco se ignoradas |
| **Informativos** | máx. 4 itens | registros obrigatórios de auditoria, não são checagem |

**Limite total: 14 itens.** O material justifica com um dado prático: checklists com mais de 15 itens têm taxa de conformidade próxima de zero em projetos reais — o time marca tudo como OK sem ler.

**Regra de dado sensível**: se há LGPD/GDPR envolvido, o checklist **obrigatoriamente** inclui um Bloqueador de consentimento e um Informativo de registro de tratamento (RoPA, Art. 37 LGPD).

## Parte 2 — Governança como Código (Danger.js)

Dois artefatos equivalentes, mesmas 5 regras:

- `../danger-config-template.js` — **Dangerfile real**, escrito à mão, pronto pra rodar em CI (GitHub Actions) contra PRs de verdade.
- `../danger-config-routewise.py` — mock em Python que **simula** as mesmas 5 regras offline, sem precisar de token/internet, usando `pr-mock-routewise.json` (PR que passa) ou `pr-mock-falhas.json` (PR que falha em tudo).

### As 5 regras

1. PR precisa referenciar um card Jira (`ROUTEWISE-\d+`) no título ou corpo.
2. Arquivos críticos (`src/integrations/gps`, `migrations/`, `.env`...) exigem ≥2 aprovadores.
3. PR com mais de 500 linhas alteradas → aviso (não bloqueia).
4. Queda de cobertura de testes > 5 pontos → aviso.
5. Descrição do PR com menos de 30 caracteres → aviso.

### Dois cenários prontos pra demo

```bash
python danger-config-routewise.py --local                              # PASSA em tudo
python danger-config-routewise.py --local --mock pr-mock-falhas.json    # FALHA em tudo
```

O cenário de falha simula: sem referência Jira, 1 aprovador só (precisa 2), 635 linhas alteradas, cobertura caindo 11,1 pontos, descrição de uma palavra.

### O output gerado por IA (variante 3)

`../output-exemplo-dangerfile-m82.md` mostra um terceiro caminho: pedir para a IA **gerar** o `dangerfile.js` a partir de 4 regras em linguagem natural — inclusive resolvendo sozinha um detalhe não trivial (Danger.js não calcula cobertura nativamente; precisa ler um relatório do CI) e documentando a integração necessária.

## Caso RouteWise nesta aula

O checklist de compliance é aplicado ao **deploy do módulo de Alertas de Velocidade** (dados de localização de motoristas = dado pessoal sensível sob LGPD), com o mesmo BUG-S4-10 dos módulos 5 e 7 como bloqueador técnico documentado (97 de 140 veículos cobertos na release inicial). O Dangerfile usa o prefixo `ROUTEWISE` e protege exatamente os caminhos críticos do projeto (`src/integrations/gps`, `src/services/notifications`).
