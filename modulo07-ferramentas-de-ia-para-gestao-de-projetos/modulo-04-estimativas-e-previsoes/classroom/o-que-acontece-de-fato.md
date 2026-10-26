# O que acontece de fato — passo a passo mecânico do Módulo 4

Este módulo é diferente dos anteriores: ele tem **duas partes com mecânicas opostas**. A Parte 1 (PERT) é só chat, igual aos módulos anteriores. A Parte 2 (Monte Carlo) é **código de verdade rodando** — e o próprio material explica por que essa diferença é obrigatória, não estilística.

---

## Parte 1 — PERT: só chat, igual sempre

### Passo 1: Colar as histórias com O/M/P + fator de paralelismo

Você preenche o template de `probability-forecast-prompt.md` com as estimativas de três pontos por história e envia no AI Studio.

### Passo 2: O modelo "calcula" PERT em texto

A fórmula `(O + 4M + P) / 6` é simples o suficiente pro modelo acertar quase sempre, mas — igual nos módulos 2 e 3 — é geração de texto seguindo uma regra, não execução de fórmula. Vale conferir contas que vão virar compromisso.

---

## Parte 2 — Monte Carlo: aqui sim, código rodando de verdade

### Por que essa parte não pode ser prompt (explicado no próprio material)

> "LLMs não sorteiam números aleatórios — eles aproximam um resultado plausível com base em padrões de texto. Pedir 'simule 1000 cenários' produz um número que parece estatístico mas não é: não há distribuição real, não há aleatoriedade, não há garantia matemática."

Ou seja: se você pedisse pro Gemini "rode 10.000 simulações de Monte Carlo e me dê o P85", ele **inventaria** um número parecido com o que uma simulação real daria — sem ter, de fato, sorteado nada. Por isso essa etapa sai do chat e vira um programa.

### Passo 3: Escolher onde rodar — duas opções, ambas execução real

**Opção A — Python, no terminal:**
```bash
python monte-carlo-routewise.py
```
Isso executa de verdade: o interpretador Python lê o arquivo, roda a função `triangular()` **10.000 vezes** (uma por história em cada uma das 10.000 iterações do loop `for _ in range(N)`), usando `random.random()` do próprio Python pra gerar números pseudo-aleatórios reais — não gerados por um modelo de linguagem.

**Opção B — JavaScript, direto no navegador:**
1. Abrir qualquer aba do Chrome/Firefox.
2. Apertar `F12` → aba "Console".
3. Colar o script inteiro.
4. Apertar Enter.

Isso também é execução real — o motor JavaScript do próprio navegador (V8 no Chrome) interpreta e roda o código, usando `Math.random()` nativo.

### Passo 4: O que o script faz, de fato, em cada uma das 10.000 rodadas

1. Sorteia um valor aleatório dentro da distribuição triangular (O, M, P) pra cada história, usando a fórmula da inversa da CDF triangular (as linhas com `Math.sqrt`).
2. Soma o tempo da trilha de software e da trilha de hardware (que só começa a contar a partir da semana 9).
3. Guarda o `max()` das duas trilhas como o tempo total daquela rodada.

Depois das 10.000 rodadas, ordena a lista de resultados e lê os valores nas posições 50%, 85% e 95% da lista ordenada — isso **é** o P50/P85/P95, um cálculo estatístico de verdade, feito sobre dados gerados por aleatoriedade real do computador.

### Passo 5: Ler o resultado

O terminal (ou o Console do navegador) imprime 4 linhas com os percentis. Esse número — ao contrário de tudo no resto do módulo — tem garantia matemática: rodar de novo dá um resultado ligeiramente diferente (é aleatório), mas dentro da mesma faixa estatística, porque o mecanismo por trás é reprodutível e real.

---

## Tabela-resumo: o que é o quê

| Etapa | Parece que é | De fato é |
|---|---|---|
| PERT por história | Cálculo automático | Texto gerado seguindo a fórmula — plausível, mas sem garantia matemática |
| "Simular 1000 cenários" no prompt | Uma simulação estatística | **Não deve ser feito assim** — o modelo inventaria um número plausível, não sorteado de verdade |
| `python monte-carlo-routewise.py` | — | Código real rodando: 10.000 iterações de um loop, com números pseudo-aleatórios reais gerados pelo interpretador |
| Colar o `.js` no Console do navegador | — | Mesma coisa, mas executado pelo motor JS do próprio navegador, sem instalar nada |
| P50/P85/P95 | Um número "dado pela IA" | Estatística real calculada sobre uma lista de 10.000 resultados simulados |

## O porquê disso importa pro módulo inteiro

Este é o único módulo do curso, até aqui, onde a distinção "IA gera texto" vs. "programa executa de verdade" é o **próprio conteúdo da aula**, não um detalhe de bastidor. A regra prática que fica: números que vão virar compromisso com o cliente (como o P85) precisam vir de um mecanismo com garantia matemática — nunca de um LLM "fazendo de conta" que simulou.
