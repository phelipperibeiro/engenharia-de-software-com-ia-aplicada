# Mapa mental — Módulo 07.06

```
Reuniões Turbinadas com IA
│
├── 🎯 Objetivo
│   └── Transcrição → ata estruturada + ações + decisões + JSON Jira
│
├── 📥 Input
│   ├── Metadados (título, data, duração, participantes/papéis)
│   └── Transcrição bruta
│
├── 📤 As 5 seções
│   ├── 1 Resumo Executivo (4-6 bullets, sem jargão)
│   ├── 2 Tabela de Ações (Responsável/Prazo → [A DEFINIR] se ausente)
│   ├── 3 Decisões (inclui implícitas — acordo por omissão)
│   ├── 4 Perguntas em Aberto
│   └── 5 JSON pra Jira (priority Highest/High/Medium/Low)
│
├── 🚫 Restrições
│   ├── Nunca inventa responsável/prazo
│   ├── Erro de transcrição → [POSSÍVEL ERRO], não corrige
│   ├── Sem ação real → [ACOMPANHAMENTO], não vira card
│   └── Ação por responsável = 1 linha, nunca agrupa
│
├── ⚠️ Curadoria humana ainda obrigatória (achado real)
│   ├── Modelo perdeu: decisão técnica (threshold GPS) em fala coloquial
│   ├── Modelo perdeu: pergunta em aberto (API do RH)
│   └── Reduz trabalho, não substitui revisão do PM
│
└── 🚚 RouteWise — Sprint Review S2
    ├── transcricao-sprint-review-s2.md (principal)
    ├── sprint-review-s2-routewise.md (variante c/ Ana Lima/RH)
    └── Board: Sprint 2 encerrado / Sprint 3 iniciado (opcional)
```

---

## Fluxo da aula

```
transcricao-sprint-review-s2.md    meeting-digest-prompt.md        output-digest-backup-sprint-review-m62.md
(input bruto)                ──►   (system prompt + query) ──►     (ata + JSON + notas de curadoria)
                                                                              │
                                                                              ▼
                                                            Módulo 9: mesmo padrão de card
                                                            generalizado (NL to Workflow)
```

## Conceito ↔ arquivo

| Conceito | Onde aparece |
|---|---|
| System prompt (5 seções) | `meeting-digest-prompt.md` |
| Query pronta pra demo | `meeting-digest-query-m62.md` |
| O que o modelo perdeu (curadoria) | `output-digest-backup-sprint-review-m62.md` |
| Cenário alternativo | `sprint-review-s2-routewise.md` |

---

## Glossário (para quem não é de projetos)

| Termo | O que significa |
|---|---|
| **Sprint Review** | Reunião no final do sprint onde o time mostra o que foi entregue e recebe feedback — diferente da Retrospectiva (que é sobre como o time trabalhou, não o que entregou). |
| **Ata** | Registro escrito do que foi discutido/decidido numa reunião. |
| **Decisão implícita** | Quando alguém propõe algo numa reunião e ninguém discorda — na prática, virou decisão do grupo mesmo sem votação formal ("acordo por omissão"). |
| **Card** (no Jira) | Um item de trabalho individual no board (pode ser uma User Story, Task, Bug etc.) — o "post-it" digital que se move entre colunas (A Fazer → Em Progresso → Pronto). |
| **Assignee** | A pessoa responsável por aquele card/tarefa. |
| **JSON** | Formato de dado estruturado (chave: valor) que sistemas conseguem ler diretamente, sem precisar "interpretar" texto solto — é o que permite importar automaticamente pro Jira. |
