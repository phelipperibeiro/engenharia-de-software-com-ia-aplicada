# Agent Skills (Aula 04)

Pacotes de **conhecimento e procedimentos** que o agente carrega quando relevante — complemento às instruções fixas dos custom agents (aula 03).

Site oficial: **[skills.sh](https://skills.sh/)**

---

## O que é uma Skill?

Arquivo `SKILL.md` com frontmatter YAML + corpo markdown:

```yaml
---
name: nome-da-skill
description: Quando o agente deve usar (trigger)
---
# Conteúdo: guias, comandos, referências
```

| Aspecto | Skill | Custom Agent (aula 03) |
|---------|-------|------------------------|
| Foco | **O que saber** (domínio) | **Como agir** (persona) |
| Local | `.agents/skills/<nome>/` | `.github/agents/` |
| Instalação | CLI `npx skills` | Copiar .agent.md |
| Compartilhamento | skills.sh / GitHub | Por repo |

---

## Ecossistema skills.sh

```
skills.sh (catálogo)
      |
      v
npx skills find / add / check / update
      |
      v
.agents/skills/<skill>/SKILL.md
      |
      v
skills-lock.json (versão + hash)
```

**skills-lock.json** neste repo trava skills instaladas com source GitHub e hash de integridade.

---

## CLI — comandos principais

| Comando | Função |
|---------|--------|
| `npx skills find <query>` | Buscar no catálogo |
| `npx skills add <owner/repo>` | Instalar skill |
| `npx skills check` | Verificar atualizações |
| `npx skills update` | Atualizar instaladas |

A skill **find-skills** (meta-skill) ensina o agente a usar essa CLI.

---

## Estrutura no projeto

```
04-skills/
├── .agents/skills/
│   ├── find-skills/SKILL.md
│   ├── neo4j-cypher-guide/SKILL.md
│   │   └── references/
│   └── ffmpeg/SKILL.md
├── skills-lock.json
└── refs.txt
```

---

## Quando usar Skills vs MCP

| Necessidade | Solução |
|-------------|---------|
| Saber **como escrever** Cypher moderno | Skill `neo4j-cypher-guide` |
| **Executar** query no Neo4j | MCP ou código (aula 06 módulo 02) |
| Saber **flags FFmpeg** | Skill `ffmpeg` |
| **Rodar** FFmpeg no sistema | Tool execute / terminal |
| Descobrir novas skills | Skill `find-skills` + CLI |

Skills = **contexto sob demanda**; MCP = **ação no mundo externo**.

---

## Fluxo de descoberta

```
Usuário pede algo especializado
        |
        v
Agente reconhece gap de conhecimento
        |
        v
find-skills → npx skills find "..."
        |
        v
npx skills add owner/repo
        |
        v
Skill disponível em próximas sessões
```

---

## Relação com Cursor Skills

Cursor usa `.cursor/skills/` com formato similar (`SKILL.md`). O ecossistema **skills.sh** é compatível em espírito — pacotes reutilizáveis de expertise.

---

## Resumo em uma frase

**Skills são módulos de conhecimento instaláveis que estendem o agente sem reescrever instruções — descobertos via skills.sh e gerenciados com `npx skills`.**

Skills deste repo: **[skills-instaladas.md](./skills-instaladas.md)**
