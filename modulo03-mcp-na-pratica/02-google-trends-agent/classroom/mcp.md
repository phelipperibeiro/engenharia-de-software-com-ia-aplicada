# MCP nesta aula (02) — Filesystem + tool híbrida

Comparado à aula 01 (filesystem + MongoDB + CSV), aqui o MCP é **mais enxuto**: só filesystem, combinado com uma **tool nativa** de domínio.

---

## Visão geral

```
              getMCPTools()
                    |
        +-----------+-----------+
        |                       |
        v                       v
+------------------+    +------------------+
| MCP Filesystem   |    | google_trends    |
| (stdio npx)      |    | (LangChain tool) |
+------------------+    +------------------+
 read/write/list          SerpAPI trends
```

Arquivo: `src/services/mcpService.ts`

---

## MultiServerMCPClient

```typescript
const mcpClient = new MultiServerMCPClient({
  filesystem: {
    transport: 'stdio',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', process.cwd()],
  },
});

const mcpTools = await mcpClient.getTools();
return [...mcpTools, googleTrendsTool];
```

| Parâmetro | Valor |
|-----------|-------|
| Transport | stdio |
| Servidor | `@modelcontextprotocol/server-filesystem` |
| Root | `process.cwd()` |

---

## Diferença vs aula 01

| | Aula 01 | Aula 02 |
|---|---------|---------|
| Servidores MCP | filesystem + MongoDB | só filesystem |
| Tools nativas | `csv_to_json` | `google_trends` |
| Foco | pipeline ETL multi-tool | **service → tool** |
| Grafo | intentParser → agent | researcher → responder |

---

## Por que filesystem aqui?

O prompt do researcher foca em `google_trends`, mas o filesystem fica **disponível** para o agente — padrão de produção onde você expõe tools genéricas + específicas.

Casos possíveis (não forçados pelo código):

- Salvar relatório de trends em arquivo
- Ler briefings locais do criador de conteúdo

---

## Lazy loading das tools

Em `OpenRouterService.generateStructured()`:

```typescript
if (!this.tools.length) {
  this.tools = await getMCPTools();
}
```

Tools carregadas **na primeira chamada** — evita startup lento se o grafo não precisar de LLM.

---

## Pacotes

| Pacote | Papel |
|--------|-------|
| `@langchain/mcp-adapters` | MCP → LangChain tools |
| `@modelcontextprotocol/server-filesystem` | Servidor MCP (via npx) |

---

## Resumo em uma frase

**MCP filesystem complementa a tool `google_trends` — duas origens, uma lista flat para o agente.**

Tools SerpAPI: **[tools.md](./tools.md)**
