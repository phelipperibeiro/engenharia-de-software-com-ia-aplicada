# O que acontece de fato — passo a passo mecânico do Módulo 5

Apesar do nome "AIOps" soar como uma ferramenta de monitoramento automatizada, este módulo é **só chat** — igual aos módulos 1, 2, 3, 6, 7 e 10. Nada fica "monitorando" nada em tempo real.

---

## Passo a passo

### Passo 1: Você extrai as métricas do Jira manualmente

O prompt orienta onde buscar cada dado (`Reports → Control Chart` pro Lead Time, `Reports → Velocity Chart` pra velocity, etc.). **Isso é você olhando telas do Jira e copiando números** — não existe integração automática lendo o board em tempo real.

### Passo 2: Colar as métricas + contexto + limites de alerta no template

Você preenche `risk-monitor-prompt.md` com os números das últimas sprints (ou usa o `risk-monitor-data-exemplo.csv` já pronto, que é só um arquivo de dados — uma tabela, não um programa) e define os limites de alerta do seu projeto.

### Passo 3: O modelo "avalia" o cockpit — em texto, seguindo as regras do prompt

Quando o output classifica um componente como 🔴 Vermelho, isso não é o resultado de um sistema de alerta automatizado comparando número contra threshold com lógica de programação (`if lead_time > limite: alerta = "vermelho"`). É o modelo **lendo os números que você deu e decidindo, por linguagem, que padrão eles formam** — seguindo a instrução "não declare anomalia com um único ponto de dado, exija tendência de 2+ sprints".

Isso costuma funcionar bem porque a regra é simples e os dados são claros, mas — assim como o RICE/WSJF do Módulo 2 — não tem a garantia de um sistema de alerta de infraestrutura real (tipo Datadog ou Grafana, que comparam número com threshold via código determinístico).

### Passo 4: Ler o diagnóstico, o plano de mitigação e a projeção

Tudo isso é texto de resposta de chat. Nenhuma ação é tomada automaticamente no Jira — não existe um bot movendo cards, criando alertas ou enviando notificação. A leitura e a decisão são humanas.

---

## Tabela-resumo: o que é o quê

| Etapa | Parece que é | De fato é |
|---|---|---|
| "AIOps" no nome do módulo | Um sistema de monitoramento automatizado | Um prompt que interpreta métricas que você extraiu manualmente do Jira |
| Cockpit 🟢/🟡/🔴 | Alerta automático baseado em regra de código | Classificação em texto, gerada pelo modelo lendo os números que você forneceu |
| Extração de Lead Time/Cycle Time/Velocity | Integração automática com o Jira | Você olhando os Reports do Jira na tela e copiando os números |
| Plano de mitigação | Ação disparada automaticamente | Texto de sugestão — a execução do plano é sempre humana |

## Por que isso importa

Comparado ao AIOps de infraestrutura de verdade (que monitora servidores 24/7 com scripts e thresholds automáticos), este é um **assistente de leitura de métricas sob demanda**: você traz os dados, o modelo ajuda a interpretar o padrão e sugerir causa/ação — mas o "sensor" que capta o dado é você, não um sistema automatizado.
