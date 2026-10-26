# O que acontece de fato — passo a passo mecânico do Módulo 8

Este módulo mistura os dois mundos: a Parte 1 (checklist) é só chat, como quase todo o resto do curso; a Parte 2 (Danger.js) tem **código que roda de verdade**, com duas formas diferentes de rodar — uma local/mock, outra em produção com CI real.

---

## Parte 1 — Compliance Checklist: só chat

### Passo 1: Preencher o template com o evento e o contexto

Você preenche `compliance-checklist-prompt.md`: tipo de evento (deploy, mudança de escopo...), contexto do projeto, se há dado sensível.

### Passo 2: Enviar e ler os 14 itens (no máximo)

O modelo gera os Bloqueadores/Operacionais/Informativos como texto. Igual ao resto do curso: não existe verificação automática de que um item "passou" — é você quem confere cada critério manualmente contra a realidade do projeto antes do deploy.

---

## Parte 2 — Danger.js: aqui tem código rodando de verdade, de duas formas

### Forma A — Mock local em Python (roda sem internet, sem GitHub)

```bash
python danger-config-routewise.py --local                            # PR que passa
python danger-config-routewise.py --local --mock pr-mock-falhas.json  # PR que falha
```

**O que acontece de fato:** o interpretador Python roda de verdade, lê um arquivo JSON (`pr-mock-routewise.json` ou `pr-mock-falhas.json` — dados **inventados**, simulando um Pull Request), e executa as 5 regras (checar referência a card Jira, contar aprovadores, somar linhas alteradas, comparar cobertura de testes, medir tamanho da descrição) com lógica de programação normal — `if`, comparação de número, regex — sem nenhuma IA envolvida nessa parte. É um script de verificação de regras, ponto. O resultado impresso no terminal (PASSOU/FALHOU por regra) é 100% determinístico: rodar de novo com o mesmo JSON dá exatamente o mesmo resultado.

### Forma B — Dangerfile real, rodando em CI contra PRs verdadeiros

`danger-config-template.js` é escrito pra rodar dentro do **GitHub Actions**, disparado automaticamente toda vez que alguém abre ou atualiza um Pull Request de verdade no repositório. Isso exige:
1. O repositório ter o workflow do Danger.js configurado (`.github/workflows/ci.yml`).
2. Um `GITHUB_TOKEN` disponível no ambiente do CI.
3. Um PR real sendo aberto — o gatilho não é manual, é o evento do GitHub.

Quando isso roda, o Danger.js **lê de verdade** os dados do PR (via API do GitHub: quantos aprovadores, quantas linhas, qual arquivo mudou) e posta um comentário automático no próprio PR com o resultado — bloqueando o merge se alguma regra `fail()` disparar. Isso é automação real de CI/CD, sem IA envolvida na execução (a IA entrou só na Parte 3, escrevendo o arquivo).

### Forma C (bônus) — pedir pra IA escrever o Dangerfile do zero

`output-exemplo-dangerfile-m82.md` mostra um terceiro caminho: descrever as 5 regras em português pra IA e pedir que ela **escreva** o `dangerfile.js`. Isso volta a ser "só chat" — o modelo gera texto de código, mas não o executa. Alguém ainda precisa pegar esse código gerado e rodá-lo de verdade (Forma A ou B) pra saber se funciona.

---

## Tabela-resumo: o que é o quê

| Etapa | Parece que é | De fato é |
|---|---|---|
| Checklist de compliance | Uma verificação automática de conformidade | Texto gerado por IA — a checagem real de cada item é manual |
| `danger-config-routewise.py --local` | — | **Código real rodando**: Python lê um JSON mock e aplica 5 regras determinísticas, sem IA |
| `danger-config-template.js` em CI | — | **Automação real**: dispara sozinho a cada PR real, lê dados reais do GitHub, bloqueia merge de verdade |
| IA gerando um `dangerfile.js` | Um Dangerfile "pronto e testado" | Texto de código gerado por IA — ainda precisa ser executado (Forma A/B) pra validar se funciona |

## Por que isso importa

Este módulo separa bem as duas competências que a aula quer ensinar: **usar IA pra decidir o que checar** (Parte 1 — julgamento, não determinismo) e **usar código de verdade pra garantir que a checagem sempre aconteça igual** (Parte 2 — governança automatizada, onde você **não quer** que o resultado varie dependendo de como o modelo "interpretou" o PR daquele dia).
