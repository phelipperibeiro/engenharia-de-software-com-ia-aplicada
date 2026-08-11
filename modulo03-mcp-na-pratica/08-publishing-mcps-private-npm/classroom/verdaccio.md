# Verdaccio — registry privado (Aula 08)

[Verdaccio](https://verdaccio.org/) simula um **npm registry privado** local — ideal para testar publish antes de ir pro npm público.

Arquivo: `customers-mcp-z/docker-compose.yaml`

---

## Infra

```yaml
services:
  verdaccio:
    image: verdaccio/verdaccio:6
    container_name: "verdaccio"
    ports:
      - "4873:4873"
```

```bash
npm run registry:start   # docker compose up -d
npm run registry:stop    # docker compose down
```

UI: `http://localhost:4873`

---

## Fluxo de publish privado

```
1. docker compose up (Verdaccio :4873)
        |
        v
2. npm login --registry http://localhost:4873
        |
        v
3. npm version patch
        |
        v
4. npm publish --registry http://localhost:4873
        |
        v
5. Pacote @erickwendel/customers-mcp disponível localmente
```

Script único: `npm run release:private`

---

## Consumir do registry privado

`.vscode/mcp.json` (comentado no repo):

```json
{
  "servers": {
    "customers-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "--registry", "http://localhost:4873",
        "@erickwendel/customers-mcp@latest"
      ],
      "env": { "SERVICE_TOKEN": "<token>" }
    }
  }
}
```

LangChain (aula 09) usa o mesmo padrão em `customersTool.ts`.

---

## Por que registry privado?

| Cenário | Benefício |
|---------|-----------|
| MCP interno da empresa | não expor tools no npm público |
| CI/CD | mirror/cache de deps |
| Desenvolvimento | testar publish sem conta npm |
| Prototipagem | validar bin + npx antes do release |

---

## Checklist publish

- [ ] API legada rodando (`:9999`) para testes locais
- [ ] `npm test` passando
- [ ] `npm run build` (chmod bin)
- [ ] Verdaccio up ou login npm público
- [ ] `npm publish` com registry correto
- [ ] Testar `npx` com SERVICE_TOKEN

---

## Resumo em uma frase

**Verdaccio na porta 4873 — registry npm local para publicar e consumir `@erickwendel/customers-mcp` sem expor no npm público.**

Consumo: **[consumo.md](./consumo.md)**
