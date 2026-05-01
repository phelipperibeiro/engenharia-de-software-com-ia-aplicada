# O que são LangChain, LangGraph e LangSmith?

Esta aula **não chama LLM na nuvem** (diferente da aula 01 com OpenRouter). Ela introduz **orquestração de fluxo com grafo de estados** — a base para agentes e pipelines mais complexos no restante do módulo.

---

## LangChain — biblioteca de primitivos

**LangChain** (`langchain`, `@langchain/core`) fornece blocos reutilizáveis para aplicações com modelos de linguagem:

| Primitivo | Uso nesta aula |
|-----------|----------------|
| `HumanMessage` | Representa a pergunta do usuário no estado |
| `AIMessage` | Representa a resposta do assistente após o fluxo |
| `BaseMessage` | Tipo base das mensagens no array `messages` |

Documentação: [docs.langchain.com](https://docs.langchain.com/)

Nesta aula os nós de transformação (`uppercase`, `lowercase`) são **JavaScript puro** — LangChain entra principalmente pelo **formato de mensagens** e pela integração com LangGraph.

---

## LangGraph — grafo de estados (coração da aula)

**LangGraph** (`@langchain/langgraph`) modela a aplicação como um **grafo dirigido**:

```
Nós   = funções que leem e atualizam o estado
Arestas = ordem de execução (fixas ou condicionais)
Estado = objeto compartilhado que atravessa todo o fluxo
```

### Conceitos principais

| Conceito | O que é |
|----------|---------|
| `StateGraph` | Construtor do workflow |
| `stateSchema` | Formato do estado (aqui: Zod + `withLangGraph`) |
| `addNode` | Registra um passo (`identifyIntent`, `uppercase`, etc.) |
| `addEdge` | Liga dois nós sempre |
| `addConditionalEdges` | Escolhe o próximo nó com base no estado |
| `START` / `END` | Entrada e saída do grafo |
| `.compile()` | Gera o grafo executável |
| `.invoke(initialState)` | Roda o fluxo uma vez |

### Por que grafo em vez de `if/else` solto?

```
if/else linear          LangGraph
────────────────        ─────────────────────────────
difícil de visualizar   fluxo explícito no código
cresce desordenado      cada passo = um nó isolado
sem replay/debug fácil  LangSmith traça cada nó (opcional)
```

Nos projetos seguintes do módulo (agendamento, RAG, safeguard), o mesmo padrão escala para dezenas de nós e ramificações.

---

## Estado do grafo nesta aula

Definido em `graph.ts` com **Zod**:

```typescript
{
  messages: BaseMessage[]   // histórico (Human + AI)
  output: string              // texto de resposta atual
  command: 'uppercase' | 'lowercase' | 'unknown'
}
```

- `messages` usa `MessagesZodMeta` — integração oficial LangGraph + mensagens LangChain.
- `command` é preenchido por `identifyIntent` e guia o roteamento condicional.
- `output` é transformado pelos nós de ação e lido por `chatResponse`.

Cada nó retorna **apenas o que muda** (spread do estado anterior implícito no merge do LangGraph).

---

## Fluxo deste projeto (visão geral)

```
START
  │
  v
identifyIntent  ──► detecta "upper" ou "lower" no texto
  │
  ├── command = uppercase ──► uppercase node ──┐
  ├── command = lowercase ──► lowercase node ──┼──► chatResponse ──► END
  └── command = unknown   ──► fallback node ──┘
```

`chatResponse` adiciona um `AIMessage` ao array `messages` com o `output` final.

---

## LangSmith — observabilidade (opcional)

**LangSmith** é a plataforma de tracing/debug da LangChain. Nesta aula, o `.env` pode habilitar:

```
LANGSMITH_API_KEY=...
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=yt02-langchain-intro
```

Com tracing ativo, cada execução de `graph.invoke()` aparece no dashboard: quais nós rodaram, quanto tempo, estado intermediário.

Site: [smith.langchain.com](https://smith.langchain.com/)

Não é obrigatório para os testes E2E — eles rodam **sem API externa**.

---

## LangGraph CLI — visualizar o grafo

O arquivo `langgraph.json` aponta o grafo para o servidor de desenvolvimento:

```json
"graphs": {
  "agent": "./src/graph/factory.ts:graph"
}
```

Comando:

```bash
npm run langgraph:serve
```

Abre interface local para inspecionar o grafo (útil para estudar arestas e nós sem ler só o código).

---

## LangGraph vs seu servidor Fastify

```
┌──────────────────────────────────────────────────────────┐
│  Fastify POST /chat                                      │
│  HumanMessage(question) → graph.invoke() → output string │
└────────────────────────────┬─────────────────────────────┘
                             │
                             v
┌──────────────────────────────────────────────────────────┐
│  LangGraph (buildGraph)                                  │
│  identifyIntent → [uppercase|lowercase|fallback] → chat  │
└──────────────────────────────────────────────────────────┘
```

- **Fastify**: contrato HTTP, validação de `question`.
- **LangGraph**: lógica de negócio em nós e roteamento por `command`.

---

## Relação com a aula 01

| Aula 01 | Aula 02 |
|---------|---------|
| OpenRouter executa LLM | Sem LLM — regras em código |
| Roteamento por preço/throughput | Roteamento por intenção (`command`) |
| Resposta JSON `{ model, content }` | Resposta texto puro (`output`) |
| Testes precisam de API key | Testes 100% locais |

As duas aulas se complementam: **01 = onde rodar o modelo**; **02 = como organizar o fluxo** antes de plugar LLM de volta nos nós.

---

## Links úteis

| Recurso | URL |
|---------|-----|
| LangGraph docs | [langchain-ai.github.io/langgraph](https://langchain-ai.github.io/langgraph/) |
| LangChain JS | [js.langchain.com](https://js.langchain.com/) |
| LangSmith | [smith.langchain.com](https://smith.langchain.com/) |
| LangGraph CLI | pacote `@langchain/langgraph-cli` (script `langgraph:serve`) |

---

## Resumo em uma frase

**LangGraph organiza sua aplicação em nós e arestas com estado compartilhado** — nesta aula você roteia por palavras-chave (`upper`/`lower`); nas próximas, os mesmos nós passarão a chamar LLMs e ferramentas externas.
