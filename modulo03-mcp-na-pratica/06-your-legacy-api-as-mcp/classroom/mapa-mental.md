# Mapa mental — Your Legacy API as MCP (Aula 06)

## Visão em árvore

```
Your Legacy API as MCP (Aula 06)
│
├── Projetos
│   ├── nodejs-fastify-mongodb-crud (API :9999)
│   ├── customers-mcp-z (solução MCP)
│   └── customers-mcp-template (starter)
│
├── API legada
│   ├── Fastify + MongoDB
│   ├── GET/POST/PUT/DELETE /v1/customers
│   └── docker compose mongodb
│
├── Camadas MCP
│   ├── domain/ (Zod schemas)
│   ├── application/ (CustomerService)
│   ├── infrastructure/ (HttpClient)
│   └── mcp/ (tools, resource, prompt)
│
├── Tools (5)
│   ├── list_customers
│   ├── get_customer
│   ├── create_customer
│   ├── update_customer
│   └── delete_customer
│
├── Resource
│   └── customers://api-info
│
├── Prompt
│   └── find_customer_prompt
│
├── Transporte
│   ├── stdio (index.ts)
│   └── .vscode/mcp.json
│
└── Testes
    ├── StdioClientTransport
    └── tools / resources / prompts
```

---

## Fluxo end-to-end

```
  Agente IA
      |
      | MCP JSON-RPC (stdio)
      v
+---------------+
| customers-mcp |
+-------+-------+
        |
        | CustomerService
        v
+---------------+
| HttpClient    |
+-------+-------+
        |
        | fetch HTTP
        v
+---------------+
| Fastify API   |----> MongoDB
| :9999/v1      |
+---------------+
```

---

## Camadas

```
+----------+
|   MCP    |  registerTool, registerResource, registerPrompt
+----+-----+
     |
+----v-----+
|Application| findCustomer (fuzzy match)
+----+-----+
     |
+----v--------+
|Infrastructure| fetch REST
+----+--------+
     |
+----v--------+
| Legacy API  |
+-------------+
```

---

## Três padrões MCP (Módulo 03)

```
Consumir (01)          Criar local (05)       Proxy legacy (06)
     |                       |                      |
MultiServerMCPClient    CipherSuite MCP      customers-mcp-z
LangGraph agent         encrypt/decrypt      CRUD REST wrapper
```

---

## Tools CRUD

```
list_customers ──> GET  /customers
get_customer   ──> GET  /customers/:id  OR fuzzy list
create_customer──> POST /customers
update_customer──> PUT  /customers/:id
delete_customer──> DELETE /customers/:id
```

---

## Primitivos MCP

```
+--------+----------------------------------+
| Tools  | Executar operações (CRUD)        |
| Resource| Documentar API (api-info)       |
| Prompt | Template find_customer_prompt    |
+--------+----------------------------------+
```

---

## Resposta de tool

```
{
  content: [{ type: "text", text: "..." }],     ← LLM lê
  structuredContent: { customers: [...] },       ← validado Zod
  isError?: true                                  ← falha graceful
}
```

---

## Setup local

```
Terminal 1                    Terminal 2
-----------                   -----------
docker compose up mongodb     cd customers-mcp-z
npm start (API :9999)         npm test / mcp:inspect
                              VS Code mcp.json
```

---

## Arquivos-chave

| Camada | Arquivo |
|--------|---------|
| Entry | `customers-mcp-z/src/index.ts` |
| Wiring | `customers-mcp-z/src/mcp/server.ts` |
| Service | `application/customerService.ts` |
| HTTP | `infrastructure/customerHttpClient.ts` |
| Schemas | `domain/customer.ts` |
| API | `nodejs-fastify-mongodb-crud/src/index.js` |
