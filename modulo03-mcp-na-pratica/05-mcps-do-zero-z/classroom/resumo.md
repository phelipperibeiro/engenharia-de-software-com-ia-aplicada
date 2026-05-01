# Aula 05 — MCPs do Zero (CipherSuite)

## Contexto no curso

Quinta aula do **Módulo 03 (MCP na prática)**. Você deixa de apenas **consumir** MCP (como no LangGraph + filesystem do módulo 02) e passa a **publicar** seu próprio servidor.

> Material: **[mcp.md](./mcp.md)** · **[servidor.md](./servidor.md)**

---

## O que você está construindo

Servidor MCP **`@erickwendel/ciphersuite-mcp`** que expõe:

| Primitivo | Nome | Função |
|-----------|------|--------|
| Tool | `encrypt_message` | Criptografar texto |
| Tool | `decrypt_message` | Descriptografar |
| Resource | `encryption://info` | Doc do algoritmo |
| Prompt | `encrypt_message_prompt` | Template para o agente |

Domínio escolhido de propósito **simples**: foco no **protocolo MCP**, não em regra de negócio complexa.

---

## Por que criptografia como exemplo?

- Entrada/saída claras (string → string)
- Erros fáceis de testar (senha errada, formato inválido)
- Resource com documentação técnica faz sentido
- Prompt encadeia naturalmente com a tool encrypt

---

## Arquitetura

```
VS Code / Inspector / Test Client
        │
        │  JSON-RPC via stdio
        v
   index.ts (transport)
        │
        v
   mcp.ts (register*)
        │
        v
   service.ts (AES-256-CBC + scrypt)
```

Sem HTTP, sem LangGraph nesta aula — **servidor MCP puro**.

---

## Fluxo: Tool encrypt

1. Cliente chama `callTool({ name: 'encrypt_message', arguments: { message, encryptionKey } })`
2. SDK valida schema Zod
3. Handler chama `encrypt(message, encryptionKey)`
4. Retorna `structuredContent.encryptedMessage` + `content` texto
5. LLM mostra resultado ao usuário

---

## Fluxo: Resource

1. `listResources()` → aparece `encryption://info`
2. `readResource({ uri: 'encryption://info' })` → texto com AES, scrypt, formato iv:ciphertext

---

## Fluxo: Prompt

1. `getPrompt({ name: 'encrypt_message_prompt', arguments: { message, encryptionKey } })`
2. Retorna `messages[]` prontas para o chat
3. Agente segue instrução e chama a tool

---

## Como rodar

```bash
npm install

# Servidor (stdio — clientes MCP iniciam sozinhos)
npm start

# Inspector visual
npm run mcp:inspect

# Testes
npm test
```

### VS Code

1. `.vscode/mcp.json` já configurado
2. Reload window
3. Copilot Chat (Agent) → pedir encrypt/decrypt

---

## Criptografia (resumo)

| Item | Valor |
|------|-------|
| Algoritmo | AES-256-CBC |
| Chave | scrypt(passphrase, salt fixo, 32 bytes) |
| Formato | `ivHex:cipherHex` |
| IV | Novo a cada encrypt |

Detalhes: resource `encryption://info` ou **[servidor.md](./servidor.md)**.

---

## Testes E2E MCP

`tests/mcp.test.ts` usa **Client SDK** real (stdio):

- Encrypt produz string não vazia
- Decrypt recupera mensagem original
- Resource listado
- Prompt com texto esperado

Padrão reutilizável: `createTestClient()` em `helpers.ts`.

---

## Descriptions em PT-BR

Em `mcp.ts`, descriptions e comentários explicam MCP para **devs juniores** — o LLM usa descriptions para escolher tools; humanos usam comentários de bloco para aprender.

---

## Takeaways

1. **MCP = contrato** entre agente e suas capabilities
2. **Tools** executam; **Resources** informam; **Prompts** padronizam fluxo
3. **stdio** é o transporte mais comum em IDEs locais
4. **Zod** documenta e valida input/output
5. **structuredContent** + `content` — máquina e humano/LLM
6. **Inspector + testes** — desenvolva MCP sem depender só do chat
7. Próximo passo no curso: publicar npm / integrar em agentes reais

---

## Comparação módulos

| | Mod 02 / safeguard | Mod 03 / esta aula |
|---|-------------------|-------------------|
| MCP | Cliente (filesystem) | Servidor (cipher) |
| Framework | LangGraph + agent | SDK puro |
| Objetivo | Segurança + tools | Criar MCP do zero |

---

## Próximos passos sugeridos (estudo)

- Adicionar `decrypt_message_prompt`
- Tool `hash_message` (SHA-256) como exercício
- Publicar pacote `npx @erickwendel/ciphersuite-mcp`
- Conectar este MCP a um agente LangGraph (consumidor)

---

## Links

- [MCP Docs](https://modelcontextprotocol.io)
- [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector)
- [SDK npm](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
