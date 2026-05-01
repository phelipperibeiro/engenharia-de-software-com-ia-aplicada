# O que é MCP? (Model Context Protocol)

Protocolo aberto para conectar **aplicações de IA** (Cursor, VS Code Copilot, Claude Desktop) a **fontes de dados e ferramentas externas** de forma padronizada.

Site: **[modelcontextprotocol.io](https://modelcontextprotocol.io)**

---

## Analogia para devs juniores

```
Sem MCP:
  cada IDE/agente integra API diferente, formato diferente, auth diferente

Com MCP:
  você escreve UM servidor MCP
  qualquer cliente compatível descobre tools/resources/prompts e usa
```

O LLM não acessa seu banco ou filesystem direto — o **cliente MCP** chama seu servidor, que executa a ação e devolve o resultado.

---

## Papéis

| Papel | Quem é nesta aula | Função |
|-------|-------------------|--------|
| **Host** | VS Code / Cursor | App que roda o chat |
| **Client** | Copilot / Agent | Fala JSON-RPC com o servidor |
| **Server** | `src/index.ts` + `mcp.ts` | Expõe capabilities (tools, etc.) |

```
Usuário → Host (IDE) → MCP Client → stdio → MCP Server (seu Node)
                                              │
                                              v
                                         encrypt/decrypt
```

---

## Três primitivos (neste projeto)

### 1. Tools (ferramentas)

**Ações** que o LLM pode invocar.

| Tool | O que faz |
|------|-----------|
| `encrypt_message` | Criptografa texto → `iv:ciphertext` |
| `decrypt_message` | Reverte com mesma senha |

O modelo lê `name` + `description` para decidir **quando** chamar.

Registro: `server.registerTool(name, { description, inputSchema, outputSchema }, handler)`

---

### 2. Resources (recursos)

**Dados somente leitura** — como documentação ou config.

| Resource | URI |
|----------|-----|
| Info de criptografia | `encryption://info` |

Cliente: `listResources()` → `readResource(uri)`

Registro: `server.registerResource(name, uri, { description }, handler)`

**Diferença Tool vs Resource:** Tool **executa** algo; Resource **retorna** conteúdo fixo/dinâmico sem "ação de negócio" pesada.

---

### 3. Prompts (templates)

**Mensagens prontas** para orientar o LLM.

| Prompt | Uso |
|--------|-----|
| `encrypt_message_prompt` | Template: "criptografe X com senha Y usando a tool" |

Cliente: `getPrompt({ name, arguments })`

Registro: `server.registerPrompt(name, { description, argsSchema }, handler)`

---

## Transporte: stdio

Este servidor usa **StdioServerTransport**:

```typescript
const transport = new StdioServerTransport()
await server.connect(transport)
```

- Cliente **spawna** o processo Node (`node src/index.ts`)
- Comunicação via **stdin/stdout** (JSON-RPC)
- Logs vão para **stderr** (`console.error`) — não poluem o protocolo

Alternativas em outros projetos: HTTP, SSE.

---

## Schemas com Zod

Cada tool define:

- `inputSchema` — o que o cliente deve enviar
- `outputSchema` — formato estruturado da resposta (`structuredContent`)

O SDK valida e documenta para o LLM entender os campos.

---

## Inspector e testes

| Ferramenta | Comando | Para quê |
|------------|---------|----------|
| MCP Inspector | `npm run mcp:inspect` | UI web para testar tools/resources |
| Testes | `npm test` | Client SDK + stdio (CI) |

Inspector: [modelcontextprotocol.io/docs/tools/inspector](https://modelcontextprotocol.io/docs/tools/inspector)

---

## VS Code / Cursor

`.vscode/mcp.json`:

```json
{
  "servers": {
    "ciphersuite-mcp": {
      "command": "node",
      "args": ["--experimental-strip-types", "src/index.ts"]
    }
  }
}
```

Reload da janela → Copilot Agent enxerga as tools.

---

## MCP consumer vs producer

| | Módulo 02 aula 05 | Módulo 03 aula 05 |
|---|-------------------|-------------------|
| Papel | Consumir `@modelcontextprotocol/server-filesystem` | Criar `@erickwendel/ciphersuite-mcp` |
| Código | `mcpService.ts` + LangGraph agent | `mcp.ts` + `McpServer` |
| Tools | Ler arquivos | encrypt / decrypt |

---

## Resumo em uma frase

**MCP padroniza como IAs chamam suas tools, leem seus resources e usam seus prompts — nesta aula você implementa os três do zero.**

Implementação deste repo: **[servidor.md](./servidor.md)**
