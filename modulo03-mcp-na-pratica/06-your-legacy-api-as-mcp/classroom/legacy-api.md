# API legada (Aula 06)

A pasta `nodejs-fastify-mongodb-crud/` simula um **sistema existente** que você não reescreve — apenas **embrulha** com MCP.

---

## O que é

API REST de CRUD de clientes:

| Camada | Tecnologia |
|--------|------------|
| HTTP | Fastify |
| Banco | MongoDB |
| Porta | `9999` |
| Prefixo | `/v1` |

---

## Endpoints

Base: `http://localhost:9999/v1`

| Método | Rota | Ação |
|--------|------|------|
| GET | `/health` | Health check |
| GET | `/customers` | Listar todos |
| GET | `/customers/:id` | Buscar por ID |
| POST | `/customers` | Criar `{ name, phone }` |
| PUT | `/customers/:id` | Atualizar |
| DELETE | `/customers/:id` | Remover |

Shape do customer: `{ _id, name, phone }` (MongoDB ObjectId como `_id`).

---

## Subir a API

```bash
cd nodejs-fastify-mongodb-crud
docker compose up -d mongodb
npm ci
npm start
```

Health check:

```bash
curl http://localhost:9999/v1/health
```

Exemplo create:

```bash
curl -X POST http://localhost:9999/v1/customers \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "phone": "123456789"}'
```

---

## Por que “legada”?

Características típicas de APIs reais que agentes precisam integrar:

- Já roda em produção (você não controla o código do LLM)
- REST simples com convenções próprias
- MongoDB com `_id` ObjectId
- Sem documentação OpenAPI exposta ao agente (até você criar o MCP)

O MCP **não substitui** a API — adiciona uma **camada de descoberta e execução** para IAs.

---

## Relação com o MCP

```
Copilot / Cursor Agent
        |
        | MCP stdio
        v
customers-mcp-z  ----HTTP fetch---->  localhost:9999/v1/customers
```

O servidor MCP em `customers-mcp-z` usa `CustomerHttpClient` apontando para `http://localhost:9999/v1`.

---

## Resumo em uma frase

**API Fastify+MongoDB na porta 9999 — alvo HTTP que o servidor MCP traduz em tools para agentes.**

Arquitetura MCP: **[arquitetura.md](./arquitetura.md)**
