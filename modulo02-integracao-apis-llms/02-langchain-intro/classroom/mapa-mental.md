# Mapa mental — LangChain / LangGraph Intro

## Visão em árvore (texto)

```
LangChain / LangGraph Intro (Aula 02)
│
├── Objetivo da aula
│   ├── Introduzir LangGraph (grafo de estados)
│   ├── Estado tipado com Zod
│   ├── Nós + arestas condicionais
│   └── Sem LLM externo (lógica local)
│
├── LangChain (primitivos)
│   ├── HumanMessage (entrada do usuário)
│   ├── AIMessage (resposta no histórico)
│   └── BaseMessage[] no estado
│
├── LangGraph (orquestração)
│   ├── StateGraph + stateSchema
│   ├── addNode / addEdge
│   ├── addConditionalEdges
│   ├── START → ... → END
│   ├── compile() + invoke()
│   └── Detalhes: classroom/langgraph.md
│
├── Estado GraphState
│   ├── messages: BaseMessage[]
│   ├── output: string
│   └── command: uppercase | lowercase | unknown
│
├── Nós
│   ├── identifyIntent ── detecta upper/lower no texto
│   ├── uppercase ─────── toUpperCase()
│   ├── lowercase ─────── toLowerCase()
│   ├── fallback ──────── mensagem de ajuda
│   └── chatResponse ──── adiciona AIMessage
│
├── Fluxo do grafo
│   ├── START → identifyIntent
│   ├── condicional por command
│   ├── ramos → chatResponse → END
│   └── factory.ts + langgraph.json (CLI)
│
├── API HTTP (Fastify)
│   ├── POST /chat { question }
│   ├── graph.invoke({ messages: [HumanMessage] })
│   └── retorna output (string)
│
├── LangSmith (opcional)
│   ├── LANGCHAIN_TRACING_V2
│   └── LANGCHAIN_PROJECT
│
├── Testes E2E
│   ├── uppercase
│   ├── lowercase
│   ├── unknown / fallback
│   └── sem API key
│
├── Comandos
│   ├── npm run dev
│   ├── npm test
│   └── npm run langgraph:serve
│
└── Evolução no curso
    ├── 01 OpenRouter (modelos)
    ├── 03+ LLM dentro dos nós
    ├── 05 safeguard
    └── 06 RAG + Neo4j
```

---

## Mapa mental (visão radial)

```
                         +-----------------------------+
                         |  LangChain / LangGraph Intro|
                         +--------------+--------------+
                                        |
        +---------------+---------------+---------------+---------------+
        |               |               |               |               |
   +----+----+     +----+----+     +----+----+     +----+----+     +----+----+
   | Objetivo|     |LangChain|     |LangGraph|     |  Estado |     |  Nós    |
   +----+----+     +----+----+     +----+----+     +----+----+     +----+----+
        |               |               |               |               |
   grafo estados    HumanMessage    StateGraph      messages[]     identifyIntent
   sem LLM cloud    AIMessage       conditional     output         uppercase
                    BaseMessage     START/END       command        lowercase
                                    compile/invoke                 fallback
                                                                   chatResponse
        |               |               |               |               |
        +---------------+---------------+---------------+---------------+
                                        |
                    +-------------------+-------------------+
                    |                   |                   |
               +----+----+         +----+----+         +----+----+
               | Fastify |         | Testes  |         | Modulo  |
               | /chat   |         |  E2E    |         |   02    |
               +----+----+         +----+----+         +----+----+
                    |                   |                   |
              invoke grafo        sem API key           aula 01 OR
              retorna string      3 cenarios            proximas LLM
```

---

## Diagrama de sequência (POST /chat)

```
  Cliente              Fastify /chat              LangGraph                 Nós
     |                       |                        |                       |
     |  POST {question}      |                        |                       |
     |---------------------->|                        |                       |
     |                       |  invoke({ messages })  |                       |
     |                       |----------------------->|                       |
     |                       |                        |  identifyIntent       |
     |                       |                        |---------------------->|
     |                       |                        |  command definido     |
     |                       |                        |<----------------------|
     |                       |                        |                       |
     |                       |                        |  uppercase|lowercase |
     |                       |                        |  ou fallback          |
     |                       |                        |---------------------->|
     |                       |                        |  output transformado  |
     |                       |                        |<----------------------|
     |                       |                        |                       |
     |                       |                        |  chatResponse         |
     |                       |                        |---------------------->|
     |                       |                        |  AIMessage no state   |
     |                       |                        |<----------------------|
     |                       |  state.output (string) |                       |
     |                       |<-----------------------|                       |
     |      body = texto     |                        |                       |
     |<----------------------|                        |                       |
     |                       |                        |                       |
```

---

## Diagrama do grafo (arestas)

```
                              +-------+
                              | START |
                              +---+---+
                                  |
                                  v
                         +----------------+
                         | identifyIntent |
                         +--------+-------+
                                  |
                    +-------------+-------------+
                    |             |             |
            command=uppercase  lowercase    unknown
                    |             |             |
                    v             v             v
             +-----------+ +-----------+ +-----------+
             | uppercase | | lowercase | | fallback  |
             +-----+-----+ +-----+-----+ +-----+-----+
                   |             |             |
                   +-------------+-------------+
                                  |
                                  v
                         +----------------+
                         | chatResponse   |
                         +--------+-------+
                                  |
                                  v
                              +-------+
                              |  END  |
                              +-------+
```

---

## Diagrama de decisão (identifyIntent)

```
                    +------------------+
                    | ultima mensagem  |
                    | (texto usuario)  |
                    +--------+---------+
                             |
                             v
                    +--------+---------+
                    | texto em lower   |
                    +--------+---------+
                             |
              +--------------+--------------+
              |              |              |
        contem "upper"  contem "lower"   nenhum
              |              |              |
              v              v              v
       +------------+ +------------+ +------------+
       | command =  | | command =  | | command =  |
       | uppercase  | | lowercase  | | unknown    |
       +------------+ +------------+ +------------+
              |              |              |
              v              v              v
       +------------+ +------------+ +------------+
       | no uppercase| | no lowercase| | no fallback|
       | node        | | node        | | node       |
       +------------+ +------------+ +------------+
```

---

## Ligação arquivo ↔ conceito

| Conceito | Onde no código |
|----------|----------------|
| Definição do grafo | `src/graph/graph.ts` → `buildGraph()` |
| Schema do estado | `GraphState` (Zod) em `graph.ts` |
| Detecção de intenção | `nodes/identifyIntentNode.ts` |
| Transformações | `upperCaseNode.ts`, `lowerCaseNode.ts` |
| Resposta padrão | `fallbackNode.ts` |
| Histórico AI | `chatResponseNode.ts` |
| Export CLI | `factory.ts` + `langgraph.json` |
| HTTP | `server.ts` → `POST /chat` |
| Prova do fluxo | `tests/router.e2e.test.ts` |

---

## Comparação rápida: Aula 01 vs Aula 02

```
+------------------+---------------------------+---------------------------+
|                  | Aula 01                   | Aula 02                   |
+------------------+---------------------------+---------------------------+
| Ferramenta core  | OpenRouter (LLM nuvem)    | LangGraph (fluxo local)   |
| Roteamento       | price / throughput        | upper / lower / unknown   |
| Resposta HTTP    | JSON { model, content }   | string (output)           |
| Testes           | precisa OPENROUTER_API_KEY| sem API externa           |
| Padrao futuro    | qual modelo usar          | como organizar o fluxo    |
+------------------+---------------------------+---------------------------+
```
