# Aula 02 — Google Trends Agent

## Contexto no curso

Segunda pasta do **Módulo 03**. Depois de múltiplos MCPs (aula 01), você aprende a **transformar um serviço externo (SerpAPI) em LangChain tool** e orquestrar pesquisa + resposta com LangGraph.

> Material: **[tools.md](./tools.md)** · **[mcp.md](./mcp.md)** · **[langgraph.md](./langgraph.md)** · **[openrouter.md](./openrouter.md)**

---

## O que você está estudando

Agente para **criadores de vídeo** que analisa se um título/tema está em alta no Google Trends e devolve recomendações em linguagem natural.

**Caso de uso:** _"Estou pensando em criar um vídeo sobre Web AI, quais títulos você recomendaria?"_

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| HTTP | Fastify (`POST /chat`) |
| Orquestração | LangGraph (2 nós) |
| LLM | OpenRouter via `ChatOpenAI` + `createAgent` |
| Tools | MCP filesystem + `google_trends` (SerpAPI) |
| Dados trends | SerpAPI `google_trends` engine |
| Validação | Zod (schemas preparados, tool schemas ativos) |

---

## Arquitetura em 4 camadas

```
POST /chat
    |
    v
LangGraph (researcher → responder)
    |
    v
OpenRouterService.createAgent
    |
    +-- google_trends tool → SerpAPIService → SerpAPI
    +-- MCP filesystem tools
```

---

## Fluxo completo

1. Usuário envia `question` (≥ 10 caracteres)
2. **researcher:** LLM extrai 2 keywords → chama `google_trends` 1x
3. Resultado vira `trendsData` (texto) + `question` no state
4. **responder:** LLM analisa trends + pergunta → `AIMessage` final
5. API retorna texto da resposta

---

## Arquivos principais

| Arquivo | Papel |
|---------|-------|
| `src/server.ts` | Fastify + endpoint `/chat` |
| `src/graph/graph.ts` | Definição do grafo |
| `src/graph/nodes/researcherNode.ts` | Pesquisa com tools |
| `src/graph/nodes/responderNode.ts` | Síntese para usuário |
| `src/services/mcpService.ts` | Agrega MCP + tool nativa |
| `src/tools/googleTrendsTool.ts` | Wrapper SerpAPI → tool |
| `src/services/serpApiService.ts` | Cliente SerpAPI + parse |
| `src/services/openRouterService.ts` | LLM + createAgent |
| `src/prompts/v1/keywords.ts` | Prompt researcher |
| `src/prompts/v1/videoTrends.ts` | Prompt responder |
| `data/trendingData.ts` | Fixtures (dev sem API) |

---

## Comandos

```bash
npm install
cp .env.example .env   # OPENROUTER + SERPAPI keys

npm run dev            # porta 3000 + smoke test inject
npm run langgraph:serve  # LangGraph Studio
```

### Testar manualmente

```bash
curl -X POST http://localhost:3000/chat \
  -H 'Content-Type: application/json' \
  -d '{"question": "Estou pensando em criar um video sobre Web AI, quais titulos você me recomendaria?"}'
```

### Modo fixture (sem SerpAPI)

Em `src/config.ts`: `serpAPIConfig.disabled: true`

---

## Comparação com aula 01

| | Aula 01 | Aula 02 |
|---|---------|---------|
| MCPs | filesystem + MongoDB | só filesystem |
| Tool nativa | csv_to_json | **google_trends** |
| Grafo | intent + agent | **researcher + responder** |
| Domínio | ETL vendas | **estratégia de conteúdo** |
| Foco | multi-MCP | **service → tool** |

---

## Takeaways

1. **Service → tool** — padrão reutilizável para qualquer API legada
2. **Lista híbrida** — MCP genérico + tool de domínio na mesma lista
3. **2 nós** — separar pesquisa (tools) de síntese (resposta)
4. **Prompts em arquivo** — keywords vs videoTrends especializados
5. **Fixture mode** — desenvolver sem gastar créditos SerpAPI
6. **createAgent** — tool calling quando precisa agir; structured quando precisa formato fixo

---

## Próximos passos

- Ativar `KeywordsSchema` / `VideoTrendsSchema` nos nós (structured output)
- Adicionar nó que salva relatório via MCP filesystem
- Comparar com [06 legacy API as MCP](../06-your-legacy-api-as-mcp/) — MCP vs tool nativa para APIs legadas

---

## Evolução Módulo 03

| Aula | Tema |
|------|------|
| 01 | Multiple MCP tools |
| **02** | **Services → tools (Google Trends)** |
| 03 | Custom agents |
| 04 | Skills |
| 05 | MCP do zero |
