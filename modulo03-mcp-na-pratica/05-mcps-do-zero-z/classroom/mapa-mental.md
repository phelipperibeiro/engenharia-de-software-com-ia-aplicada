# Mapa mental — MCPs do Zero (Aula 05)

## Visão em árvore (texto)

```
MCPs do Zero — CipherSuite (Mod 03 / Aula 05)
│
├── Objetivo da aula
│   ├── Criar servidor MCP do zero
│   ├── Tools + Resource + Prompt
│   └── Transporte stdio
│
├── MCP (protocolo)
│   ├── Host → Client → Server
│   ├── JSON-RPC via stdin/stdout
│   ├── Detalhes: classroom/mcp.md
│   └── modelcontextprotocol.io
│
├── Primitivos
│   ├── Tool: encrypt_message, decrypt_message
│   ├── Resource: encryption://info
│   └── Prompt: encrypt_message_prompt
│
├── Implementação
│   ├── index.ts — connect transport
│   ├── mcp.ts — register*
│   ├── service.ts — AES-256-CBC
│   └── Detalhes: classroom/servidor.md
│
├── Schemas
│   ├── Zod inputSchema / outputSchema
│   ├── structuredContent
│   └── content (text)
│
├── Dev & teste
│   ├── npm run mcp:inspect
│   ├── npm test (Client stdio)
│   └── .vscode/mcp.json
│
├── Criptografia
│   ├── scrypt → chave 32 bytes
│   ├── IV aleatório
│   └── formato iv:ciphertext
│
└── Evolução curso
    ├── Mod02: consumir MCP (filesystem)
    └── Mod03: publicar MCP (esta aula)
```

---

## Mapa mental (visão radial)

```
                         +-----------------------------+
                         |   MCPs do Zero — CipherSuite|
                         +--------------+--------------+
                                        |
        +---------------+---------------+---------------+---------------+
        |               |               |               |               |
   +----+----+     +----+----+     +----+----+     +----+----+     +----+----+
   | MCP     |     | Tools   |     |Resource |     | Prompt  |     | Crypto  |
   +----+----+     +----+----+     +----+----+     +----+----+     +----+----+
        |               |               |               |               |
   stdio JSON-RPC   encrypt/decrypt  encryption://   encrypt tmpl   AES scrypt
   SDK server       Zod schemas      info doc        getPrompt      iv:cipher
        |               |               |               |               |
        +---------------+---------------+---------------+---------------+
                                        |
                    +-------------------+-------------------+
                    |                   |                   |
               +----+----+         +----+----+         +----+----+
               | VS Code |         |Inspector|         | Tests   |
               | mcp.json|         | npm run |         | Client  |
               +---------+         +---------+         +---------+
```

---

## Diagrama Host → Server

```
  +--------+     +-------------+     stdio      +------------------+
  | Usuário| --> | Host (IDE)  | --> JSON-RPC -> | MCP Server       |
  +--------+     | MCP Client  |     stdin/out   | ciphersuite-mcp  |
                 +-------------+                 +--------+---------+
                                                        |
                                                        v
                                                 +--------------+
                                                 | service.ts   |
                                                 | encrypt/dec  |
                                                 +--------------+
```

---

## Três primitivos (ASCII)

```
                    +------------------+
                    |   MCP Server     |
                    +--------+---------+
                             |
         +-------------------+-------------------+
         |                   |                   |
         v                   v                   v
  +-------------+    +-------------+    +-------------+
  |   TOOLS     |    |  RESOURCES  |    |   PROMPTS   |
  | (ações)     |    | (leitura)   |    | (templates) |
  +-------------+    +-------------+    +-------------+
  encrypt_message   encryption://     encrypt_message_
  decrypt_message   info              prompt
```

---

## Fluxo callTool (encrypt)

```
  MCP Client                    MCP Server
      |                              |
      | callTool(encrypt_message)    |
      |----------------------------->|
      |                              | validate Zod
      |                              | encrypt(msg, key)
      |  structuredContent + content |
      |<-----------------------------|
      |                              |
```

---

## Ciclo encrypt → decrypt

```
  "Hello" + senha "abc"
        |
        v
  encrypt_message
        |
        v
  "a1b2...:c3d4..."  (iv:ciphertext)
        |
        v
  decrypt_message (+ mesma senha "abc")
        |
        v
  "Hello"
```

---

## Ligação arquivo ↔ conceito

| Conceito | Arquivo |
|----------|---------|
| Bootstrap stdio | `src/index.ts` |
| Tools/Resource/Prompt | `src/mcp.ts` |
| AES + scrypt | `src/service.ts` |
| Config VS Code | `.vscode/mcp.json` |
| Client de teste | `tests/helpers.ts` |
| E2E MCP | `tests/mcp.test.ts` |

---

## Consumer vs Producer

```
  MODULO 02 (aula 05 safeguard)          MODULO 03 (esta aula)
  -------------------------------        ---------------------------
  LangGraph agent                        McpServer puro
  getMCPTools(filesystem)                registerTool(encrypt...)
  LLM escolhe tool externa               VOCÊ define as tools
```

---

## Comandos rápidos

```
npm start              → servidor stdio
npm run mcp:inspect    → UI http://localhost:5173
npm test               → Client SDK E2E
npm run dev            → watch + debug
```
