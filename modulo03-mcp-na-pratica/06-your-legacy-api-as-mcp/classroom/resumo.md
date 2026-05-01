# Aula 06 — Your Legacy API as MCP

## Contexto no curso

Última pasta prática do **Módulo 03**. Você aprende a **envolver uma API REST existente** num servidor MCP completo — o padrão de produção quando o backend legado continua rodando e agentes precisam de acesso estruturado.

> Material: **[legacy-api.md](./legacy-api.md)** · **[arquitetura.md](./arquitetura.md)** · **[mcp.md](./mcp.md)** · **[servidor.md](./servidor.md)**

---

## O que você está estudando

Dois projetos que trabalham juntos:

1. **`nodejs-fastify-mongodb-crud`** — API REST de customers (Fastify + MongoDB, porta 9999)
2. **`customers-mcp-z`** — servidor MCP que expõe CRUD como tools + resource + prompt

Há também **`customers-mcp-template`** como ponto de partida vazio.

---

## Fluxo completo

```
Agente (Copilot/Cursor)
        |
        | MCP stdio
        v
customers-mcp-z
   ├── tools (CRUD)
   ├── resource (api-info)
   └── prompt (find_customer)
        |
        | HTTP fetch
        v
API legada :9999/v1/customers
        |
        v
    MongoDB
```

---

## Capabilities MCP

| Tipo | Nome | Ação |
|------|------|------|
| Tool | `list_customers` | Listar |
| Tool | `get_customer` | Buscar (id/name/phone) |
| Tool | `create_customer` | Criar |
| Tool | `update_customer` | Atualizar |
| Tool | `delete_customer` | Remover |
| Resource | `customers://api-info` | Docs da API |
| Prompt | `find_customer_prompt` | Busca guiada |

---

## Arquitetura em camadas

```
mcp/          → registro tools, prompts, resources
application/  → CustomerService (findCustomer fuzzy)
infrastructure/ → CustomerHttpClient (fetch)
domain/       → schemas Zod
```

---

## Comandos essenciais

```bash
# 1. API legada
cd nodejs-fastify-mongodb-crud
docker compose up -d mongodb
npm ci && npm start

# 2. Testes MCP (API deve estar up)
cd ../customers-mcp-z
npm install
npm test

# 3. Inspector interativo
npm run mcp:inspect

# 4. VS Code — configurar .vscode/mcp.json e reload
```

---

## Comparação no Módulo 03

| Aula | Integração | Backend |
|------|------------|---------|
| 01 | Consome MCP (client) | MongoDB via MCP |
| 02 | LangChain tool nativa | SerpAPI |
| 05 | Cria MCP (local) | crypto in-process |
| **06** | **Cria MCP (proxy)** | **REST legada :9999** |

---

## Decisão: tool nativa vs MCP server?

| Critério | Tool nativa (02) | MCP server (06) |
|----------|------------------|-----------------|
| API externa legada | adaptador fino no agent | **servidor dedicado** |
| Reuso entre IDEs | difícil | **stdio, qualquer client MCP** |
| Documentação p/ LLM | prompt manual | **resource + descriptions** |
| CRUD completo | verboso no agent | **1 tool por operação** |
| Equipes separadas | acoplado ao LangGraph | **MCP independente** |

---

## Takeaways

1. **Não reescreva a API** — embrulhe com MCP
2. **Camadas** — domain/application/infrastructure/mcp
3. **structuredContent + outputSchema** — validação de saída das tools
4. **Resource** — agente descobre endpoints sem adivinhar
5. **Prompt** — workflows reutilizáveis (`find_customer_prompt`)
6. **Testes** — MCP Client stdio contra servidor real
7. **DI** — `CustomerService` injetado em cada `register*Tool`

---

## Próximos passos

- Implementar auth (API key) na camada infrastructure
- Publicar como pacote npm (`npx @erickwendel/ew-customers-mcp`)
- Consumir este MCP num agente LangGraph (padrão aula 01)
- Estender resource com exemplos curl

---

## Evolução Módulo 03

| Aula | Tema |
|------|------|
| 01 | Consumir multiple MCP |
| 02 | Service → LangChain tool |
| 03 | Custom agents |
| 04 | Skills |
| 05 | MCP do zero (local) |
| **06** | **Legacy API as MCP** |
