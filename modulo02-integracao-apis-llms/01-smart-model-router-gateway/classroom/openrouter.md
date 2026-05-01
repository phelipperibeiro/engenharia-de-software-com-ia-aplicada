# O que é o OpenRouter?

Site oficial: **[openrouter.ai](https://openrouter.ai/)**

O OpenRouter é a **ferramenta que este projeto usa para executar os modelos de linguagem (LLMs)**. Você não chama OpenAI, Google ou Anthropic diretamente — envia a requisição ao OpenRouter, e ele encaminha para o provedor/modelo certo.

---

## Analogia rápida

```
Sem OpenRouter:
  seu app ──► API OpenAI
  seu app ──► API Anthropic
  seu app ──► API Google
  (várias integrações, várias chaves, vários formatos)

Com OpenRouter:
  seu app ──► OpenRouter ──► qualquer um dos 400+ modelos / 60+ provedores
  (uma API, uma chave, mesmo SDK)
```

No exercício da aula, seu gateway Fastify fala com o OpenRouter via `@openrouter/sdk`; o roteamento (`price`, `throughput`, `latency`) é feito **dentro** dessa camada.

---

## O que a plataforma oferece

| Benefício | O que significa na prática |
|-----------|----------------------------|
| **Interface unificada** | Um endpoint e um padrão de API para centenas de modelos |
| **Compatível com OpenAI** | Muitos clientes/SDKs que já conhecem o formato OpenAI funcionam sem reescrever tudo |
| **Roteamento de modelos** | Escolha automática entre provedores/modelos (é o foco da aula 01) |
| **Fallback** | Se um provedor cai, pode tentar outro da lista |
| **Preço e performance** | Compara custo e latência entre opções; você pode priorizar o mais barato ou o mais rápido |
| **Créditos, sem assinatura** | Cria conta, compra créditos e paga pelo uso — não é plano mensal fixo por modelo |
| **Políticas de dados** | Em cenários enterprise, dá para restringir quais provedores recebem seus prompts |

Números públicos do site (podem mudar): **400+ modelos**, **60+ provedores**, trilhões de tokens processados por mês.

---

## Como você usa na aula (passo a passo na plataforma)

```
1. Acesse https://openrouter.ai/
2. Crie conta (Google, GitHub, etc.)
3. Compre créditos (há modelos :free para testes sem gastar)
4. Gere uma API key (OPENROUTER_API_KEY)
5. Coloque no .env do projeto
6. O código chama client.chat.send(...) e o OpenRouter executa o modelo
```

No repositório, a chave fica em `.env`:

```
OPENROUTER_API_KEY=sua-chave-aqui
```

O `config.ts` valida que ela existe antes de subir o servidor.

---

## Como os modelos são identificados

No OpenRouter, cada modelo tem um **slug** no formato:

```
provedor/nome-do-modelo:variante
```

Exemplos da aula:

| Slug | Uso no exercício |
|------|------------------|
| `arcee-ai/trinity-large-preview:free` | Candidato quando `sort.by = price` |
| `nvidia/nemotron-3-nano-30b-a3b:free` | Candidato quando `sort.by = throughput` |

O sufixo `:free` indica tier gratuito (ótimo para estudo e testes E2E).

Você pode explorar todos os modelos em: [openrouter.ai/models](https://openrouter.ai/models)

---

## O que seu código envia ao OpenRouter

No `openrouterService.ts`, a chamada principal é `client.chat.send()` com:

| Campo | Função |
|-------|--------|
| `apiKey` | Autenticação (via construtor do SDK) |
| `httpReferer` | URL do seu app (atribuição / política do OpenRouter) |
| `xTitle` | Nome do app (`SmartModelRouterGateway` na aula) |
| `models[]` | **Lista** de modelos candidatos — não apenas um |
| `messages` | System + user (o prompt) |
| `temperature`, `maxTokens` | Parâmetros de geração |
| `provider.sort` | Critério de roteamento: `price`, `throughput` ou `latency` |
| `stream` | `false` = resposta completa de uma vez |

A resposta traz, entre outros campos, **qual `model` foi efetivamente usado** — por isso o gateway devolve `{ model, content }` ao cliente.

---

## Roteamento: o coração da integração

O OpenRouter não é só um “proxy”. Ele **decide qual modelo/provedor atende** cada requisição quando você passa vários candidatos.

```
Você envia:
  models: [ modelo A, modelo B ]
  provider.sort.by: "price" | "throughput" | "latency"

OpenRouter:
  ordena / escolhe conforme o critério
  executa a inferência
  devolve qual modelo respondeu
```

Na aula, os testes E2E provam que, com a **mesma pergunta**, mudar só `sort.by` altera o `model` na resposta.

---

## OpenRouter vs seu gateway (Fastify)

São duas camadas diferentes — não confundir:

```
┌─────────────────────────────────────────────────────────────┐
│  Seu projeto (esta aula)                                    │
│  POST /chat  →  validação  →  OpenRouterService.generate() │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               v
┌─────────────────────────────────────────────────────────────┐
│  OpenRouter (openrouter.ai)                                 │
│  roteamento entre provedores, billing, fallback, sort       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               v
                    Provedores reais (OpenAI, Google, etc.)
```

- **Seu gateway**: API HTTP da sua aplicação, regras de negócio, validação de `question`.
- **OpenRouter**: infraestrutura que **executa** os LLMs e faz o smart routing entre modelos.

---

## Links úteis

| Recurso | URL |
|---------|-----|
| Site e cadastro | [openrouter.ai](https://openrouter.ai/) |
| Catálogo de modelos | [openrouter.ai/models](https://openrouter.ai/models) |
| Documentação | [openrouter.ai/docs](https://openrouter.ai/docs) |
| Referência da API | [openrouter.ai/docs/api-reference](https://openrouter.ai/docs/api-reference) |
| SDK usado no projeto | pacote `@openrouter/sdk` no npm |

---

## Resumo em uma frase

**OpenRouter é o hub que executa os LLMs por você** — uma API, uma chave, muitos modelos — e nesta aula você aprende a configurar o **roteamento inteligente** (`models[]` + `provider.sort`) em cima dele.
