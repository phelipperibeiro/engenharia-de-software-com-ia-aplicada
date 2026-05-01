# Classroom — Aula 06 (Módulo 03)

Material de estudo da aula **Your Legacy API as MCP** — expor uma API REST legada (Fastify + MongoDB) como servidor MCP completo para agentes de IA.

| Arquivo | Conteúdo |
|---------|----------|
| [legacy-api.md](./legacy-api.md) | API REST em `nodejs-fastify-mongodb-crud/` |
| [arquitetura.md](./arquitetura.md) | Camadas domain → application → infrastructure → MCP |
| [mcp.md](./mcp.md) | Primitivos MCP aplicados ao CRUD de customers |
| [servidor.md](./servidor.md) | `customers-mcp-z`: tools, resource, prompt, testes |
| [resumo.md](./resumo.md) | Resumo da aula: fluxo, comandos e comparações |
| [mapa-mental.md](./mapa-mental.md) | Mapa mental em árvore + diagramas ASCII |

**Projetos relacionados:**

| Pasta | Papel |
|-------|-------|
| `nodejs-fastify-mongodb-crud/` | API legada (REST `:9999`) |
| `customers-mcp-z/` | Servidor MCP completo (solução) |
| `customers-mcp-template/` | Template inicial para praticar |

**Aulas relacionadas:**
- [02 google-trends-agent](../02-google-trends-agent/classroom/) — service → LangChain tool (sem MCP server)
- [05 MCP do zero](../05-mcps-do-zero-z/classroom/) — MCP com lógica local (CipherSuite)
- [01 multiple MCP tools](../01-multiple-mcp-tools-z/classroom/) — consumir MCP como cliente

Site oficial: [modelcontextprotocol.io](https://modelcontextprotocol.io)
