# OpenRouter nesta aula (05)

Site oficial: **[openrouter.ai](https://openrouter.ai/)**

Esta aula usa **dois modelos** via OpenRouter — papéis diferentes na defesa.

---

## Dois modelos, duas funções

| Uso | Modelo (config) | Método |
|-----|-----------------|--------|
| **Chat + tools** | `qwen/qwen-2.5-7b-instruct` | `generate()` → agent com MCP |
| **Guardrails** | `openai/gpt-oss-safeguard-20b` | `checkGuardRails()` |

```typescript
// config.ts
models: ['qwen/qwen-2.5-7b-instruct'],  // comentário no código: "unsafe!" para demo
guardrailsModel: 'openai/gpt-oss-safeguard-20b',
```

O chat model é propositalmente mais vulnerável para a demonstração funcionar com `--unsafe`. O safeguard é especializado em classificar entrada.

---

## Cliente LangChain

`openRouterService.ts`:

- `ChatOpenAI` + `baseURL: https://openrouter.ai/api/v1`
- `modelKwargs`: `models[]` + `provider.sort` (preço no chat)
- Dois clientes: `llmClient` e `safeGuardModel`

---

## `generate()` — chat com ferramentas

1. Carrega tools MCP (`getMCPTools()` — filesystem)
2. `createAgent({ model, tools })`
3. Envia `SystemMessage` + `HumanMessage`
4. Retorna texto da última mensagem

O LLM pode invocar leitura de arquivos se o prompt do usuário convencer o modelo (especialmente em modo unsafe).

---

## `checkGuardRails()` — portão de segurança

```typescript
if (!enabled) return { safe: true, reason: 'Guardrails disabled' }
```

Fluxo quando habilitado:

1. Formata `prompts/guardrails.txt` com `{USER_INPUT}`
2. Invoca **apenas** `safeGuardModel`
3. Se resposta começa com `UNSAFE` → `{ safe: false, analysis }`
4. Senão → `{ safe: true }`

**Importante:** em `guardrailsCheckNode`, o `USER_INPUT` enviado ao safeguard é `systemPrompt + '\n' + userPrompt` — o classificador vê contexto de papel + mensagem do usuário.

---

## Variáveis de ambiente

```
OPENROUTER_API_KEY=...
```

Sem chave, nada roda.

---

## OpenRouter vs confiar no system prompt

| Abordagem | Limitação |
|-----------|-----------|
| Só system prompt | Injection pode sobrescrever mentalmente as regras |
| Safeguard antes do chat | Malicious input não chega ao agent com tools |

---

## Resumo em uma frase

**OpenRouter alimenta o agente conversacional com MCP e um modelo safeguard separado que classifica SAFE/UNSAFE antes da resposta.**

Plataforma: [openrouter.ai/models](https://openrouter.ai/models) — busque `gpt-oss-safeguard` e modelos de chat.

Mais contexto: [aula 01 — openrouter.md](../01-smart-model-router-gateway/classroom/openrouter.md).
