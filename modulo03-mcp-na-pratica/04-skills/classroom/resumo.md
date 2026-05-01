# Aula 04 — Skills

## Contexto no curso

Quarta pasta do **Módulo 03**. Depois de custom agents (aula 03), você aprende **pacotes de conhecimento instaláveis** — o ecossistema [skills.sh](https://skills.sh/) e a CLI `npx skills`.

> Material: **[skills.md](./skills.md)** · **[skills-instaladas.md](./skills-instaladas.md)**

---

## O que você está estudando

Como **estender capacidades do agente** sem inflar o system prompt — skills carregadas quando o `description` no frontmatter combina com a tarefa.

**Não há app Node neste repo** — só definições em `.agents/skills/`.

---

## Skills neste projeto

| Skill | Função |
|-------|--------|
| `find-skills` | Descobrir/instalar skills via CLI |
| `neo4j-cypher-guide` | Cypher moderno + references |
| `ffmpeg` | Comandos vídeo/áudio |

Lock file: `skills-lock.json`

---

## Skills vs Agents vs MCP

| | Skills (04) | Agents (03) | MCP (01/05) |
|---|-------------|-------------|-------------|
| **O quê** | Saber fazer | Quem sou | Executar tool |
| **Onde** | `.agents/skills/` | `.github/agents/` | Servidor MCP |
| **Exemplo** | Sintaxe Cypher | TDD developer | Playwright browser |

Três camadas **complementares**:

```
Agent (persona) + Skills (domínio) + MCP (ações externas)
```

---

## CLI skills

```bash
npx skills find <query>    # buscar
npx skills add <repo>      # instalar
npx skills check           # updates?
npx skills update          # atualizar
```

A meta-skill `find-skills` documenta isso para o próprio agente.

---

## Anatomia SKILL.md

```yaml
---
name: ...
description: Trigger — quando usar
---
# Procedimentos, exemplos, links
```

Opcional: subpastas (`references/`, scripts) — ver neo4j-cypher-guide.

---

## Casos de uso

| Pedido do usuário | Skill provável |
|-------------------|----------------|
| "Ache skill para React" | find-skills |
| "Query Cypher para amigos de amigos" | neo4j-cypher-guide |
| "Extrair áudio de MP4" | ffmpeg |

---

## Relação com outras aulas

- **03 dev instructions:** agents definem workflow; skills injetam expertise
- **06 RAG Neo4j (módulo 02):** neo4j-cypher-guide melhora qualidade das queries geradas
- **05 MCP do zero:** MCP executa; skill ensina o protocolo/domínio

---

## Takeaways

1. **Modularidade** — conhecimento em pacotes, não monólito no prompt
2. **skills.sh** — marketplace de skills open source
3. **skills-lock.json** — reprodutibilidade (como lock de deps)
4. **find-skills** — agente auto-expandível
5. Skill ≠ MCP: referência vs execução

---

## Próximos passos

- Instalar skill nova com `npx skills add`
- Usar neo4j-cypher-guide ao revisar queries da aula 06
- Combinar developer.agent (03) + skills (04) no mesmo workspace

---

## Evolução Módulo 03

| Aula | Tema |
|------|------|
| 01 | Multiple MCP |
| 03 | Custom agents |
| **04** | **Skills** |
| 05 | MCP do zero |
