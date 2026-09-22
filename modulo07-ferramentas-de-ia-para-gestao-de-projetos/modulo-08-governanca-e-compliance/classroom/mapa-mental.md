# Mapa mental — Módulo 07.08

```
Governança e Compliance
│
├── 🎯 Objetivo
│   └── Deploy/PR seguro por checklist + automação, não por memória
│
├── ✅ Parte 1 — Compliance Checklist Prompt
│   ├── Bloqueadores (máx. 5) — critério objetivo de "passou"
│   ├── Verificações Operacionais (máx. 5) — geram risco, não bloqueiam
│   ├── Informativos (máx. 4) — registro de auditoria
│   ├── Limite total: 14 itens (acima disso, ninguém lê)
│   └── LGPD/GDPR → Bloqueador de consentimento obrigatório
│
├── 🤖 Parte 2 — Governança como código (Danger.js)
│   ├── 5 regras:
│   │   ├── PR referencia card Jira
│   │   ├── Arquivo crítico → ≥2 aprovadores
│   │   ├── PR >500 linhas → aviso
│   │   ├── Cobertura caiu >5pts → aviso
│   │   └── Descrição <30 chars → aviso
│   ├── danger-config-template.js (real, CI)
│   ├── danger-config-routewise.py (mock offline)
│   │   ├── --local → PR passa
│   │   └── --mock pr-mock-falhas.json → PR falha em tudo
│   └── output-exemplo-dangerfile-m82.md (dangerfile gerado por IA)
│
└── 🚚 RouteWise
    ├── Deploy do módulo de Alertas de Velocidade (LGPD: localização)
    ├── BUG-S4-10 documentado como bloqueador conhecido
    └── Prefixo Jira: ROUTEWISE-NNN
```

---

## Fluxo da aula

```
compliance-checklist-prompt.md         danger-config-template.js/.py          pr-mock-*.json
(checklist go/no-go pro deploy)  ──►    (regras automáticas de PR)      ──►    (cenário passa/falha)
```

## Conceito ↔ arquivo

| Conceito | Onde aparece |
|---|---|
| Checklist 3 categorias | `compliance-checklist-prompt.md` |
| Dangerfile real (CI) | `danger-config-template.js` |
| Mock offline (2 cenários) | `danger-config-routewise.py` + `pr-mock-*.json` |
| Dangerfile gerado por IA | `output-exemplo-dangerfile-m82.md` |

---

## Glossário (para quem não é de projetos)

| Termo | O que significa |
|---|---|
| **PR** (Pull Request / Merge Request) | Proposta de um dev pra incorporar seu código no projeto principal — passa por revisão antes de ser aceita. |
| **CI/CD** (Continuous Integration / Continuous Delivery) | Automação que testa e prepara o código pra entrega toda vez que alguém propõe uma mudança, sem depender de um humano rodar isso manualmente. |
| **Danger.js / Dangerfile** | Ferramenta que roda regras automáticas em cada PR (ex: "tem card do Jira vinculado?", "tem aprovadores suficientes?") e bloqueia ou avisa antes do merge. |
| **Cobertura de testes (coverage)** | Percentual do código que é verificado por testes automatizados — cair muito de uma versão pra outra é sinal de código novo sem teste. |
| **LGPD** | Lei Geral de Proteção de Dados (Brasil) — regula como dados pessoais (inclusive localização de pessoas) podem ser coletados e usados. |
| **RoPA** (Record of Processing Activities) | Registro obrigatório (Art. 37 da LGPD) documentando quais dados pessoais são tratados, com qual finalidade. |
| **Go/No-Go** | Decisão binária de "podemos prosseguir com o deploy/lançamento ou não" — normalmente batendo um checklist de bloqueadores. |
