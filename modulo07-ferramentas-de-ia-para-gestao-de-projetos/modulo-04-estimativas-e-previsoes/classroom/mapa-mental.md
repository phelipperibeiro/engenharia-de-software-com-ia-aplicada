# Mapa mental — Módulo 07.04

```
Estimativas e Previsões Probabilísticas
│
├── 🎯 Objetivo
│   └── Prazo defensável (P50/P85/P95), não uma data única "na confiança"
│
├── 🤖 Parte 1 — PERT via IA
│   ├── Input: O / M / P (semanas) por história
│   ├── PERT = (O + 4M + P) / 6
│   ├── Variância = ((P-O)/6)²
│   ├── Alta Incerteza se DP > 30% do PERT
│   ├── Questiona se P < 1.5×M (viés de otimismo)
│   └── Comunicação: técnico / produto / executivo / cliente
│
├── 🚫 Por que Monte Carlo NÃO vai pro LLM
│   ├── LLM aproxima texto plausível, não sorteia número real
│   ├── "Simule 1000 cenários" no prompt = número inventado
│   └── P85 pro cliente precisa de garantia matemática
│
├── 🎲 Parte 2 — Monte Carlo real (script)
│   ├── Distribuição triangular (O,M,P) por história
│   ├── N = 10.000 simulações
│   ├── Trilha Software (semana 1) + Trilha Hardware (semana 9)
│   ├── Total = max(trilha_sw, trilha_hw)
│   └── P50 / P85 / P95 / Média
│   └── roda em Python OU Console do browser (F12)
│
└── 🚚 RouteWise
    ├── US-01 (2/3/5), US-03 (3/4/6)
    ├── US-04 (1/2/3) e US-09 (2/3/5) — bloqueadas por hardware (sem. 9)
    └── Board: Sprint 1 ativa, story points visíveis
```

---

## Fluxo da aula

```
Módulo 3 (cronograma,          probability-forecast-prompt.md      monte-carlo-routewise.py/.js
blocker semana 9)      ──►     (PERT + 4 audiências)         ──►   (10.000 simulações reais)
                                                                            │
                                                                            ▼
                                                            P50/P85/P95 → Módulo 5 (risk monitor)
```

## Conceito ↔ arquivo

| Conceito | Onde aparece |
|---|---|
| Cálculo PERT + 4 audiências | `probability-forecast-prompt.md` |
| Por que não pedir Monte Carlo ao LLM | `probability-forecast-prompt.md` |
| Simulação real | `monte-carlo-routewise.py`, `monte-carlo-routewise.js` |
| Output de referência | `output-exemplo-forecast-m42.md` |

---

## Glossário (para quem não é de projetos)

| Termo | O que significa |
|---|---|
| **Estimativa de três pontos (O/M/P)** | Em vez de um único número, estima-se 3 cenários: **O**timista (tudo dá certo), **M**ais provável (cenário esperado), **P**essimista (algo deu errado, mas nada catastrófico). |
| **PERT** | Fórmula que pondera os três pontos, dando peso 4x maior pro "mais provável": `(O + 4M + P) / 6`. Usada há décadas em gestão de projetos (veio da NASA/Marinha americana nos anos 1950). |
| **Variância / Desvio Padrão** | Medidas estatísticas de "quanto os números variam" — quanto maior, mais incerta é a estimativa daquele item. |
| **Monte Carlo** | Técnica de simulação que roda um cenário milhares de vezes com valores aleatórios (dentro de uma distribuição), pra descobrir a **probabilidade** de cada resultado possível — em vez de um número único e "na confiança". |
| **Distribuição triangular** | O formato de "curva de probabilidade" usado aqui: os valores entre O e P são possíveis, mas M é o mais provável (pico do triângulo). |
| **P50 / P85 / P95 (percentil)** | "Em X% das simulações, o projeto terminou até esta data." P50 = 50% de chance de atrasar (é o "meio do caminho"); P85 é o número mais seguro pra prometer a um cliente; P95 é o cenário conservador. |
| **Paralelismo (fator)** | O quanto o time consegue trabalhar em histórias diferentes ao mesmo tempo, reduzindo o tempo total (versus fazer tudo em sequência). |
