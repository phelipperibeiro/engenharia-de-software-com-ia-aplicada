# Conceitos transversais do Módulo 01

Os 14 exemplos são bem diferentes entre si, mas se apoiam em 5 blocos de conceito que se repetem. Este arquivo aprofunda cada um; detalhes de cada exemplo estão em [exemplos.md](./exemplos.md).

## 1. Tensores, normalização e redes neurais (exemplos 00, 01, 02)

- **Tensor**: estrutura de dados numérica (escalar, vetor, matriz, N-d) que a rede neural consegue processar. Todo dado não-numérico (cor, cidade, texto) precisa virar número antes.
- **Normalização**: reescalar valores para uma faixa padrão (ex.: idade `25–40` → `0–1`) para o treino convergir melhor.
- **One-hot encoding**: categoria vira vetor binário (`azul` → `[1,0,0]`). Usado tanto na entrada (features) quanto na saída (classes) do exemplo 00.
- **Rede densa (`tf.sequential`)**: camadas `dense` com ativação `relu` (filtra sinais negativos) na(s) camada(s) oculta(s) e `softmax` (transforma saída em probabilidades que somam 1) na camada final de classificação.
- **Treino (`model.fit`)**: `optimizer: 'adam'`, `loss: 'categoricalCrossentropy'` (padrão para classificação multi-classe), `epochs` = quantas vezes o modelo vê o dataset inteiro.
- **Inferência (`model.predict`)**: usa os pesos já treinados para prever a classe de um dado novo — precisa passar pela **mesma** normalização/encoding do treino.

No exemplo 02 a lógica é invertida: em vez de treinar, usa-se um modelo **pré-treinado** (YOLOv5n) só para inferência — visão computacional detectando objetos em frames do jogo.

## 2. IA local no navegador — Chrome Built-in AI (exemplos 03, 04, 05)

APIs nativas do Chrome (`LanguageModel`, `Translator`, `LanguageDetector`) que rodam um modelo pequeno (**Gemini Nano**) **no dispositivo do usuário**, sem chamada de rede e sem API key:

```
Sem Built-in AI:                    Com Built-in AI:
navegador → API na nuvem            navegador → modelo local (Gemini Nano)
(latência, custo, dado sai          (offline após baixar o modelo,
 da máquina)                         sem custo por token, mais privado)
```

- `LanguageModel.availability()` retorna `available | downloadable | downloading | unavailable` — o app precisa checar isso antes de usar (exemplo 04).
- `LanguageModel.create({ temperature, topK, initialPrompts })`: mesmos parâmetros de sampling que aparecem em qualquer API de LLM (módulo 02 reaproveita o conceito com o OpenRouter).
- `promptStreaming()` devolve um `AsyncIterable` de chunks — o mesmo padrão de streaming usado depois com SDKs de LLM em nuvem.
- Multimodalidade (exemplo 05): o prompt aceita `{ type: 'image' }`/áudio, não só texto.
- `Translator`/`LanguageDetector`: pares de APIs nativas complementares para tradução e detecção de idioma, independentes do `LanguageModel`.

Trade-off didático: menos capaz que um modelo grande em nuvem, mas ilustra que "IA" não é sinônimo de "chamada HTTP para um provedor".

## 3. MCP — Model Context Protocol (exemplos 06, 07, 08, 09)

MCP é o protocolo que dá ao agente de IA **ferramentas reais** (não só texto) para agir no mundo: controlar um browser, consultar documentação atualizada, ler métricas de produção.

```
Sem MCP:                              Com MCP:
LLM "acha" que sabe          LLM chama uma tool MCP real
(alucina seletor, API        (Playwright abre a página de fato,
 desatualizada, métrica       Context7 busca doc atual,
 inventada)                    Grafana lê o dado real)
```

| Servidor MCP | O que expõe | Exemplo |
|---------------|-------------|---------|
| `@playwright/mcp` | Controlar um browser real (clicar, navegar, ler DOM) | 06, 07 |
| Context7 | Buscar documentação **atual** de uma lib antes de gerar código | 08 |
| Grafana MCP | Consultar Prometheus/Loki/Tempo de uma stack de observabilidade real | 09 |

Padrão comum nos prompts (06 e 08): instruir o agente a **executar passo a passo com a ferramenta primeiro**, e só depois consolidar o resultado (teste, código, diagnóstico) — evita que ele responda "de memória" sem checar o estado real.

## 4. Ollama vs OpenRouter — local vs gateway (exemplos 10, 11)

Duas formas de rodar um LLM fora do navegador:

| | Ollama (10) | OpenRouter (11) |
|---|---|---|
| Onde roda | Localmente (sua máquina/GPU) | Nuvem (gateway multi-provedor) |
| Custo | Grátis (custo é hardware) | Por token/crédito |
| Modelos | Os que você baixar (`ollama pull`) | 400+ modelos de 60+ provedores |
| API | Compatível com OpenAI (`/v1/chat/completions`) | Compatível com OpenAI |
| Uso no exemplo | Comparar alinhamento entre modelos (um recusa pedido de cheat, outro não) | Chamada HTTP crua — vira o `OpenRouterService` do Módulo 02 |

O exemplo 10 também mostra que **alinhamento/guardrails é uma propriedade do modelo escolhido**, não da API — o mesmo protocolo HTTP serve para um modelo `uncensored` e para um que se recusa e expõe seu `thinking` ao recusar.

## 5. Embeddings, vector store e RAG (exemplos 12, 13)

```
PDF → chunks → embeddings (vetores) → Neo4j (vector store) → similarity search → [+ LLM] → resposta
        ^ documentProcessor.ts    ^ HuggingFaceTransformersEmbeddings   ^ topK        ^ ai.ts (só no 13)
```

- **Embedding**: vetor numérico que representa o *significado* de um texto — textos parecidos ficam próximos no espaço vetorial.
- **Chunking** (`RecursiveCharacterTextSplitter`): documentos grandes precisam ser quebrados antes de virar embedding (limite de contexto + precisão de busca).
- **Vector store (Neo4j)**: banco que guarda os vetores e permite busca por similaridade (`similaritySearch`) — aqui os embeddings rodam **localmente** via HuggingFace Transformers, sem custo de API.
- **RAG (Retrieval Augmented Generation)**: exemplo 12 para na etapa de *retrieval* (devolve os chunks); exemplo 13 completa o ciclo levando esses chunks como contexto para um LLM (`ChatOpenAI` via OpenRouter) gerar a resposta final — fechando o pipeline que começou no exemplo 11.

## Como os blocos se conectam

```
00-02  Fundamentos matemáticos (tensor → rede → visão computacional)
        │
03-05  Mesmos conceitos de prompt/sampling, mas rodando local no navegador
        │
06-09  O LLM ganha ferramentas reais (MCP: browser, docs, observabilidade)
        │
10-11  De onde vem o modelo: local (Ollama) vs gateway em nuvem (OpenRouter)
        │
12-13  Embeddings + vector store + LLM = RAG completo
        │
        ▼
Módulo 02: Integração com APIs de LLMs (OpenRouterService, LangGraph, RAG em produção)
```
