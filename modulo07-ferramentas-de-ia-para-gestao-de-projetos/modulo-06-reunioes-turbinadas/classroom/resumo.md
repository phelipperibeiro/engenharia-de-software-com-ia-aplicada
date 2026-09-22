# Módulo 07.06 — resumo

## Contexto no curso

Sexta aula do Módulo 07. Muda de foco: em vez de dados estruturados (backlog, métricas), o input agora é uma **transcrição de reunião** em linguagem natural — a mesma classe de artefato do Módulo 1, mas aplicada a um Sprint Review em vez de um discovery inicial.

## Arquivos da aula

| Arquivo | Papel |
|---|---|
| `meeting-digest-prompt.md` | System prompt: resumo, ações, decisões, perguntas, JSON |
| `meeting-digest-query-m62.md` | Query pronta (metadados + transcrição + análise) para a demo ao vivo |
| `transcricao-sprint-review-s2.md` | Transcrição principal (Sprint Review S2, ~28min) |
| `sprint-review-s2-routewise.md` | Variante opcional, mais participantes, para praticar |
| `output-digest-backup-sprint-review-m62.md` | Output de referência **+ notas de curadoria** (o que revisar, o que o modelo perdeu) |
| `jira-estado-board.md` | Estado opcional do board: Sprint 2 encerrado / Sprint 3 iniciado |
| `Atividade - Módulo 6.pdf`, `Exemplo - Módulo 6.pdf` | Materiais complementares |

## Como rodar

1. Colar o system prompt em System Instructions.
2. Usar `meeting-digest-query-m62.md` como mensagem do usuário (metadados + transcrição já preenchidos).
3. Comparar com `output-digest-backup-sprint-review-m62.md`, prestando atenção especial às "Notas de Curadoria" no final.

## Takeaways

1. **Nunca inventar responsável ou prazo** — vira `[A DEFINIR]`, é a mesma disciplina do protocolo de ambiguidade do Módulo 1.
2. **Decisão implícita (acordo por omissão) também é decisão** — tópico levantado sem objeção entra como `(implícita)`.
3. **Cada compromisso é uma linha, nunca agrupado** — mesmo que dois responsáveis tratem do mesmo tema.
4. **O modelo erra por omissão, não por invenção** — no exemplo real, ele deixou passar uma decisão técnica (ajuste de threshold) e uma pergunta em aberto (API do RH) que estavam na fala, mas em linguagem coloquial. Curadoria humana continua obrigatória.
5. O JSON gerado aqui é o mesmo padrão de "ação estruturada pronta pro Jira" que reaparece, generalizado para qualquer mensagem (não só reunião), no **Módulo 9** (NL to Workflow).

## Onde olhar

O framework completo (5 seções, regras, e o ponto de curadoria humana): [meeting-digest.md](./meeting-digest.md).
