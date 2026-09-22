# Probability Forecast — o framework do Módulo 4

Prompt completo: `../probability-forecast-prompt.md`. Esta aula tem **dois motores diferentes** dividindo o trabalho: a IA faz a interpretação (PERT + comunicação por audiência); um **script determinístico** faz a simulação estatística (Monte Carlo). Não são intercambiáveis.

## Parte 1 — PERT via IA

Input por história: três pontos em semanas — **O**timista, **M**ais provável, **P**essimista.

```
Estimativa PERT = (O + 4M + P) / 6
Variância = ((P - O) / 6)²
Desvio Padrão = √Variância
```

O prompt calcula PERT por história, soma o total do projeto, aplica o **fator de paralelismo** do time (`Elapsed time = Total PERT / Fator`), e sinaliza como "Alta Incerteza" qualquer história com desvio padrão > 30% da estimativa PERT.

Regra de comportamento importante: **se Pessimista < 1.5× Mais Provável, o prompt questiona se o pessimista está subestimado** (viés de otimismo é o erro mais comum em estimativa de três pontos).

### Comunicação por 4 audiências

O mesmo cálculo é traduzido para: time técnico (quais histórias têm maior variância, o que fazer — spike, PoC), gestor de produto (prazo a prometer e com qual confiança), executivo (prazo + risco em linguagem de negócio) e cliente (sem jargão).

## Parte 2 — Por que o Monte Carlo NÃO vai para o LLM

> LLMs não sorteiam números aleatórios — aproximam um resultado plausível com base em padrões de texto. Pedir "simule 1000 cenários" produz um número que *parece* estatístico mas não é: sem distribuição real, sem aleatoriedade, sem garantia matemática.

Por isso o P85/P95 que você apresenta ao cliente vem de um **script real** (`../monte-carlo-routewise.py` e `.js`, equivalentes), não do prompt.

### Como o script funciona

- **Distribuição triangular** (`O`, `M`, `P`) por história — sorteio via `random.random()` + fórmula da CDF inversa triangular.
- Modela **duas trilhas em paralelo**: software (desde a semana 1) e hardware (só a partir da **semana 9**, quando o IoT chega — mesmo blocker do Módulo 3).
- `N = 10.000` simulações; o total do projeto é `max(trilha_software, trilha_hardware)` em cada rodada.
- Devolve **P50** (cenário provável), **P85** (compromisso com cliente), **P95** (conservador).

```python
def triangular(o, m, p):
    u = random.random()
    fc = (m - o) / (p - o)
    if u < fc:
        return o + math.sqrt(u * (p - o) * (m - o))
    return p - math.sqrt((1 - u) * (p - o) * (p - m))
```

Roda em dois formatos: `monte-carlo-routewise.py` (local) ou colado direto no **Console do navegador** (`monte-carlo-routewise.js` — F12 → Console → colar → Enter), sem precisar instalar nada.

## Divisão de responsabilidade

| Tarefa | Quem faz | Por quê |
|---|---|---|
| Calcular PERT/variância por história | IA | Interpretação e comunicação, cálculo determinístico simples |
| Traduzir pra 4 audiências | IA | Linguagem natural, adaptação de tom |
| Gerar P50/P85/P95 (Monte Carlo) | **Script** (Python/JS) | Precisa de aleatoriedade real e distribuição matemática — LLM não tem isso |

## Caso RouteWise nesta aula

4 histórias com estimativa de três pontos: US-01 (2/3/5 sem), US-03 (3/4/6), US-04 (1/2/3, bloqueada por hardware), US-09 (2/3/5, bloqueada por hardware). O script simula a trilha de hardware começando na semana 9 (o mesmo blocker de 60 dias do Módulo 3) e devolve os percentis que aparecem em `../output-exemplo-forecast-m42.md`. `../jira-estado-board.md`: board com **Sprint 1 ativa e story points visíveis**.
