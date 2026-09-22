# Exemplos 00–13

Convenção de pastas: quando existe sufixo `-template`, é o ponto de partida (scaffold/stub) entregue ao aluno; `-z` (ou sem sufixo, como no 02) é a versão final construída em aula. Pastas `parte01`, `parte02`... marcam checkpoints incrementais dentro do mesmo exercício.

| # | Pasta | Tecnologia principal | Foco |
|---|-------|----------------------|------|
| 00 | `exemplo-00-template` / `exemplo-00-z` | `@tensorflow/tfjs-node` | Tensores, one-hot encoding, rede neural densa do zero (Node.js) |
| 01 | `exemplo-01-ecommerce-recomendations-template` / `-z` (partes 01–05) | TensorFlow.js no browser, MVC vanilla JS, Web Worker | App de e-commerce evoluindo até treinar um modelo de recomendação no navegador |
| 02 | `exemplo-02-vencendo-qualquer-jogo` (`_template`, `parte01`, `parte02`) | TensorFlow.js + YOLOv5n + Web Worker | Bot de visão computacional que "enxerga" e joga DuckHunt-JS sozinho |
| 03 | `exemplo-03-webai01` | Chrome `LanguageModel` (Prompt API) | Primeiro contato com IA local no navegador (Gemini Nano), streaming de resposta |
| 04 | `exemplo-04-webai02-temperature-and-topK` | Chrome `LanguageModel` | UI para brincar com `temperature`/`topK`, checagem de disponibilidade e download do modelo |
| 05 | `exemplo-05-webai03-multimodal` | `LanguageModel` multimodal, `Translator`, `LanguageDetector` | Prompt com imagem/áudio + tradução automática da resposta |
| 06 | `exemplo-06-playwright-testes` | Playwright MCP | Agente navega um app real e gera testes Playwright/TypeScript a partir do fluxo observado |
| 07 | `exemplo-07-playwright-navegacao` | Playwright MCP | Agente navega dois sites, cruza dados entre eles e preenche formulário sem enviar |
| 08 | `exemplo-08-context7` | Context7 MCP | Agente consulta documentação atualizada (Better Auth) antes de gerar código Next.js |
| 09 | `exemplo-09-grafana-mcp` (`alumnus`) | Grafana MCP + Prometheus/Loki/Tempo/OTel | Agente investiga um bug real de produção (connection leak) usando métricas, logs e traces |
| 10 | `exemplo-10-ollama` | Ollama (modelos locais) | Rodar LLMs localmente via API OpenAI-compatible; comparação de alinhamento entre modelos |
| 11 | `exemplo-11-openrouter` | OpenRouter (curl) | Chamada HTTP crua ao gateway multi-provedor (ponte para o Módulo 02) |
| 12 | `exemplo-12-embeddings-neo4j` / `-template` | LangChain + HuggingFace Transformers + Neo4j | Pipeline de embeddings: PDF → chunks → vetores → Neo4j → busca por similaridade (sem LLM) |
| 13 | `exemplo-13-embeddings-neo4j-rag` | LangChain + Neo4j + OpenRouter (`ChatOpenAI`) | Mesmo pipeline do 12 + geração de resposta (RAG completo) |

---

## 00 — Tensores e rede neural do zero

Arquivo-chave: `index.js` (`-z` = versão comentada/final).

- Dataset minúsculo e didático: 3 pessoas com `idade`, `cor`, `localizacao`.
- **Normalização** da idade para `[0,1]` e **one-hot encoding** de `cor`/`localizacao` → vetor de 7 posições.
- `tf.sequential()` com uma camada densa `relu` (80 units) + saída `softmax` (3 classes: premium/medium/basic).
- Treino com `model.fit` (`adam`, `categoricalCrossentropy`, 100 epochs) e `predict` para uma pessoa nova.
- Roda em Node puro (`@tensorflow/tfjs-node`), sem servidor — é o "hello world" de rede neural do módulo.

## 01 — Recomendação de e-commerce

Progressão em `parte01` → `parte05` (pasta `-z`):

- `parte01`: app MVC (View/Controller/Service) mostra usuários e produtos, grava compras no `sessionStorage` — ainda **sem** IA.
- `parte02`–`parte04`: evolução incremental da camada de dados/serviços.
- `parte05`: entra `TFVisorView`/`TFVisorController` (visualização de treino do tfjs-vis) e `workers/modelTrainingWorker.js` — o treino do modelo de recomendação roda em **Web Worker** para não travar a UI.
- Mesma ideia do exemplo 00, mas dentro de uma aplicação real e no navegador.

## 02 — Vencendo qualquer jogo (visão computacional)

`DuckHunt-JS` é um jogo pronto (PixiJS); o exercício é plugar um **piloto automático** em `machine-learning/`:

1. `main.js` (igual nas 3 pastas): a cada 200ms captura o canvas (`createImageBitmap`), manda pro worker, e ao receber `{x, y}` move a mira e chama `game.handleClick(...)`.
2. `_template/worker.js`: stub — sempre devolve `(400, 400)`. O aluno completa o carregamento do modelo.
3. `parte01/worker.js`: carrega o **YOLOv5n** (`tf.loadGraphModel`) exportado para TF.js, faz `preprocessImage` (resize 640×640, normaliza, batch) e roda `executeAsync` — mas ainda devolve coordenada fixa (checkpoint de depuração, com `debugger` no meio).
4. `parte02/worker.js`: adiciona o pós-processamento real — filtra por `CLASS_THRESHOLD` (0.6) e por classe (`'kite'`, rótulo do COCO usado como proxy pro pato), converte caixa normalizada → pixel, calcula centro e manda `{x, y, score}` por detecção.

