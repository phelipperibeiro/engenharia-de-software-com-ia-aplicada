# LangGraph nesta aula (01) — Multiple MCP Tools

Agente de **processamento de dados** em 2 nós: entender a pergunta → executar pipeline com várias tools.

---

## Fluxo do grafo

```
START → intentParser
              │
              ├── error → END
              └── ok → agent → END
```

Arquivo: `src/graph/graph.ts`

---

## Estado (`GraphAnnotation`)

| Campo | Quem preenche |
|-------|----------------|
| `messages` | Entrada + resposta final |
| `intent` | intentParser |
| `fileContent` | CSV/JSON extraído da pergunta |
| `fileName` | Inferido (default `data.{fileType}`) |
| `answer` | (opcional) |
| `error` | Falha em qualquer nó |

---

## Nó 1: intentParser

**Arquivo:** `intentNode.ts` + `prompts/v1/identifyIntent.ts`

1. Lê última mensagem do usuário
2. LLM + `IntentSchema` separa instrução vs dados
3. Retorna `intent`, `fileContent`, `fileName`

Exemplo de pergunta (como em `index.ts`):

```
Here is a CSV file called sales.csv.
What's the total revenue from this sales data?

<conteúdo CSV aqui>
```

---

## Nó 2: agent

**Arquivo:** `agentNode.ts` + `prompts/v1/agentNode.ts`

1. Monta user prompt com intent + fileName + fileContent
2. LLM **com todas as tools** (MCP + csv_to_json)
3. Segue steps 0–5 do system prompt
4. Retorna `AIMessage` com resposta final

Saídas tangíveis no disco:

- `./reports/total_revenue_report.txt`
- `./reports/top_5_products.txt`
- etc.

---

## Sem checkpointer

Grafo stateless — cada `POST /chat` é independente.

---

## API HTTP

`POST /chat`:

```json
{ "question": "string min 10 chars — pode incluir CSV inline" }
```

Resposta: string (`answer` ou última mensagem).

`index.ts` também dispara teste automático com `sales-complete.csv` após subir o server.

---

## Dados de exemplo

| Arquivo | Uso |
|---------|------|
| `data/sales.csv` | CSV menor |
| `data/sales-complete.csv` | CSV completo (teste default) |
| `products.json` | Produtos |
| `reports/*.txt` | Relatórios gerados pelo agent |

---

## Infra necessária

```bash
npm run docker:infra:up   # MongoDB + mongo-express
```

Sem MongoDB rodando, tools MongoDB MCP falham.

---

## Comparação com outras aulas

| | Mod 02 / safeguard | Mod 03 / aula 01 |
|---|-------------------|------------------|
| MCP count | 1 (filesystem) | 2 + tool local |
| Grafo | guardrails → chat | intent → agent |
| Objetivo | segurança | ETL + analytics |
| Domínio | arquivos admin | vendas CSV |

---

## Resumo em uma frase

**LangGraph separa extração de intenção (structured) da execução multi-tool (MCP) — pipeline CSV → MongoDB → relatório.**

Tools: **[mcp.md](./mcp.md)**
