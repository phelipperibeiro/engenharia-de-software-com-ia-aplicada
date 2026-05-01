# Mapa mental — Skills (Aula 04)

## Visão em árvore

```
Skills (Aula 04)
│
├── Objetivo
│   ├── Pacotes de conhecimento instaláveis
│   ├── skills.sh + npx skills
│   └── SKILL.md sob demanda
│
├── CLI
│   ├── find — buscar catálogo
│   ├── add — instalar
│   ├── check / update — manutenção
│   └── find-skills (meta) ensina CLI
│
├── Skills instaladas
│   ├── find-skills (meta)
│   ├── neo4j-cypher-guide (Cypher 5+)
│   └── ffmpeg (vídeo/áudio)
│
├── Arquivos
│   ├── .agents/skills/*/SKILL.md
│   ├── skills-lock.json
│   └── refs.txt
│
└── vs outros
    ├── Agent (03) = persona
    ├── MCP (01/05) = execução
    └── Skill (04) = expertise
```

---

## Ecossistema

```
        skills.sh
            |
    +-------+-------+
    |               |
    v               v
 npx skills     GitHub repos
 find/add           |
    |               v
    +------> .agents/skills/
                  |
                  v
           skills-lock.json
```

---

## Três camadas do agente

```
+--------------------------------------------------+
|                    USUÁRIO                        |
+--------------------------------------------------+
|  Custom Agent (.agent.md)     WHO + HOW          |
|  Skills (SKILL.md)            WHAT I KNOW        |
|  MCP (tools)                  WHAT I CAN DO      |
+--------------------------------------------------+
```

---

## Skills deste repo

```
04-skills
├── find-skills ---------> npx skills find/add
├── neo4j-cypher-guide --> Cypher, references/
└── ffmpeg --------------> codecs, convert, trim
```

---

## Skill vs MCP (decisão)

```
Preciso SABER como?  --> Skill (ffmpeg flags, Cypher syntax)
Preciso EXECUTAR?    --> MCP ou terminal (playwright, filesystem, DB)
Preciso COMPORTAR?   --> Custom agent (developer, planner)
```

---

## Fluxo find-skills

```
Tarefa desconhecida
       |
       v
find-skills ativada
       |
       v
npx skills find "keyword"
       |
       v
npx skills add owner/repo
       |
       v
Nova skill no lock file
```

---

## Link curricular

```
neo4j-cypher-guide (04) -----> RAG Neo4j aula 06 (módulo 02)
                                      |
                               Text-to-Cypher + execução
```