Roda tudo em **Web Worker** (thread separada) para não travar o render do jogo. Não há treino aqui — é **inferência** com pesos prontos (YOLO pré-treinado).

## 03–05 — Chrome Built-in AI (IA local no navegador)

Três variações de app usando as APIs nativas de IA do Chrome (sem servidor, sem API key):

- **03**: `LanguageModel.create()` com `initialPrompts` (system) + `promptStreaming` — resposta chunk a chunk renderizada como Markdown.
- **04**: adiciona UI para os parâmetros `temperature`/`topK` (lidos de `LanguageModel.params()`), `AbortController` para cancelar geração, e `checkRequirements()` que valida browser, feature flag e status de download do modelo (`available` / `downloadable` / `downloading` / `unavailable`).
- **05**: multimodal — input de arquivo (`accept="image/*,audio/*"`) enviado como parte do prompt, mais `Translator` e `LanguageDetector` (outra dupla de APIs nativas do Chrome) para detectar o idioma da resposta e traduzir para português.

Pré-requisito comum: Chrome/Canary recente com a flag `chrome://flags/#prompt-api-for-gemini-nano` ativada — o modelo (Gemini Nano) roda **no dispositivo**, não na nuvem.

## 06–07 — Playwright MCP

Ambos usam o mesmo servidor MCP (`npx @playwright/mcp@latest --extension`), plugado no editor via `example.mcp.json`.

- **06**: prompt (`generate_test.prompt.md`) instrui o agente a **executar** os passos com as ferramentas do Playwright MCP primeiro (não gerar código "de cabeça"), só depois emitir um teste `@playwright/test` em TypeScript e iterar até passar. Há também um prompt de *scaffolding* de projeto Playwright + CI no GitHub Actions.
- **07**: navegação autônoma cruzando dois sites — o agente lê os campos exigidos por um Google Forms, extrai dados de um perfil no Sessionize e preenche o formulário (sem enviar), tudo guiado por instrução em linguagem natural.

Ideia central: o MCP dá ao agente **ferramentas reais de browser** (não só geração de texto) — ele vê a página de verdade antes de agir.

## 08 — Context7 MCP

Prompt estruturado (contexto → tom → fontes → tarefa → formato de saída) que **obriga** o agente a consultar a documentação atual do Better Auth via Context7 MCP antes de gerar código — com regra explícita de parar se o MCP não estiver disponível. Gera um projeto Next.js + Better Auth + GitHub OAuth + SQLite (`nextjs-better-auth-demo/`) e valida a porta com Playwright MCP.

Resolve o problema de LLM alucinar API desatualizada: a doc é buscada em tempo real, não vem só do treino do modelo.

## 09 — Grafana MCP

Projeto `alumnus`: API Fastify instrumentada com OpenTelemetry + stack completa de observabilidade (`infra/`: Prometheus, Loki, Tempo, OTel Collector, Blackbox Exporter).

Cenário documentado em `docs/prompt.md`: um endpoint (`/students/db-leaky-connections`) vaza conexões de um pool `pg` (sem `finally`/`client.release()`) — as 2 primeiras requisições funcionam, a 3ª+ dá timeout. O roteiro em `docs/prompt.md` mostra passo a passo como o agente usa o Grafana MCP para cruzar **logs (Loki) → métricas (Prometheus) → traces (Tempo)** e chegar na causa raiz sozinho, sem o dev abrir o Grafana manualmente.

## 10 — Ollama

`request.sh`: `ollama pull` + chamadas HTTP locais (`/v1/chat/completions` e `/api/generate`) na porta `11434`. Compara dois modelos rodando localmente — um sem guardrails (`llama2-uncensored`) e um com (`gpt-oss:20b`, que se recusa e expõe o campo `thinking` com o raciocínio da recusa) — para ilustrar que **alinhamento/censura é uma escolha do modelo**, não da infraestrutura.

## 11 — OpenRouter

`request.sh`: mesma ideia do 10, mas via API do OpenRouter (`google/gemma-3-27b-it:free`), com headers `HTTP-Referer`/`X-Title`. É a ponte direta para o **Módulo 02** (Smart Model Router Gateway), que envolve essa chamada crua num serviço/gateway.

## 12 — Embeddings + Neo4j (sem LLM)

Pipeline em `src/`:

1. `documentProcessor.ts`: `PDFLoader` (LangChain) carrega `tensores.pdf` e `RecursiveCharacterTextSplitter` quebra em chunks.
2. `HuggingFaceTransformersEmbeddings`: gera os vetores **localmente** (sem API paga).
3. `Neo4jVectorStore.fromExistingGraph`: grava os chunks + vetores no Neo4j.
4. `similaritySearch(pergunta, topK)`: devolve os chunks mais parecidos — **sem** nenhum LLM gerando resposta, só recuperação.

## 13 — Embeddings + Neo4j + RAG (completo)

Mesmo pipeline do 12, acrescentando `ai.ts`: os chunks recuperados por similaridade viram contexto de um prompt para `ChatOpenAI` apontando pro **OpenRouter** (`baseURL` customizada). Cada pergunta gera uma resposta em Markdown salva em `respostas/`. É o **RAG fim a fim**: retrieval (Neo4j) + generation (LLM via OpenRouter) — fecha o módulo conectando tudo que veio antes (embeddings locais, vetores, e o gateway do exemplo 11).
