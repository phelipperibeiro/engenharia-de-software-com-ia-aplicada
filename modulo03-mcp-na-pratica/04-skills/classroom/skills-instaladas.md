# Skills instaladas neste repo (Aula 04)

Três skills em `.agents/skills/`, registradas em `skills-lock.json`.

---

## 1. find-skills (meta-skill)

**Source:** `vercel-labs/skills` (find-skills)

**Propósito:** ensinar o agente a **descobrir e instalar** outras skills.

| Ação | Comando |
|------|---------|
| Buscar | `npx skills find <termo>` |
| Instalar | `npx skills add <owner/repo>` |
| Verificar | `npx skills check` |
| Atualizar | `npx skills update` |

**Quando dispara:** usuário pergunta "como faço X", "tem skill para Y", "achar skill de Z".

**Analogia:** npm search + install, mas para conhecimento de agente.

---

## 2. neo4j-cypher-guide

**Source:** `tomasonjo/blogs` (GitHub)

**Propósito:** guia de **Cypher moderno** (Neo4j 5+) — sintaxe, patterns, boas práticas.

**Conteúdo extra:** pasta `references/` com material de consulta.

**Quando dispara:** escrever ou revisar queries Cypher, modelagem de grafo, Text-to-Cypher.

**Link curricular:** complementa [aula 06 RAG Neo4j](../../modulo02-integracao-apis-llms/06-rag-neo4j-students-z/classroom/) — lá o agente **executa** Cypher via código; aqui aprende **como escrever** bem.

### Exemplos de tópicos típicos

- `MATCH`, `WHERE`, `WITH`, agregações
- Relacionamentos e labels
- Evitar cartesian products
- Patterns para RAG / knowledge graph

---

## 3. ffmpeg

**Source:** `digitalsamba/claude-code-video-toolkit` (GitHub)

**Propósito:** referência para **processamento de vídeo e áudio** via FFmpeg.

**Quando dispara:** converter formatos, extrair áudio, cortar vídeo, codecs, streaming básico.

**Nota:** a skill documenta comandos — execução real depende de FFmpeg instalado no sistema e permissão de terminal.

---

## skills-lock.json

Registro de instalação:

```json
{
  "version": 1,
  "skills": {
    "ffmpeg": {
      "source": "digitalsamba/claude-code-video-toolkit",
      "sourceType": "github",
      "computedHash": "..."
    }
  }
}
```

- **source:** repo GitHub de origem
- **sourceType:** tipo da fonte (`github`)
- **computedHash:** integridade do conteúdo

Equivalente conceitual a `package-lock.json` para skills.

---

## refs.txt

Links de referência externos listados no material da aula (skills.sh, docs, repos).

---

## Comparação rápida

| Skill | Tipo | Domínio |
|-------|------|---------|
| find-skills | Meta | Descoberta de skills |
| neo4j-cypher-guide | Domínio | Graph DB / Cypher |
| ffmpeg | Domínio | Mídia / CLI |

---

## Exercícios sugeridos

1. `npx skills find neo4j` — ver o que existe no catálogo
2. Pedir ao agente: "escreva Cypher para usuários que compraram produto X" — deve usar neo4j-cypher-guide
3. Pedir: "converta video.mp4 para audio.mp3" — deve consultar ffmpeg skill
4. Comparar resposta **com** e **sem** skill instalada

---

## Resumo em uma frase

**Este repo demonstra três skills: uma meta (find), uma de grafo (Cypher) e uma de mídia (FFmpeg) — todas versionadas em skills-lock.json.**

Visão geral: **[skills.md](./skills.md)**
