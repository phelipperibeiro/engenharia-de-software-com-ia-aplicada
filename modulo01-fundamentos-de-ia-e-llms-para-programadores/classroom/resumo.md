# Módulo 01 — resumo

## Contexto no curso

Primeiro módulo do curso. Antes de integrar APIs de LLM em produção (Módulo 02), o objetivo aqui é entender **o que tem por baixo**: tensores e redes neurais na mão, visão computacional com modelo pré-treinado, IA rodando local no navegador, agentes com ferramentas reais via MCP, e o par embeddings+RAG. É a base conceitual reaproveitada em todos os módulos seguintes.

## Setup por bloco

```bash
# 00, 01, 02 — TensorFlow.js
npm ci && npm start   # ou npm run dev, conforme package.json de cada pasta

# 03, 04, 05 — Chrome Built-in AI
npx http-server .     # abrir no Chrome/Canary com a flag
                       # chrome://flags/#prompt-api-for-gemini-nano ativada

# 06, 07 — Playwright MCP
# configurar example.mcp.json no editor (VS Code/Cursor) e rodar o prompt

# 09 — Grafana MCP (stack de observabilidade)
npm run docker:infra:up   # dentro de exemplo-09-grafana-mcp/alumnus

# 10 — Ollama
ollama pull <modelo> && ollama list

# 12, 13 — Embeddings + Neo4j
npm ci && npm run infra:up   # sobe o Neo4j via docker-compose
```

## Takeaways

1. **Tensor → rede → predição** é o ciclo que sustenta tudo depois: normalizar, treinar, prever — mesmo quando o "modelo" é um LLM inteiro.
2. **Inferência ≠ treino**: o exemplo 02 usa YOLO pronto só para detectar; nada ali é treinado — é o padrão mais comum no dia a dia (usar modelo pré-treinado, não treinar do zero).
3. **IA não é só nuvem**: as Built-in AI APIs do Chrome (03–05) rodam local, sem API key — mesmos parâmetros (`temperature`, `topK`, streaming) que reaparecem depois com provedores em nuvem.
4. **MCP dá ferramentas reais ao LLM** (06–09): browser, documentação atualizada, observabilidade. O padrão de prompt em todos eles é "execute com a ferramenta antes de responder" — evita alucinação.
5. **Local vs gateway** (10–11): Ollama roda o modelo na sua máquina; OpenRouter é o hub que escolhe entre 400+ modelos em nuvem — é a ponte direta para o Módulo 02.
6. **RAG é retrieval + generation**: o exemplo 12 (busca por similaridade) e o 13 (busca + resposta do LLM) mostram os dois pedaços separados antes de virarem "RAG" como buzzword única.

## Onde olhar

Detalhe de cada exemplo (pasta, tecnologia, o que foi implementado): [exemplos.md](./exemplos.md).
Explicação aprofundada dos conceitos que atravessam os exemplos: [conceitos.md](./conceitos.md).
