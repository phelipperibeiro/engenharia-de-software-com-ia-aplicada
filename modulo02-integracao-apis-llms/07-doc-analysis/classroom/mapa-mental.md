# Mapa mental — Doc Analysis (Aula 07)

## Visão em árvore (texto)

```
Doc Analysis — PDF Q&A (Aula 07)
│
├── Objetivo da aula
│   ├── Q&A sobre PDF
│   ├── Modelo multimodal (vision)
│   └── Fechamento do Módulo 02
│
├── Multimodal
│   ├── Upload PDF multipart
│   ├── base64 no estado
│   ├── data:application/pdf;base64,...
│   └── Detalhes: classroom/multimodal.md
│
├── OpenRouter
│   ├── Gemini 2.5 Flash Lite (vision)
│   ├── generateWithDocument()
│   └── Detalhes: classroom/openrouter.md
│
├── LangGraph
│   ├── 1 nó: answerGeneration
│   ├── START → answer → END
│   └── Detalhes: classroom/langgraph.md
│
├── API Fastify
│   ├── POST /chat :4000
│   ├── @fastify/multipart
│   ├── file (PDF max 10MB)
│   └── question (min 3 chars)
│
├── Estado
│   ├── messages (pergunta)
│   ├── documentBase64
│   └── error?
│
├── Referência
│   └── arXiv LLM overview PDF
│
└── vs Módulo 02
    ├── 06 Graph RAG (Neo4j)
    └── 07 Multimodal (sem vector DB)
```

---

## Mapa mental (visão radial)

```
                         +-----------------------------+
                         |   Doc Analysis PDF Q&A 07   |
                         +--------------+--------------+
                                        |
        +---------------+---------------+---------------+
        |               |               |               |
   +----+----+     +----+----+     +----+----+     +----+----+
   | Upload  |     |OpenRouter|    |LangGraph|     | Vision  |
   +----+----+     +----+----+     +----+----+     +----+----+
        |               |               |               |
   multipart        Gemini          1 nó           PDF+text
   PDF 10MB         multimodal      simples        same call
        |               |               |               |
        +---------------+---------------+---------------+
                                        |
                              +---------+---------+
                              |                   |
                         +----+----+         +----+----+
                         | Fastify |         | Resposta|
                         | /chat   |         | answer  |
                         +---------+         +---------+
```

---

## Diagrama do grafo

```
                              +-------+
                              | START |
                              +---+---+
                                  |
                                  v
                         +-------------------+
                         | answerGeneration  |
                         | (vision LLM)      |
                         +---------+---------+
                                   |
                                   v
                               +-------+
                               |  END  |
                               +-------+
```

---

## Fluxo HTTP → LLM

```
  Cliente                Fastify server              LangGraph           OpenRouter
     |                         |                         |                    |
     | POST multipart          |                         |                    |
     | file + question         |                         |                    |
     |------------------------>|                         |                    |
     |                         | PDF → base64            |                    |
     |                         | invoke(state)           |                    |
     |                         |------------------------>|                    |
     |                         |                         | generateWithDoc    |
     |                         |                         | text + PDF block   |
     |                         |                         |------------------->|
     |                         |                         | content            |
     |                         |                         |<-------------------|
     |                         | AIMessage               |                    |
     |                         |<------------------------|                    |
     | JSON { answer }         |                         |                    |
     |<------------------------|                         |                    |
```

---

## Três abordagens de contexto (Módulo 02)

```
  Aula 06 — Graph RAG:
    pergunta → Cypher → Neo4j → LLM explica dados

  Aula 07 — Multimodal:
    pergunta + PDF → vision LLM → resposta

  RAG vetorial (conceito):
    pergunta → embedding → top-k chunks → LLM responde
    (não implementado neste repo)
```

---

## Mensagem multimodal (estrutura)

```
HumanMessage
  content: [
    { type: "text",      text: "What is this about?" },
    { type: "image_url", image_url: { url: "data:application/pdf;base64,..." } }
  ]
```

---

## Ligação arquivo ↔ conceito

| Conceito | Onde |
|----------|------|
| Grafo | `src/graph/graph.ts` |
| Nó resposta | `answerGenerationNode.ts` |
| Multimodal API | `openrouterService.ts` → `generateWithDocument` |
| Upload HTTP | `server.ts` |
| Modelo vision | `config.ts` |
| Factory | `graph/factory.ts` |
| Server boot + teste | `index.ts` |

---

## Comparação aulas 06 vs 07

```
+------------------+---------------------------+---------------------------+
|                  | Aula 06                   | Aula 07                   |
+------------------+---------------------------+---------------------------+
| Entrada          | JSON question             | PDF + question            |
| Fonte verdade    | Neo4j grafo               | Conteúdo do PDF           |
| Nós LangGraph    | 7                         | 1                         |
| Tipo LLM         | 4x structured text        | 1x multimodal             |
| Porta            | 3000 (/sales)             | 4000 (/chat)              |
| Escala docs      | N/A (dados tabulares)     | 1 PDF por request         |
+------------------+---------------------------+---------------------------+
```

---

## Módulo 02 completo (01–07)

```
01 OpenRouter     ──► hub de modelos
02 LangGraph      ──► grafos e estado
03 Medical        ──► prompt chaining + structured
04 Song           ──► memória PG + SQLite
05 Guardrails     ──► injection + safeguard
06 Neo4j          ──► Graph RAG Text-to-Cypher
07 Doc Analysis   ──► PDF multimodal vision
```
