# Servidor CipherSuite MCP (implementação)

Pacote: `@erickwendel/ciphersuite-mcp` — servidor educacional que demonstra **Tools + Resource + Prompt** com lógica real (criptografia).

---

## Estrutura de arquivos

```
src/
  index.ts    # Bootstrap: StdioServerTransport + connect
  mcp.ts      # registerTool / registerResource / registerPrompt
  service.ts  # encrypt() e decrypt() — Node crypto
tests/
  helpers.ts  # Client MCP via stdio para testes
  mcp.test.ts # encrypt, decrypt, resource, prompt
.vscode/
  mcp.json    # Config para VS Code Copilot
```

---

## index.ts — ponto de entrada

1. Importa `server` de `mcp.ts`
2. Cria `StdioServerTransport`
3. `server.connect(transport)`
4. Log em stderr: "Encrypt MCP Server running on stdio"

Todo cliente MCP executa este arquivo como subprocesso.

---

## service.ts — lógica de negócio

| Função | Detalhe |
|--------|---------|
| `encrypt(text, passphrase)` | AES-256-CBC |
| `decrypt(iv:ciphertext, passphrase)` | Inverso |

**Derivação de chave:**

```
scryptSync(passphrase, 'mcp-encrypter-salt', 32) → chave 32 bytes
```

**Saída:**

```
<IV 16 bytes em hex>:<ciphertext em hex>
```

- IV aleatório a cada encrypt → mesma mensagem gera saídas diferentes
- Mesma senha obrigatória para decrypt

A lógica fica **fora** do handler MCP — facilita testar `service.ts` isolado se quiser.

---

## mcp.ts — registro MCP

### Tool `encrypt_message`

**Entrada:** `message`, `encryptionKey`  
**Saída:** `content` (texto) + `structuredContent.encryptedMessage`  
**Erro:** `isError: true` + mensagem amigável

### Tool `decrypt_message`

**Entrada:** `encryptedMessage`, `encryptionKey`  
**Saída:** `decryptedMessage`

### Resource `encryption://info`

Texto explicando algoritmo, scrypt, formato iv:ciphertext.

### Prompt `encrypt_message_prompt`

Monta mensagem user pedindo ao agente usar `encrypt_message`.

> Nota: README menciona `decrypt_message_prompt`; o código atual registra apenas `encrypt_message_prompt`.

---

## Resposta de uma Tool (formato)

```typescript
return {
  content: [{ type: "text", text: "..." }],      // legível pelo LLM
  structuredContent: { encryptedMessage: "..." } // tipado / testes
}
```

Erro:

```typescript
return {
  isError: true,
  content: [{ type: "text", text: "Failed to..." }]
}
```

---

## Testes (`tests/`)

`createTestClient()`:

1. Spawna `node --experimental-strip-types src/index.ts`
2. `StdioClientTransport` + `Client.connect`
3. Chama `callTool`, `listResources`, `getPrompt`

Cenários:

- Encrypt retorna string longa (> 60 chars)
- Decrypt round-trip igual à mensagem original
- Resource `encryption://info` listado
- Prompt no formato esperado

---

## Scripts npm

| Script | Uso |
|--------|-----|
| `npm start` | Servidor (clientes MCP) |
| `npm run dev` | Watch + inspect |
| `npm test` | Suite E2E MCP |
| `npm run mcp:inspect` | Inspector UI |

---

## Usar no Copilot Chat (exemplos)

```
Encrypt the message "Hello, World!" using the passphrase "my-secret-key"
```

```
Decrypt this message: <iv:ciphertext> using the passphrase "my-secret-key"
```

```
Show me the encryption://info resource
```

---

## Dependências

| Pacote | Papel |
|--------|------|
| `@modelcontextprotocol/sdk` | `McpServer`, transport, client |
| `zod` | Schemas input/output |

Node **v24+** — TypeScript nativo (`--experimental-strip-types`).

---

## Resumo em uma frase

**index.ts liga stdio ao McpServer; mcp.ts declara as capabilities; service.ts faz AES; testes provam o protocolo de ponta a ponta.**

Conceitos MCP: **[mcp.md](./mcp.md)**
