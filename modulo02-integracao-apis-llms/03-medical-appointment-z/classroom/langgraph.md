# LangGraph nesta aula (03) — Agendamento médico

Esta aula **une** o que você viu na 02 (grafo, estado, arestas condicionais) com **LLM real** (OpenRouter) em dois nós e **lógica de negócio** em TypeScript nos outros.

---

## Prompt chaining (encadeamento)

O fluxo não é um único prompt gigante. São **etapas encadeadas**, cada uma com prompt e responsabilidade própria:

```
Etapa 1: identifyIntent   → extrai intenção + slots (médico, data, paciente)
Etapa 2: schedule | cancel → executa ação no “banco” em memória
Etapa 3: message           → redige resposta humana com base no resultado
```

Vantagens:

- Prompts menores e mais focados
- Validação Zod entre etapas
- Ações críticas (agendar/cancelar) em código determinístico

---

## Estado do grafo (`GraphState`)

| Campo | Uso |
|-------|-----|
| `messages` | Histórico (`HumanMessage` + `AIMessage` final) |
| `intent` | `schedule` \| `cancel` \| `unknown` |
| `patientName`, `professionalId`, `professionalName` | Extraídos pelo LLM |
| `datetime`, `reason` | Data/hora ISO e motivo da consulta |
| `actionSuccess`, `actionError` | Resultado de schedule/cancel |
| `appointmentData` | Objeto da consulta criada |
| `error` | Falha na identificação de intenção |

Definido em `graph.ts` com Zod + `MessagesZodMeta`.

---

## Nós do grafo

| Nó | Tipo | Função |
|----|------|--------|
| `identifyIntent` | LLM + Zod | Classifica intenção e preenche campos a partir do texto |
| `schedule` | Código | Valida campos → `bookAppointment()` |
| `cancel` | Código | Valida campos → `cancelAppointment()` |
| `message` | LLM + Zod | Gera mensagem final (`schedule_success`, `cancel_error`, etc.) |

Factory pattern: `createIdentifyIntentNode(llm)`, `createSchedulerNode(service)`, etc. — facilita testes e injeção de dependência (como na aula 02).

---

## Fluxo e roteamento

```
START → identifyIntent
            │
            ├── intent = schedule  → schedule  ──┐
            ├── intent = cancel    → cancel    ──┼→ message → END
            └── unknown / error    → message   ──┘
```

Regra em `addConditionalEdges`:

- Se `error` ou `intent` ausente/`unknown` → vai direto para `message` (sem agendar/cancelar)
- Senão → `schedule` ou `cancel`, depois sempre `message`

---

## Prompts versionados (`prompts/v1/`)

| Arquivo | Consumido por |
|---------|----------------|
| `identifyIntent.ts` | `identifyIntentNode` — lista de profissionais, regras, exemplos em JSON |
| `messageGenerator.ts` | `messageGeneratorNode` — tom de recepcionista, cenários `schedule_success`, etc. |

Os prompts são **templates JSON** (`getSystemPrompt`, `getUserPromptTemplate`), não strings soltas no nó — padrão reutilizável no módulo.

---

## Domínio: profissionais e agenda

`AppointmentService` mantém array em memória:

| ID | Profissional | Especialidade |
|----|--------------|---------------|
| 1 | Dr. Alicio da Silva | Cardiologia |
| 2 | Dra. Ana Pereira | Dermatologia |
| 3 | Dra. Carol Gomes | Neurologia |

Consultas seed (ex.): João hoje 11h com Dr. Alicio; Luana amanhã 14h com Dra. Ana.

Métodos:

- `checkAvailability` / `bookAppointment`
- `cancelAppointment` (exige match de profissional + data + paciente)

---

## API HTTP

`POST /chat` com `question` (mín. 10 caracteres).

Diferente da aula 02: a resposta é o **estado completo do grafo** (JSON), não só uma string — inclui `intent`, `actionSuccess`, `messages`, etc.

---

## LangGraph CLI

`langgraph.json`:

```json
"graphs": { "medical_appointments": "./src/graph/factory.ts:graph" }
```

```bash
npm run langgraph:serve
```

---

## Evolução em relação à aula 02

| Aula 02 | Aula 03 |
|---------|---------|
| `includes('upper')` | LLM + `IntentSchema` |
| `command` | `intent` + campos de agendamento |
| Nós só transformam texto | Nós executam negócio + 2 chamadas LLM |
| Testes sem API | E2E com OpenRouter real |

---

## Resumo em uma frase

**LangGraph orquestra um pipeline em 3 etapas**: entender (LLM) → agir (código) → comunicar (LLM).

Base conceitual da aula 02: [02-langchain-intro/classroom/langgraph.md](../02-langchain-intro/classroom/langgraph.md).
