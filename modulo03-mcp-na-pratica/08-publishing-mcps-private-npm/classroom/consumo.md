# Consumindo o MCP publicado (Aula 08)

Depois do publish, clientes **não clonam o repo** — usam `npx` com env vars.

---

## VS Code / Cursor

`.vscode/mcp.json` (config ativa no repo):

```json
{
  "servers": {
    "customers-mcp": {
      "command": "npx",
      "args": ["-y", "@erickwendel/customers-mcp@latest"],
      "env": {
        "SERVICE_TOKEN": "<uuid-do-service-token>"
      }
    }
  }
}
```

| Campo | Função |
|-------|--------|
| `command: npx` | baixa e executa o pacote |
| `-y` | aceita install automático |
| `@latest` | versão mais recente |
| `SERVICE_TOKEN` | auth na API (aula 07) |

Reload window após alterar.

---

## Obter SERVICE_TOKEN

Com API rodando:

```bash
./getServiceToken.sh
```

Ou manualmente:

```bash
curl -X POST http://localhost:9999/v1/auth/service-token \
  -H "Content-Type: application/json" \
  -d '{"username":"erickwendel","password":"123123","adminSuperSecret":"AM I THE BOSS?"}'
```

---

## Pré-requisitos runtime

```
1. Node v24+
2. API customers :9999 (docker compose + npm start)
3. SERVICE_TOKEN válido (admin para CRUD)
4. Pacote publicado (Verdaccio ou npm público)
```

O MCP publicado **não inclui** a API — só o wrapper MCP.

---

## npx vs path local

| | Path local (aula 07) | npx (aula 08) |
|---|----------------------|---------------|
| mcp.json | `node ./src/index.ts` | `npx @erickwendel/customers-mcp` |
| Update | git pull | `npm publish` + `@latest` |
| Equipe | clone repo | `npm install` / npx |
| Versionamento | commit | semver npm |

---

## Inspector

Testar pacote publicado:

```bash
SERVICE_TOKEN=<token> npx @modelcontextprotocol/inspector \
  npx -y @erickwendel/customers-mcp@latest
```

Ou local antes do publish:

```bash
npm run mcp:inspect
```

---

## Próximo passo (aula 09)

LangGraph consome o **mesmo pacote** via `MultiServerMCPClient`:

```typescript
'customers-mcp': {
  command: 'npx',
  args: ['-y', '@erickwendel/ew-customers-mcp@latest'],
  env: { SERVICE_TOKEN: process.env.SERVICE_TOKEN },
}
```

Ver [09 langchain-mcp](../09-using-mcp-with-langchain/classroom/langchain-mcp.md).

---

## Resumo em uma frase

**Cliente MCP usa npx + SERVICE_TOKEN — pacote npm substitui path local, API legada continua separada.**

Publicação: **[publicacao.md](./publicacao.md)**
