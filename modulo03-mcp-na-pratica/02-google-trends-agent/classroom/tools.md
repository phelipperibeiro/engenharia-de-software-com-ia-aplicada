# Transformando serviços em tools (Aula 02)

Tema central desta aula: **qualquer serviço HTTP/REST pode virar uma LangChain tool** — o LLM decide quando chamar, com quais argumentos.

---

## Visão geral

```
Usuário pergunta sobre título de vídeo
              |
              v
     +------------------+
     |  LLM (researcher)| ----tool call----> google_trends
     +------------------+                          |
              ^                                     v
              |                            +----------------+
              +-------- JSON trends ------+ SerpAPIService |
                                           +----------------+
                                                    |
                                                    v
                                              SerpAPI (Google Trends)
```

---

## SerpAPIService

Arquivo: `src/services/serpApiService.ts`

| Responsabilidade | Detalhe |
|------------------|---------|
| Buscar trends | `getGoogleTrends(keywords[])` |
| Engine | `google_trends` via pacote `serpapi` |
| Período | `now 7-d` (últimos 7 dias) |
| Parse | interest over time, related queries, rising topics |
| Classificação | `rising` / `stable` / `declining` (compara médias recente vs inicial) |
| Fixture | `disabled: true` em config → `data/trendingData.ts` |

### Tipos retornados

```typescript
TrendingData = {
  keywords: KeywordTrend[]      // volume, interesse, trend
  relatedQueries: RelatedQuery[]
  risingTopics: RisingTopic[]
  timestamp: string
}
```

---

## Tool `google_trends`

Arquivo: `src/tools/googleTrendsTool.ts`

```typescript
tool(
  async ({ keywords }) => {
    const data = await serpAPIService.getGoogleTrends(keywords);
    return JSON.stringify(data);
  },
  {
    name: 'google_trends',
    description: 'Get Google Trends data for a list of keywords...',
    schema: z.object({
      keywords: z.array(z.string()),
    }),
  }
)
```

| Aspecto | Valor |
|---------|-------|
| Factory | `createGoogleTrendsTool(serpAPIService)` — DI |
| Entrada | array de strings (keywords) |
| Saída | JSON stringificado para o LLM |
| Quando chamar | prompt do researcher exige **1 call** com 2 keywords |

---

## Tool nativa vs MCP

| | Tool nativa (`google_trends`) | MCP filesystem |
|---|-------------------------------|----------------|
| **Origem** | Código do projeto | `@modelcontextprotocol/server-filesystem` |
| **Wrapper** | `@langchain/core/tools` + Zod | `@langchain/mcp-adapters` |
| **Dados** | SerpAPI (HTTP externo) | Arquivos locais |
| **Quando usar** | Domínio da aplicação | Operações genéricas de FS |

Ambas entram na **mesma lista** em `getMCPTools()`:

```typescript
// src/services/mcpService.ts
const mcpTools = await mcpClient.getTools();
const googleTrendsTool = createGoogleTrendsTool(serpAPIService);
return [...mcpTools, googleTrendsTool];
```

O agente não distingue — vê tools homogêneas.

---

## Prompt do researcher

Arquivo: `src/prompts/v1/keywords.ts`

Regras-chave:

1. Extrair **exatamente 2 keywords** da pergunta
2. Chamar `google_trends` **uma vez** com ambas no array
3. **Não responder** sem chamar a tool primeiro

Existe `KeywordsSchema` (Zod) no arquivo, mas o nó researcher **não** usa saída estruturada — confia no tool calling do agente.

---

## Modo fixture (dev/teste sem API)

Em `src/config.ts`:

```typescript
serpAPIConfig: {
  disabled: true,  // usa risingTrendFixture
}
```

Fixtures em `data/trendingData.ts`: `risingTrendFixture`, `decliningTrendFixture`.

---

## Padrão “service → tool”

```
1. Service encapsula API externa (SerpAPIService)
2. Tool expõe interface mínima pro LLM (name, description, schema Zod)
3. mcpService agrega tools MCP + nativas
4. createAgent recebe a lista unificada
```

Reutilizável em qualquer integração: CRM, pagamentos, ERP legado.

---

## Resumo em uma frase

**SerpAPIService vira `google_trends` — o LLM extrai keywords e consulta trends reais (ou fixture) via tool calling.**

MCP nesta aula: **[mcp.md](./mcp.md)**
