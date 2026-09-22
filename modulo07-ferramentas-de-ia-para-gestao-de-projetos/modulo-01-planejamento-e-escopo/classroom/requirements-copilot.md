# Requirements Copilot — o framework do Módulo 1

Prompt completo: `../requirements-copilot-system-prompt.md` (v1.2, para colar em "System Instructions" no Google AI Studio/Gemini). Adaptação para Claude/ChatGPT/Azure/Ollama: `../nota-adaptacao-modelos.md`.

## O papel que o prompt define

Não é "transcrever a reunião" — é analisar: capturar o que foi dito **e** o que foi implicado, sinalizar ambiguidade, e produzir artefatos que QA consiga usar sem voltar ao stakeholder.

## Dois modos

| Modo | Quando usar | Entrega |
|------|-------------|---------|
| **Completo** (padrão) | Refinar e importar pro Jira | 9 seções |
| **Rápido** (`"modo rápido"` antes do input) | Validação em reunião, input preliminar | Só User Stories + Perguntas em Aberto + Cards Jira |

## Frameworks obrigatórios aplicados

1. **User Story**: "Como [papel específico], quero [capacidade], para que [resultado mensurável]." — papel nunca genérico ("usuário"), sempre específico ("operador de despacho").
2. **INVEST**: valida cada história (Independent/Negotiable/Valuable/Estimable/Small/Testable); falha gera `[INVEST-FAIL: critério]` e a história **não vira card**.
3. **Gherkin**: mínimo happy path + edge case por história; "Então" precisa ser verificável por automação (proibido "corretamente", "adequadamente").
4. **WBS**: Épico (2–8 semanas) → Feature → User Story (≤8 SP) → Task, com complexidade P/M/G/GG justificada.

## Anti-padrões que o prompt detecta automaticamente

| Anti-padrão | Exemplo | Ação |
|---|---|---|
| Voz passiva sem sujeito | "o sistema deve ser validado" | pedir quem faz o quê |
| Resultado não verificável | "deve ser intuitivo" | pedir métrica |
| Escopo implicitamente infinito | "suportar todos os tipos de arquivo" | pedir lista fechada |
| Requisito duplo (AND) | "monitorar velocidade E gerar relatórios" | decompor em duas histórias |
| Dependência circular | A depende de B e B depende de A | identificar pré-requisito real |

## Protocolo de ambiguidade — a regra mais importante do módulo

> Nunca invente especificações. Marque com `[AMBIGUIDADE]`, complete só o que for razoável explicitando a suposição, e adicione pergunta numerada em "Perguntas em Aberto".

Termos que **sempre** disparam isso: desempenho ("tempo real", "rápido"), escala ("muitos usuários"), segurança ("seguro"), integração ("conectar com X"), aprovação ("validado pelo gestor"). Nunca um número é inventado — vira `[A CONFIRMAR COM STAKEHOLDER]`.

## As 9 seções do output

1. Mapa de Domínios (com confiança Alta/Média/Baixa)
2. Mapa de Stakeholders (com `[CONFLITO]` entre posições divergentes)
3. Estrutura de Épicos
4. User Stories (card + INVEST + Gherkin + dependências + notas técnicas)
5. Perguntas em Aberto
6. Flags de Risco — 4 categorias: `[ESPECIFICAÇÃO INVENTADA]`, `[DEPENDÊNCIA NÃO MAPEADA]`, `[VIABILIDADE TÉCNICA SILENCIOSA]`, `[GOLD PLATING]`
7. Cards prontos para Jira (só para histórias que passaram no INVEST)
8. Dependências não declaradas
9. Diagrama de fluxo (Mermaid, `flowchart TD`, máx. 10 nós)

## O caso RouteWise (entra aqui, atravessa o módulo 07 inteiro)

`../transcricao-discovery-routewise.md`: reunião fictícia de 35min — Carlos (Diretor de Operações de uma transportadora de 140 veículos) descreve as dores: rastreamento manual, multas por excesso de velocidade, GPS que perde sinal, dashboard manual em Excel, dúvida sobre LGPD em dados de localização.

`../output-demo-m1.2-v1.0.md` é o output real gerado ao aplicar o prompt a essa transcrição: 5 domínios, 5 stakeholders (com 1 conflito), 3 épicos, 3 User Stories detalhadas — **US01 e US03 falham no INVEST** (Small/Estimable) e por isso não geram card direto. O diagrama Mermaid gerado está isolado em `../exemplo-diagrama-mermaid.md`, com um nó `[?]` sinalizando dependência não confirmada — exemplo concreto do protocolo de ambiguidade em ação.

`../routewise-jira-import.csv` é o backlog já estruturado (épicos `[EPIC] Segurança e Redução de Sinistros` / `[EPIC] Manutenção Inteligente` com OKRs no campo Description) pronto para importar no Jira — ponto de partida usado por **todos os módulos seguintes** do 07. `../guia-board-routewise.md` é o guia mestre (import + estado esperado do board por módulo + scripts de automação via API) referenciado por todas as outras pastas do módulo.
