# Meeting Digest Prompt — o framework do Módulo 6

System prompt completo: `../meeting-digest-prompt.md` (vai em System Instructions). A query — metadados + transcrição + análise solicitada — vai na mensagem do usuário: `../meeting-digest-query-m62.md`.

## Papel do modelo

Processar transcrição de reunião e gerar registro estruturado e acionável: ata, tabela de ações, decisões documentadas, JSON pronto pra importar no Jira.

## As 5 seções do output

1. **Resumo Executivo** (4–6 bullets, legível por quem não estava na reunião, sem jargão sem explicação).
2. **Tabela de Ações** — `ID | Ação | Responsável | Prazo | Prioridade | Observação`. Responsável e prazo não mencionados viram literalmente `[A DEFINIR]` — nunca inventados. Cada compromisso individual gera **linha separada**, mesmo que dois participantes assumam ações do mesmo tema.
3. **Decisões Registradas** — inclui decisões **implícitas**: quando um tópico foi levantado e ninguém discordou, é "acordo por omissão" e entra marcado `(implícita)`.
4. **Perguntas em Aberto** — o que foi levantado e não resolvido, quem deveria responder, se bloqueia alguma ação.
5. **JSON para importação no Jira** — um objeto por ação com responsável definido; `priority` segue regra fixa (`Highest` = bloqueador de sprint, `High` = prazo <48h, `Medium` = dentro do sprint, `Low` = sem urgência). Ações com `[A DEFINIR]` entram com `"assignee": null` e nota na `description`.

## Regras de comportamento

- Nunca inventa responsável, prazo ou informação ausente na transcrição.
- Erro óbvio de transcrição (nome trocado, termo técnico distorcido) → `[POSSÍVEL ERRO DE TRANSCRIÇÃO: xxx]`, nunca correção silenciosa.
- Tópico sem ação real associável ("vamos pensar sobre isso") → `[ACOMPANHAMENTO]`, não vira card.

## O ponto pedagógico central: curadoria humana ainda é obrigatória

O output de referência (`../output-digest-backup-sprint-review-m62.md`) documenta explicitamente **o que o modelo perdeu**, mesmo seguindo o prompt corretamente:

1. Uma **decisão técnica real** (ajuste de threshold de timeout para evitar falso positivo em área de sombra de GPS) foi mencionada por Marcus na transcrição, mas o modelo não a promoveu para "Decisões Registradas" — tratou o módulo como "estável" no resumo.
2. Uma **pergunta em aberto de alto impacto** (o sistema de RH tem API para integração futura?) não foi sinalizada, mesmo com a ambiguidade explícita na fala ("fase dois").

A lição: o Meeting Digest reduz o trabalho de ata de horas para minutos, mas **não substitui um PM revisando o output antes de distribuir** — sobretudo decisões técnicas embutidas em fala coloquial.

## Duas transcrições, dois papéis diferentes

| Arquivo | Papel |
|---|---|
| `../transcricao-sprint-review-s2.md` | Input **principal** da demo (o vídeo usa este) — output de referência em `output-digest-backup-sprint-review-m62.md` |
| `../sprint-review-s2-routewise.md` | Cenário **alternativo** para praticar, com mais participantes (inclui Ana Lima, RH) — números não batem 1:1 com o snapshot canônico do Módulo 5 |

## Caso RouteWise nesta aula

Sprint Review do Sprint 2 do RouteWise: Carlos, Marcus e (na variante) Ana Lima (RH) discutem o status de US-01 (Alertas de Velocidade, em piloto com 2 supervisores) e a integração futura do Painel de Motoristas com o sistema de RH. `../jira-estado-board.md`: estado **opcional** — Sprint 2 encerrado / Sprint 3 recém-iniciado.
