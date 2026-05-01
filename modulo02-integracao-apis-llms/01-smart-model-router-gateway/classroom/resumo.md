# Aula 01 — Smart Model Router Gateway

## Contexto no curso

Esta é a **primeira aula do Módulo 02 (Integração com APIs de LLMs)**. O objetivo é sair do “chamar um modelo fixo” e passar a **orquestrar qual modelo responde**, usando o [OpenRouter](https://openrouter.ai/) como gateway unificado para dezenas de provedores.

Projetos seguintes no módulo evoluem o mesmo padrão (`OpenRouterService` + Fastify/LangGraph): agendamento médico, highlights de música, safeguard contra prompt injection, RAG com Neo4j e análise de documentos.

> Resumo dedicado à ferramenta: **[openrouter.md](./openrouter.md)**

---

## OpenRouter — a ferramenta que executa os modelos

**[OpenRouter](https://openrouter.ai/)** é o serviço externo que roda os LLMs neste curso. Pense nele como um **hub único**: em vez de integrar cada provedor (OpenAI, Anthropic, Google, etc.) com chave e SDK próprios, você usa **uma API** compatível com o ecossistema OpenAI e acessa **400+ modelos de 60+ provedores**.

### Por que usar OpenRouter?

| Problema sem hub | Como o OpenRouter resolve |
|------------------|---------------------------|
| Várias APIs e chaves | Uma `OPENROUTER_API_KEY` |
| Trocar de modelo = reescrever integração | Troca o slug (`provedor/modelo:variante`) |
| Provedor fora do ar | Fallback entre candidatos na lista `models[]` |
| Otimizar custo vs velocidade | `provider.sort.by`: `price`, `throughput`, `latency` |

### Como entra neste projeto

```
Seu código (Fastify)          OpenRouter (nuvem)              Provedores
─────────────────────         ──────────────────              ──────────
POST /chat                         │
OpenRouterService.generate()  ───►│ chat.send(models, sort)
                                  │ escolhe e executa modelo
◄── { model, content }        ◄───│
```

1. Você cria conta em [openrouter.ai](https://openrouter.ai/), compra créditos (há modelos `:free` para estudo) e gera a API key.
2. A chave vai no `.env` como `OPENROUTER_API_KEY`.
3. O SDK `@openrouter/sdk` (em `openrouterService.ts`) envia prompts e recebe a resposta.
4. O OpenRouter devolve **qual modelo** atendeu — seu gateway repassa isso ao cliente.

### Identificação dos modelos

Slugs no formato `provedor/nome:variante`, por exemplo:

- `arcee-ai/trinity-large-preview:free`
- `nvidia/nemotron-3-nano-30b-a3b:free`

Catálogo completo: [openrouter.ai/models](https://openrouter.ai/models)

### Duas camadas — não confundir

- **Seu gateway** (`server.ts`): HTTP, validação de `question`, formato `{ model, content }`.
- **OpenRouter**: execução do LLM, roteamento entre provedores, billing por créditos.

A aula 01 ensina a configurar o **roteamento no OpenRouter**; as aulas seguintes reutilizam o mesmo serviço com fluxos mais complexos (LangGraph, RAG, safeguard).

---

## O que você está construindo

Um **gateway HTTP mínimo** que expõe `POST /chat` e, por baixo dos panos, delega ao OpenRouter a escolha do melhor modelo entre uma **lista ordenada por critério** (preço, throughput ou latência).

```
Cliente → POST /chat { question } → Fastify → OpenRouterService → OpenRouter API → resposta { model, content }
```

---

## Conceitos centrais

### 1. OpenRouter como camada de abstração

Em vez de integrar OpenAI, Anthropic, Google etc. separadamente, você usa **uma API** (`@openrouter/sdk`) com:

- `apiKey` — autenticação
- `httpReferer` e `xTitle` — metadados exigidos/recomendados pelo OpenRouter
- `models: string[]` — **lista de candidatos** (não um único `model`)

O OpenRouter tenta os modelos na ordem da lista, respeitando o critério de `provider.sort`.

### 2. Roteamento inteligente (`provider.sort`)

Em `config.ts`, o roteamento é controlado por:

| Campo | Valores usados na aula | Efeito |
|-------|------------------------|--------|
| `sort.by` | `price`, `throughput`, `latency` | Define **como** ordenar provedores/modelos disponíveis |
| `sort.partition` | `none` | Sem particionamento extra de região/tier |

Na prática:

- **`price`** → tende a escolher o modelo mais barato da lista → no teste, `arcee-ai/trinity-large-preview:free`
- **`throughput`** → prioriza maior vazão → no teste, `nvidia/nemotron-3-nano-30b-a3b:free`

Isso é o coração da aula: **a mesma pergunta pode ir para modelos diferentes só mudando a configuração**, sem alterar a lógica do endpoint.

### 3. Parâmetros da geração

Além do roteamento, o serviço envia:

- `messages` — system + user
- `temperature: 0.2` — respostas mais determinísticas
- `maxTokens: 100` — limite curto (útil em demos e testes)
- `stream: false` — resposta completa de uma vez

### 4. Arquitetura em camadas

| Arquivo | Responsabilidade |
|---------|------------------|
| `config.ts` | Variáveis de ambiente, lista de modelos, critério de sort, prompts |
| `openrouterService.ts` | Cliente SDK + método `generate()` → `{ model, content }` |
| `server.ts` | Fastify, validação do body, rota `POST /chat` |
| `index.ts` | Composição: config → service → server → `listen(3000)` |
| `tests/router.e2e.test.ts` | Testes E2E com `app.inject()` e config customizada |

**Injeção de dependência:** `createServer(routerService)` recebe o serviço pronto. Nos testes, você instancia `OpenRouterService(customConfig)` sem subir servidor real na rede — padrão que se repete no curso.

### 5. Validação e contrato da API

A rota exige body JSON:

```json
{ "question": "string com pelo menos 5 caracteres" }
```

Resposta de sucesso:

```json
{ "model": "provedor/modelo:variante", "content": "texto gerado" }
```

Erros internos retornam HTTP 500 (sem corpo detalhado no handler atual).

---

## Fluxo de execução (passo a passo)

1. `index.ts` carrega `config` (falha cedo se `OPENROUTER_API_KEY` ausente via `console.assert`).
2. Cria `OpenRouterService` e `createServer(routerService)`.
3. Cliente chama `POST /chat` com `{ question }`.
4. Fastify valida o schema e chama `routerService.generate(question)`.
5. SDK envia `chat.send` com **array `models`** + `provider.sort`.
6. OpenRouter escolhe e executa; a resposta traz qual `model` foi usado de fato.
7. API devolve `{ model, content }` ao cliente.

---

## Testes E2E (o que eles provam)

Os testes **não mockam** o OpenRouter — são integração real (precisam de `OPENROUTER_API_KEY` no `.env`):

1. **Mais barato:** `sort.by = 'price'` → espera `arcee-ai/trinity-large-preview:free`
2. **Maior throughput:** `sort.by = 'throughput'` → espera `nvidia/nemotron-3-nano-30b-a3b:free`

Isso documenta o comportamento esperado do roteador e serve de “contrato vivo” da aula.

---

## Como rodar localmente

```bash
cp .env.example .env
# Edite .env com sua OPENROUTER_API_KEY

npm run dev      # servidor em http://0.0.0.0:3000
npm test         # testes E2E
```

Exemplo manual (com servidor rodando):

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"What is rate limiting?"}'
```

---

## Modelos usados na aula (tier free)

| Modelo | Papel no exercício |
|--------|-------------------|
| `arcee-ai/trinity-large-preview:free` | Candidato quando sort = **price** |
| `nvidia/nemotron-3-nano-30b-a3b:free` | Candidato quando sort = **throughput** |

Ambos são `:free` para permitir experimentação sem custo — em produção você misturaria modelos pagos e fallbacks.

---

## Takeaways para levar adiante

1. **Gateway > modelo único** — listas + critérios de sort reduzem lock-in e otimizam custo/latência.
2. **Config separada do código** — trocar `sort.by` ou `models[]` não exige mudar handlers.
3. **Sempre retorne qual modelo respondeu** — essencial para observabilidade, billing e debug.
4. **Testes de integração** validam roteamento real, não só mocks.
5. Este projeto é a **base** reutilizada nos módulos 02–07 com LangGraph, guardrails e RAG.

---

## Próximos passos sugeridos (estudo)

- Alterar `sort.by` para `latency` e observar qual modelo volta.
- Adicionar um terceiro modelo à lista e ver o fallback quando o primeiro falha.
- Logar `response.model` e tokens em produção.
- Comparar com a aula 05 (safeguard) e 06 (RAG) — mesmo `OpenRouterService`, fluxos mais ricos.
