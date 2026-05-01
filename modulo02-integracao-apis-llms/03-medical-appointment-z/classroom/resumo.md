# Aula 03 — Medical Appointment (agendamento médico)

## Contexto no curso

Terceira aula do **Módulo 02**. Integra as duas anteriores:

- **Aula 01** — [OpenRouter](https://openrouter.ai/) para executar LLMs
- **Aula 02** — LangGraph para orquestrar fluxos

Aqui você constrói um **assistente de consultas médicas** que agenda e cancela horários em linguagem natural (português), com **prompt chaining** e **saída estruturada (Zod)**.

> Ferramentas: **[openrouter.md](./openrouter.md)** · **[langgraph.md](./langgraph.md)**

---

## O que você está construindo

Sistema que recebe frases como:

- *"Sou Maria e quero agendar com Dr. Alicio amanhã às 16h para check-up"*
- *"Cancele minha consulta com Dra. Ana hoje às 14h, me chamo João"*

E responde com confirmação ou erro em tom de recepcionista.

```
POST /chat → LangGraph
  → identifyIntent (LLM extrai dados)
  → schedule OU cancel (código + AppointmentService)
  → message (LLM redige resposta)
→ JSON com estado final
```

---

## Arquitetura em camadas

| Camada | Arquivos | Responsabilidade |
|--------|----------|------------------|
| HTTP | `server.ts`, `index.ts` | Fastify, `graph.invoke()`, retorna estado |
| Grafo | `graph/graph.ts`, `factory.ts` | Monta nós e arestas |
| Nós | `graph/nodes/*.ts` | Lógica de cada passo |
| Prompts | `prompts/v1/*.ts` | Templates JSON versionados |
| LLM | `openRouterService.ts` | `generateStructured` + OpenRouter |
| Domínio | `appointmentService.ts` | Profissionais, agenda em memória |
| Config | `config.ts` | API key, modelo, temperature, provider.sort |

---

## Estado do grafo (campos importantes)

```typescript
messages, patientName,
intent: 'schedule' | 'cancel' | 'unknown',
professionalId, professionalName, datetime, reason,
actionSuccess, actionError, appointmentData, error
```

O LLM no primeiro nó preenche `intent` e slots; os nós de ação setam `actionSuccess` / `actionError`; o último nó adiciona `AIMessage` em `messages`.

---

## Fluxo detalhado

### 1. `identifyIntent` (LLM)

- Lê última `HumanMessage`
- Prompt com lista de médicos + `current_date` + regras (`schedule` / `cancel` / `unknown`)
- `generateStructured(..., IntentSchema)`
- Retorna `professionalId`, `datetime` ISO, `patientName`, etc.

### 2. Roteamento condicional

- `schedule` → nó `schedule`
- `cancel` → nó `cancel`
- `unknown` ou `error` → pula direto para `message`

### 3. `schedule` / `cancel` (código)

Validam com Zod local (`ScheduleRequiredFieldsSchema` / `CancelRequiredFieldsSchema`):

- **Agendar:** `bookAppointment` se horário livre; senão erro *"Horário indisponível"*
- **Cancelar:** `cancelAppointment` se existir registro; senão *"Agendamento não encontrado"*

### 4. `message` (LLM)

- Monta `scenario`: ex. `schedule_success`, `cancel_error`, `unknown_error`
- Segundo prompt (recepcionista) → `MessageSchema` → `AIMessage` no histórico

---

## OpenRouter + LangChain (diferença da aula 01)

| Aula 01 | Aula 03 |
|---------|---------|
| `@openrouter/sdk` direto | `ChatOpenAI` + `baseURL` OpenRouter |
| Resposta texto livre | `createAgent` + `providerStrategy(Zod)` |
| Um passo | Dois passos LLM no mesmo grafo |

`modelKwargs` repete smart routing (`models[]`, `provider.sort`).

---

## Profissionais e dados seed

Três médicos em `appointmentService.ts`; duas consultas pré-cadastradas para testar cancelamento e conflito de horário.

O LLM precisa **casar nome → `professionalId`** usando a lista injetada no system prompt de `identifyIntent`.

---

## Contrato HTTP

**Entrada:**

```json
{ "question": "string com pelo menos 10 caracteres" }
```

**Saída (sucesso):** objeto de estado do grafo (JSON), por exemplo:

```json
{
  "intent": "cancel",
  "actionSuccess": true,
  "patientName": "Joao da Silva",
  "messages": [ ... ]
}
```

Erro 500: `{ "error": "An error occurred..." }`.

---

## Testes E2E

Arquivo: `tests/router.e2e.test.ts`

| Teste | Status | O que valida |
|-------|--------|--------------|
| Schedule success | `it.skip` | Agendamento completo (desabilitado) |
| Cancel success | ativo | Agenda depois cancela; `intent=cancel`, `actionSuccess=true` |

Requer `OPENROUTER_API_KEY` — chamadas reais ao modelo.

---

## Como rodar

```bash
cp .env.example .env
# OPENROUTER_API_KEY obrigatória

npm run dev
npm run test:e2e
npm run langgraph:serve   # inspecionar grafo
```

Exemplo:

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"Sou Joao da Silva e quero agendar com Dra. Ana Pereira para amanhã às 10h"}'
```

---

## Padrões que você pratica

1. **Prompt chaining** — vários prompts especializados em sequência
2. **Structured outputs** — Zod em cada chamada LLM crítica
3. **Separação LLM vs negócio** — LLM entende/redige; TS agenda/cancela
4. **Factory de nós** — `createXNode(deps)` para injeção e testes
5. **Prompts versionados** — pasta `prompts/v1/` evolui sem quebrar nós

---

## Takeaways

1. Nem tudo deve ser LLM — ações com regras fixas ficam em serviços TypeScript.
2. Extrair slots (médico, data, paciente) com schema reduz erro em português coloquial.
3. Sempre terminar com nó `message` unifica UX para sucesso, erro e `unknown`.
4. O grafo escala: nos módulos seguintes entram ferramentas, RAG e safeguard no mesmo esqueleto.

---

## Próximos passos sugeridos (estudo)

- Reativar e ajustar o teste de `schedule` skipped.
- Adicionar nó de “listar horários disponíveis”.
- Trocar array em memória por SQLite/Postgres.
- Comparar prompts em `v1` com LangSmith traces.
- Ver aula 04+ no módulo (mesmo stack, domínios diferentes).
