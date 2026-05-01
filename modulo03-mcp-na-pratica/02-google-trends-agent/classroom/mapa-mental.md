# Mapa mental — Google Trends Agent (Aula 02)

## Visão em árvore

```
Google Trends Agent (Aula 02)
│
├── Objetivo
│   ├── Service → LangChain tool
│   ├── MCP + tool nativa híbrida
│   └── LangGraph researcher → responder
│
├── API
│   ├── Fastify :3000
│   └── POST /chat { question }
│
├── LangGraph
│   ├── researcher (tool calling)
│   └── responder (síntese AIMessage)
│
├── Tools
│   ├── google_trends (SerpAPI)
│   └── MCP filesystem (stdio)
│
├── Serviços
│   ├── SerpAPIService (parse trends)
│   ├── mcpService (agrega tools)
│   └── OpenRouterService (createAgent)
│
├── Prompts
│   ├── keywords.ts (researcher)
│   └── videoTrends.ts (responder)
│
├── Config
│   ├── OPENROUTER_API_KEY
│   ├── SERPAPI_API_KEY
│   └── serpAPIConfig.disabled → fixture
│
└── Dados
    └── data/trendingData.ts
```

---

## Fluxo end-to-end

```
  Usuário
     |
     | POST /chat
     v
+----------+
| Fastify  |
+----+-----+
     |
     v
+----------+     tools      +---------------+
|researcher|---------------->|google_trends|
+----+-----+                  +-------+-------+
     |                                |
     | trendsData                     v
     |                          SerpAPIService
     v                                |
+----------+                          v
|responder |<------------------- SerpAPI HTTP
+----+-----+
     |
     v
  AIMessage (PT-BR)
```

---

## Service → Tool

```
SerpAPIService                    google_trends (tool)
+------------------+              +------------------+
| getGoogleTrends  |  wrapped by  | name + desc      |
| parse trends     | -----------> | Zod schema       |
| fixture fallback |              | JSON return      |
+------------------+              +------------------+
         ^                                  |
         |                                  v
    SerpAPI                          createAgent (LLM)
```

---

## getMCPTools — lista híbrida

```
MultiServerMCPClient
        |
        v
  [filesystem tools]
        |
        +------+
               |
               v
        [...mcpTools, googleTrendsTool]
               |
               v
         OpenRouterService.tools
```

---

## Estado do grafo

```
GraphState
├── messages[]     ← HumanMessage in, AIMessage out
├── trendsData?    ← researcher
├── question?      ← researcher
└── keywords?      ← reservado
```

---

## OpenRouterService — modos

```
generateStructured(prompt, schema?)
        |
        +-- schema? SIM --> providerStrategy + tools:[]
        |
        +-- schema? NAO --> tools: [MCP + google_trends]
                              |
                              v
                         researcher / responder
```

---

## Comparação Módulo 03

```
Aula 01                    Aula 02
-------                    -------
FS + MongoDB MCP    -->    FS MCP only
csv_to_json         -->    google_trends
intent → agent      -->    researcher → responder
ETL pipeline        -->    content strategy
```

---

## Arquivos-chave

| Camada | Arquivo |
|--------|---------|
| HTTP | `src/server.ts` |
| Grafo | `src/graph/graph.ts` |
| Nós | `researcherNode.ts`, `responderNode.ts` |
| Tool | `src/tools/googleTrendsTool.ts` |
| Service | `serpApiService.ts`, `mcpService.ts` |
| LLM | `openRouterService.ts` |
