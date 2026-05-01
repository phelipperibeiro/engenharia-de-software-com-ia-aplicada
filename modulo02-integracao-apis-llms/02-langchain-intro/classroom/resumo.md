# Aula 02 — LangChain / LangGraph Intro

## Contexto no curso

Segunda aula do **Módulo 02 (Integração com APIs de LLMs)**. Depois de integrar modelos via OpenRouter (aula 01), você aprende a **estruturar fluxos com LangGraph**: estado tipado, nós, arestas condicionais e mensagens LangChain.

> Ferramentas da aula: **[langgraph.md](./langgraph.md)**

**Aula anterior:** [01-smart-model-router-gateway](../01-smart-model-router-gateway/classroom/) — gateway + OpenRouter.

**Próximas aulas:** o mesmo padrão `StateGraph` + nós evolui para LLM real, LangGraph Studio, RAG, safeguard, etc.

---

## LangGraph — o que esta aula adiciona

Nesta aula o “cérebro” não é um LLM na nuvem, e sim um **grafo de estados**:

| Peça | Papel |
|------|-------|
| `StateGraph` | Define o workflow |
| Estado Zod | `messages`, `output`, `command` |
| Nós | Funções puras `(state) => atualização` |
| Aresta condicional | Escolhe `uppercase` / `lowercase` / `fallback` |
| `graph.invoke()` | Executa o fluxo de ponta a ponta |

Isso prepara o terreno para substituir `identifyIntent` por classificação com LLM e encadear ferramentas — sem reescrever a arquitetura HTTP.

---

## O que você está construindo

Um **assistente de transformação de texto** exposto em `POST /chat`:

- Se a pergunta contém `"upper"` → devolve o texto em **MAIÚSCULAS**
- Se contém `"lower"` → devolve em **minúsculas**
- Caso contrário → mensagem de **comando desconhecido**

```
Cliente → POST /chat { question }
       → HumanMessage(question)
       → LangGraph.invoke()
       → resposta: string (output)
```

Diferente da aula 01: a resposta é **texto puro**, não JSON com `model` e `content`.

---

## Estado do grafo (`GraphState`)

Definido em `src/graph/graph.ts`:

| Campo | Tipo | Quem preenche |
|-------|------|----------------|
| `messages` | `BaseMessage[]` | Entrada (`HumanMessage`) + `chatResponse` (`AIMessage`) |
| `output` | `string` | Todos os nós de ação |
| `command` | `uppercase` \| `lowercase` \| `unknown` | `identifyIntent` |

O schema usa **Zod** com `withLangGraph` e `MessagesZodMeta` para integração correta com mensagens LangChain.

---

## Nós do grafo

| Nó | Arquivo | O que faz |
|----|---------|-----------|
| `identifyIntent` | `identifyIntentNode.ts` | Lê última mensagem; se contém `upper` → `uppercase`, `lower` → `lowercase`, senão `unknown` |
| `uppercase` | `upperCaseNode.ts` | `output = output.toUpperCase()` |
| `lowercase` | `lowerCaseNode.ts` | `output = output.toLowerCase()` |
| `fallback` | `fallbackNode.ts` | Mensagem fixa de ajuda + `AIMessage` no histórico |
| `chatResponse` | `chatResponseNode.ts` | Adiciona `AIMessage` com o `output` final |

**Detecção de intenção:** regra simples em string (`includes`), não é chamada de LLM — ideal para focar no grafo sem custo de API.

---

## Fluxo do grafo (arestas)

```
START → identifyIntent
              │
              ├─ uppercase  → uppercase  ──┐
              ├─ lowercase  → lowercase  ──┼→ chatResponse → END
              └─ (default)  → fallback   ──┘
```

Implementação em `graph.ts`:

- `addEdge(START, "identifyIntent")`
- `addConditionalEdges("identifyIntent", switch(state.command), ...)`
- Ramificações convergem em `chatResponse`
- `addEdge("chatResponse", END)`

---

## Arquitetura em camadas

| Arquivo | Responsabilidade |
|---------|------------------|
| `graph/graph.ts` | Schema do estado + `buildGraph()` |
| `graph/factory.ts` | Export `graph()` para LangGraph CLI |
| `graph/nodes/*.ts` | Lógica de cada passo |
| `server.ts` | Fastify, `graph.invoke()`, retorna `output` |
| `index.ts` | Bootstrap `listen(3000)` |
| `langgraph.json` | Config do `langgraph dev` |
| `tests/router.e2e.test.ts` | E2E sem API externa |

---

## Servidor HTTP

Mesmo contrato de entrada da aula 01:

```json
{ "question": "string com pelo menos 5 caracteres" }
```

Resposta de sucesso: **corpo = string** (`response.output`), por exemplo:

```
MAKE THIS MESSAGE LOWER PLEASE!
```

→ após lowercase → `make this message lower please!`

---

## LangSmith (opcional)

`.env.example`:

```
LANGSMITH_API_KEY=...
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=yt02-langchain-intro
```

Ativa tracing no [LangSmith](https://smith.langchain.com/) para ver cada nó executado. Os testes **não dependem** disso.

---

## Testes E2E

Três cenários em `tests/router.e2e.test.ts` — **100% locais**, sem chave de API:

| Teste | Entrada (trecho) | Saída esperada |
|-------|------------------|----------------|
| Uppercase | contém variação de texto com "upper" implícito na lógica* | `msg.toUpperCase()` |
| Lowercase | `MAKE THIS... LOWER...` | `msg.toLowerCase()` |
| Unknown | `HEY THERE!` | Mensagem do fallback |

\* O teste de uppercase usa `'make THis message UPPER please!'` — a palavra **upper** está no texto, então `identifyIntent` define `command = 'uppercase'`.

---

## Como rodar localmente

```bash
cp .env.example .env
# Opcional: configure LangSmith para tracing

npm run dev              # API em http://0.0.0.0:3000
npm test                 # testes E2E
npm run langgraph:serve  # UI do grafo (LangGraph CLI)
```

Exemplo manual:

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"make this uppercase please"}'
```

---

## Dependências principais

| Pacote | Função |
|--------|--------|
| `@langchain/langgraph` | `StateGraph`, `START`, `END`, conditional edges |
| `langchain` | `HumanMessage`, `AIMessage` |
| `zod` | Schema do estado |
| `fastify` | API HTTP |

---

## Takeaways

1. **Fluxo explícito** — nós pequenos e testáveis valem mais que um handler gigante.
2. **Estado compartilhado** — `command` + `output` guiam o roteamento sem variáveis globais.
3. **Arestas condicionais** — mesmo padrão usado depois para “usar ferramenta ou responder”.
4. **Mensagens LangChain** — formato padrão para quando plugar LLM nos nós.
5. **Evolução natural** — troque `identifyIntent` por um nó com OpenRouter/LLM na aula 03+.

---

## Próximos passos sugeridos (estudo)

- Rodar `npm run langgraph:serve` e inspecionar o grafo na UI.
- Adicionar um quarto comando (ex.: `reverse`) com novo nó e aresta.
- Logar `state` após cada nó com LangSmith tracing.
- Comparar com aula 01: onde encaixaria um nó `callLLM` no meio do fluxo?
