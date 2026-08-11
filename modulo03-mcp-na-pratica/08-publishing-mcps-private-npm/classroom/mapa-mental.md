# Mapa mental — Publishing MCPs (Aula 08)

## Visão em árvore

```
Publishing MCPs (Aula 08)
│
├── Pacote npm
│   ├── @erickwendel/customers-mcp
│   ├── bin: customers-mcp
│   ├── shebang: tsx
│   └── files: [src]
│
├── Registries
│   ├── Verdaccio :4873 (privado)
│   └── npmjs.org (público)
│
├── Scripts
│   ├── registry:start/stop
│   ├── release:private
│   └── release:public
│
├── Consumo
│   ├── npx @erickwendel/customers-mcp
│   ├── mcp.json (VS Code)
│   └── SERVICE_TOKEN env
│
├── Dependências runtime
│   ├── API :9999 (externa)
│   └── tsx + @modelcontextprotocol/sdk
│
└── vs Aula 07
    └── path local → pacote npm
```

---

## Fluxo publish

```
customers-mcp-z (código)
        |
        v
npm version patch
        |
        v
npm publish ──> Verdaccio :4873
           └──> npmjs.org
        |
        v
npx @erickwendel/customers-mcp@latest
        |
        v
MCP stdio + SERVICE_TOKEN
        |
        v
API :9999
```

---

## package.json mapa

```
name     → @erickwendel/customers-mcp
version  → 0.0.2
bin      → customers-mcp → src/index.ts
files    → src/
engines  → node v24.14.0
deps     → tsx, @modelcontextprotocol/sdk, zod
```

---

## Dois registries

```
         +------------------+
         |  npm publish     |
         +--------+---------+
                  |
     +------------+------------+
     |                         |
     v                         v
+-----------+           +-------------+
| Verdaccio |           |  npmjs.org  |
| :4873     |           |  (público)  |
+-----------+           +-------------+
  equipe interna          open source
```

---

## Consumo IDE

```
mcp.json
  command: npx
  args: [-y, @erickwendel/customers-mcp@latest]
  env: { SERVICE_TOKEN }
        |
        v
  Copilot / Cursor Agent
```

---

## Arquivos-chave

| Arquivo | Papel |
|---------|-------|
| `package.json` | bin, scripts release |
| `src/index.ts` | shebang + stdio |
| `docker-compose.yaml` | Verdaccio |
| `.vscode/mcp.json` | consumo npx |
