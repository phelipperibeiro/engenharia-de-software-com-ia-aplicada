# Módulo 07.01 — resumo

## Contexto no curso

Primeira aula do Módulo 07 (Ferramentas de IA para Gestão de Projetos). Abre o caso fio-condutor de todo o módulo: **RouteWise**, sistema de gestão de frota (140 veículos) de uma transportadora fictícia. Toda aula seguinte (priorização, cronograma, forecast, riscos, reuniões, status reports, governança, automação, OKRs) reaproveita os mesmos dados e o mesmo backlog criado aqui.

## O que você está construindo

Um **Requirements Copilot**: um Gem/system prompt no Google AI Studio que converte transcrição de discovery em requisitos estruturados — User Stories com INVEST, critérios de aceite em Gherkin, épicos com complexidade estimada, e cards prontos para colar no Jira.

```
transcricao-discovery-routewise.md → Requirements Copilot (system prompt) → output-demo-m1.2-v1.0.md → routewise-jira-import.csv → Jira
```

## Arquivos da aula

| Arquivo | Papel |
|---|---|
| `requirements-copilot-system-prompt.md` | O prompt (v1.2) — cole em System Instructions |
| `nota-adaptacao-modelos.md` | Como adaptar para Claude/ChatGPT/Azure/Ollama |
| `transcricao-discovery-routewise.md` | Input: reunião fictícia com Carlos (Diretor de Operações) |
| `output-demo-m1.2-v1.0.md` | Output de referência (as 9 seções aplicadas ao caso) |
| `exemplo-diagrama-mermaid.md` | O diagrama de fluxo isolado, com nó `[?]` de ambiguidade |
| `guia-board-routewise.md` | Guia mestre: como importar o CSV no Jira + estado do board por módulo (referenciado o módulo inteiro) |
| `routewise-jira-import.csv` | Backlog estruturado pronto para import |
| `jira-estado-board.md` | Checklist: como o board deve estar configurado para esta aula |
| `Atividade - Módulo 1.pdf`, `Exemplo - Módulo 1.pdf`, `Como Importar o Backlog no Jira - Módulo 1.pdf` | Materiais complementares em PDF |

## Como rodar

1. Copiar `requirements-copilot-system-prompt.md` em System Instructions no AI Studio.
2. Colar `transcricao-discovery-routewise.md` como input do usuário.
3. Comparar o output com `output-demo-m1.2-v1.0.md`.
4. Importar `routewise-jira-import.csv` no Jira seguindo `guia-board-routewise.md`.

## Takeaways

1. **O modelo não é transcrevedor, é analista**: precisa capturar o implícito e sinalizar o que falta — não só repetir o que foi dito.
2. **Nunca inventar número**: qualquer SLA/latência/volume não declarado vira `[A CONFIRMAR COM STAKEHOLDER]`, nunca um valor chutado.
3. **INVEST bloqueia histórias ruins antes do Jira**: uma história que falha em "Small" ou "Estimable" não devia virar card ainda — vira `[BLOQUEADA: motivo]`.
4. **Gold plating é proibido por design**: toda linha do output precisa ter correspondência direta com o input — o que não tem, é sinalizado e removido.
5. Este é o **ponto de partida** de todo o módulo 07 — o backlog e os dados do RouteWise reaparecem, evoluindo, em todas as aulas seguintes.

## Onde olhar

O framework completo (modos, INVEST, Gherkin, anti-padrões, protocolo de ambiguidade, as 9 seções): [requirements-copilot.md](./requirements-copilot.md).
