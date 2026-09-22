# Módulo 07.04 — resumo

## Contexto no curso

Quarta aula do Módulo 07. Usa o cronograma do Módulo 3 (com o blocker de hardware na semana 9) para responder uma pergunta que cronograma determinístico não responde bem: "qual a *probabilidade* de terminar até tal data?".

## Arquivos da aula

| Arquivo | Papel |
|---|---|
| `probability-forecast-prompt.md` | Prompt PERT (Parte 1) + explicação + scripts de Monte Carlo (Parte 2) |
| `monte-carlo-routewise.py` | Simulação real em Python (10.000 rodadas) |
| `monte-carlo-routewise.js` | Mesma simulação, para rodar no Console do navegador |
| `output-exemplo-forecast-m42.md` | Output de referência: PERT + comunicação por 4 audiências |
| `jira-estado-board.md` | Estado esperado do board: Sprint 1 ativa, story points visíveis |
| `Atividade - Módulo 4.pdf`, `Exemplo - Módulo 4.pdf` | Materiais complementares |

## Como rodar

1. Colar as 4 histórias (O/M/P) + fator de paralelismo no prompt PERT no AI Studio.
2. Comparar com `output-exemplo-forecast-m42.md`.
3. Rodar `monte-carlo-routewise.py` localmente (ou colar o `.js` no Console do Chrome/Firefox) para os percentis reais.

## Takeaways

1. **LLM não sorteia número aleatório de verdade** — Monte Carlo tem que ser script, não prompt. É a distinção mais importante da aula.
2. **PERT pondera o cenário mais provável 4×** — `(O + 4M + P) / 6` evita que um outlier otimista ou pessimista domine a estimativa.
3. **Pessimista raso é red flag** — se P < 1.5×M, o prompt questiona viés de otimismo em vez de aceitar o número.
4. **P85, não P50, é o número que você promete ao cliente** — P50 é "50% de chance de atrasar"; P85 é o compromisso defensável.
5. O modelo de duas trilhas (software desde semana 1, hardware desde semana 9) reaproveita exatamente o blocker desenhado no **Módulo 3**, e a data resultante alimenta o **Módulo 5** (risk monitor) e o marco citado no **Módulo 7** (status report).

## Onde olhar

O framework completo (PERT, por que Monte Carlo é script, e como o script funciona): [probability-forecast.md](./probability-forecast.md).
