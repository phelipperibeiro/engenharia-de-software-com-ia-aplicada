# Mapa mental — Módulo 01

```
Módulo 01 — Fundamentos de IA e LLMs
│
├── 🧮 Fundamentos (00–02) — TensorFlow.js
│   ├── 00 tensores + rede neural do zero (Node)
│   │   ├── normalização + one-hot encoding
│   │   ├── tf.sequential: dense(relu) → dense(softmax)
│   │   └── fit (adam, categoricalCrossentropy) → predict
│   ├── 01 e-commerce recomendations (browser)
│   │   ├── parte01: app MVC sem IA (sessionStorage)
│   │   └── parte05: treino em Web Worker + TFVisor
│   └── 02 vencendo qualquer jogo (DuckHunt-JS)
│       ├── YOLOv5n pré-treinado (inferência, não treino)
│       ├── template → worker stub (x:400,y:400)
│       ├── parte01 → inferência real, saída ainda fixa
│       └── parte02 → pós-processamento: boxes → centro → clique
│
├── 🌐 IA local no navegador (03–05) — Chrome Built-in AI
│   ├── 03 LanguageModel.create + promptStreaming
│   ├── 04 temperature/topK + availability() + AbortController
│   └── 05 multimodal (imagem/áudio) + Translator + LanguageDetector
│   └── roda Gemini Nano NO dispositivo, sem API key
│
├── 🔧 MCP — ferramentas reais para o agente (06–09)
│   ├── 06 Playwright MCP → gera testes a partir de execução real
│   ├── 07 Playwright MCP → navega 2 sites, cruza dados, preenche form
│   ├── 08 Context7 MCP → busca doc atual antes de gerar código
│   └── 09 Grafana MCP → logs+métricas+traces → acha bug de connection leak
│
├── ☁️ Onde o modelo roda (10–11)
│   ├── 10 Ollama → local, /v1/chat/completions, alinhamento por modelo
│   └── 11 OpenRouter → gateway cloud, ponte pro Módulo 02
│
└── 🔍 Embeddings + RAG (12–13) — LangChain + Neo4j
    ├── 12 PDF → chunks → embeddings (HF local) → Neo4j → similaritySearch
    │      (só retrieval, sem LLM)
    └── 13 mesmo pipeline + ai.ts (ChatOpenAI/OpenRouter)
           (retrieval + generation = RAG completo)
```

---

## Fluxo geral do módulo

```
  Matemática da IA          IA "de graça" local        Agente com mãos           De onde vem o LLM        Buscar + Gerar
  (00-02)                   (03-05)                    (06-09)                    (10-11)                  (12-13)
┌───────────────┐        ┌───────────────┐        ┌───────────────┐        ┌───────────────┐        ┌───────────────┐
│ tensor→rede   │  ───►  │ Gemini Nano   │  ───►  │ Playwright/   │  ───►  │ Ollama (local)│  ───►  │ embeddings +  │
│ →predição     │        │ no Chrome     │        │ Context7/     │        │ OpenRouter    │        │ Neo4j + RAG   │
│ (+ YOLO infer)│        │ (sem API key) │        │ Grafana MCP   │        │ (cloud gateway)│        │               │
└───────────────┘        └───────────────┘        └───────────────┘        └───────────────┘        └───────────────┘
                                                                                     │
                                                                                     ▼
                                                                         Módulo 02: Smart Model
                                                                         Router Gateway (OpenRouter
                                                                         em produção + LangGraph)
```

---

## Conceito ↔ exemplo

| Conceito | Onde aparece |
|----------|----------------|
| Normalização / one-hot | 00, 01 |
| Rede densa + softmax | 00, 01 |
| Modelo pré-treinado (inferência sem treino) | 02 |
| `LanguageModel` / Prompt API | 03, 04, 05 |
| `temperature` / `topK` | 04 (e reaparece no Módulo 02) |
| Streaming de resposta | 03, 04 (e todo o resto do curso) |
| Multimodal (imagem/áudio) | 05 |
| MCP como "mãos" do agente | 06, 07, 08, 09 |
| Observabilidade (logs/métricas/traces) | 09 |
| LLM local vs gateway cloud | 10 vs 11 |
| Embeddings locais (HuggingFace) | 12, 13 |
| Vector store / similarity search | 12, 13 |
| RAG (retrieval + generation) | 13 |
