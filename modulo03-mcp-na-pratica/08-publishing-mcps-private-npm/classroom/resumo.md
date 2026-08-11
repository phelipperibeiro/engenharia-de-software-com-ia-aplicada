# Aula 08 — Publishing MCPs (Private NPM)

## Contexto no curso

Oitava pasta do **Módulo 03**. Depois de MCP autenticado (aula 07), você **empacota e distribui** o servidor como pacote npm.

> Material: **[publicacao.md](./publicacao.md)** · **[verdaccio.md](./verdaccio.md)** · **[consumo.md](./consumo.md)**

---

## O que você está estudando

Como transformar `customers-mcp-z` em **`@erickwendel/customers-mcp`** — instalável via `npx` por qualquer client MCP (VS Code, Cursor, LangChain).

---

## Mudanças principais no pacote

| Item | Detalhe |
|------|---------|
| `bin` | `customers-mcp` → `./src/index.ts` |
| Shebang | `#!/usr/bin/env tsx` |
| `files` | só `src/` no tarball |
| `tsx` | dependency de runtime |
| Scripts | `release:private`, `release:public` |
| Docker | Verdaccio `:4873` |

---

## Comandos essenciais

```bash
# API (mesma da aula 07)
cd nodejs-fastify-mongodb-crud-z
docker compose up -d mongodb && npm start

# Publish local
cd customers-mcp-z
npm run registry:start
npm run registry:login:private
npm run release:private

# Consumir
SERVICE_TOKEN=$(./getServiceToken.sh | ...) 
npx -y @erickwendel/customers-mcp@latest
```

---

## Pipeline completo Módulo 03 (customers)

```
06 → MCP local, API aberta
07 → + auth, SERVICE_TOKEN
08 → + npm publish, npx consume
09 → LangGraph consome pacote npm
```

---

## Takeaways

1. **bin + shebang** — MCP executável como CLI npm
2. **files** — controlar o que vai pro pacote
3. **Verdaccio** — registry privado para equipes
4. **semver** — `npm version patch` antes do publish
5. **npx** — distribuição zero-install para IDEs
6. **SERVICE_TOKEN** — continua obrigatório (pacote não traz credencial)

---

## Próximos passos

- Publicar no npm público (`release:public`)
- Pin versão fixa em produção (`@0.0.2`)
- Integrar em LangGraph (aula 09)

---

## Evolução Módulo 03

| Aula | Tema |
|------|------|
| 07 | Auth + rate limit |
| **08** | **Publish npm / Verdaccio** |
| 09 | MCP + LangChain |
