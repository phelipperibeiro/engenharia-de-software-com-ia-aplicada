# Publicação npm (Aula 08)

Transformar o MCP local em **pacote instalável** — distribuível para equipe (Verdaccio) ou comunidade (npmjs.org).

Projeto: `customers-mcp-z/package.json` + `src/index.ts`

---

## O que muda vs aula 07

| | Aula 07 | Aula 08 |
|---|---------|---------|
| Consumo | path local no mcp.json | **`npx @erickwendel/customers-mcp`** |
| Entry | `node src/index.ts` | **bin** com shebang `tsx` |
| Distribuição | repo git | **npm registry** |
| Registry privado | — | **Verdaccio :4873** |

---

## package.json — campos-chave

```json
{
  "name": "@erickwendel/customers-mcp",
  "version": "0.0.2",
  "main": "index.js",
  "bin": {
    "customers-mcp": "./src/index.ts"
  },
  "files": ["src"],
  "engines": { "node": "v24.14.0" }
}
```

| Campo | Função |
|-------|--------|
| `name` | escopo `@erickwendel/customers-mcp` |
| `bin` | comando CLI — MCP clients invocam via npx |
| `files` | só `src/` vai pro tarball (sem tests, docker) |
| `engines` | Node 24+ (TS nativo / tsx) |

---

## Shebang + tsx

`src/index.ts`:

```typescript
#!/usr/bin/env tsx

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
// ...
```

| Peça | Papel |
|------|-------|
| `#!/usr/bin/env tsx` | torna o arquivo executável como bin |
| `tsx` | roda TypeScript sem build step |
| `npm run build` | `chmod 755 src/index.ts` — permissão de execução |

Dependência: `"tsx": "^4.21.0"` em `dependencies` (não dev — precisa no runtime do bin).

---

## Scripts de release

```json
"registry:start": "docker compose up -d",
"registry:stop": "docker compose down",
"registry:login:private": "npm login --registry http://localhost:4873",
"release:private": "npm version patch && npm publish --registry http://localhost:4873",
"registry:login:public": "npm login --registry https://registry.npmjs.org/",
"release:public": "npm version patch && npm publish --access public --registry https://registry.npmjs.org/"
```

Fluxo típico (privado):

```bash
npm run registry:start
npm run registry:login:private
npm run release:private
```

`npm version patch` incrementa versão antes do publish.

---

## O que entra no pacote

```
customers-mcp-0.0.2.tgz
└── src/
    ├── index.ts          (bin entry)
    ├── mcp/
    ├── application/
    ├── infrastructure/
    └── domain/
```

**Não** incluído: `tests/`, `docker-compose.yaml`, `.vscode/`

---

## Public vs Private

| | Verdaccio (privado) | npmjs (público) |
|---|---------------------|-----------------|
| URL | `http://localhost:4873` | `https://registry.npmjs.org` |
| Uso | equipe, CI interno | open source |
| Login | `registry:login:private` | `registry:login:public` |
| Publish | `release:private` | `release:public --access public` |
| npx | `--registry http://localhost:4873` | padrão |

---

## Versão e consumo

Após publish, clientes usam:

```bash
npx -y @erickwendel/customers-mcp@latest
```

Com registry privado:

```bash
npx -y --registry http://localhost:4873 @erickwendel/customers-mcp@latest
```

Pin de versão: `@0.0.2` em vez de `@latest` em produção.

---

## Resumo em uma frase

**MCP vira pacote npm com bin tsx — publicável no Verdaccio local ou no registry público via scripts de release.**

Verdaccio: **[verdaccio.md](./verdaccio.md)**
