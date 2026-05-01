# OpenRouter nesta aula (03)

Site oficial: **[openrouter.ai](https://openrouter.ai/)**

Na aula 01 você usou o SDK `@openrouter/sdk` direto. **Nesta aula**, o OpenRouter entra via **LangChain** (`ChatOpenAI` apontando para a API do OpenRouter) + **saída estruturada** com schemas Zod.

---

## Papel do OpenRouter aqui

```
Usuário (português, texto livre)
        │
        v
  identifyIntent  ──► LLM extrai intent + campos (JSON validado)
        │
        v
  schedule | cancel  ──► código TypeScript (sem LLM)
        │
        v
  message  ──► LLM gera mensagem amigável (JSON validado)
```

O LLM **não agenda sozinho** — ele **entende** e **responde**. Quem altera dados é o `AppointmentService`.

---

## Como o projeto conecta

Em `openRouterService.ts`:

| Peça | Função |
|------|--------|
| `ChatOpenAI` | Cliente LangChain |
| `baseURL: https://openrouter.ai/api/v1` | API compatível OpenAI |
| `apiKey` | `OPENROUTER_API_KEY` do `.env` |
| `modelKwargs.models` | Lista de modelos (smart routing, como na aula 01) |
| `modelKwargs.provider` | `sort.by: throughput` em `config.ts` |
| `createAgent` + `providerStrategy(schema)` | Força resposta no formato Zod |

Método principal: **`generateStructured(system, user, schema)`** → `{ success, data }` ou `{ success: false, error }`.

---

## Saída estruturada (anti-alucinação)

Sem schema, o modelo pode inventar campos ou formatos. Com Zod:

| Chamada | Schema | Campos principais |
|---------|--------|-------------------|
| `identifyIntent` | `IntentSchema` | `intent`, `professionalId`, `datetime`, `patientName`, ... |
| `message` | `MessageSchema` | `message` (texto para o paciente) |

O LangChain valida a resposta contra o schema antes de o nó continuar.

---

## Modelo configurado

Em `config.ts` (exemplo da aula):

```
arcee-ai/trinity-large-preview:free
provider.sort.by: throughput
temperature: 0.7
```

Catálogo: [openrouter.ai/models](https://openrouter.ai/models)

---

## Variáveis de ambiente

```
OPENROUTER_API_KEY=...
```

Opcional (observabilidade):

```
LANGSMITH_API_KEY=...
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=03-medical-appointment
```

Testes E2E **precisam** da API key — são chamadas reais ao LLM.

---

## OpenRouter vs AppointmentService

```
+------------------+----------------------------+---------------------------+
|                  | OpenRouter (LLM)           | AppointmentService (TS)   |
+------------------+----------------------------+---------------------------+
| identifyIntent   | classifica + extrai dados  | —                         |
| schedule         | —                          | bookAppointment()         |
| cancel           | —                          | cancelAppointment()       |
| message          | texto final ao usuário     | —                         |
+------------------+----------------------------+---------------------------+
```

---

## Resumo em uma frase

**OpenRouter fornece o “cérebro linguístico”** (entender português e gerar resposta); **o grafo e o serviço de agendamento garantem regras de negócio** (horário livre, cancelamento existente).

Mais sobre a plataforma: [classroom da aula 01](../01-smart-model-router-gateway/classroom/openrouter.md).
