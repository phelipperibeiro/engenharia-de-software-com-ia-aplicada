# Mapa mental — Safeguard & Prompt Injection (Aula 05)

## Visão em árvore (texto)

```
Safeguard & Prompt Injection (Aula 05)
│
├── Objetivo da aula
│   ├── Mostrar falha do "só system prompt"
│   ├── Demonstrar prompt injection
│   └── Defender com guardrails (safeguard model)
│
├── Segurança
│   ├── Injection: ignore instructions, jailbreak, etc.
│   ├── RBAC: admin vs member (users.json)
│   ├── MCP filesystem (tools perigosas)
│   ├── Modo --unsafe (demo vulnerável)
│   └── Detalhes: classroom/seguranca.md
│
├── OpenRouter
│   ├── qwen → chat + agent + MCP
│   ├── gpt-oss-safeguard-20b → checkGuardRails
│   └── Detalhes: classroom/openrouter.md
│
├── LangGraph
│   ├── guardrails_check → chat | blocked
│   ├── sem checkpointer
│   └── Detalhes: classroom/langgraph.md
│
├── Nós
│   ├── guardrails_check (safeguard)
│   ├── chat (agent + tools)
│   └── blocked (template txt)
│
├── Prompts
│   ├── system.txt (regras + USER_ROLE)
│   ├── guardrails.txt (SAFE/UNSAFE)
│   ├── blocked.txt
│   └── user/ (ataques exemplo)
│
├── CLI
│   ├── --user erickwendel | ananeri
│   ├── --message | --prompt-path
│   └── --unsafe
│
├── Scripts npm
│   ├── chat:admin
│   ├── chat:member:safe
│   └── chat:member:unsafe:*
│
└── Evolução curso
    ├── 04 memória
    └── 06 RAG Neo4j
```

---

## Mapa mental (visão radial)

```
                         +-----------------------------+
                         |  Guardrails + Injection 05  |
                         +--------------+--------------+
                                        |
        +---------------+---------------+---------------+---------------+
        |               |               |               |               |
   +----+----+     +----+----+     +----+----+     +----+----+     +----+----+
   | Ataque  |     |OpenRouter|    |LangGraph|     |  RBAC   |     |  MCP    |
   +----+----+     +----+----+     +----+----+     +----+----+     +----+----+
        |               |               |               |               |
   injection        2 modelos        3 nós          admin/member    filesystem
   --unsafe         safeguard        condicional    permissions     read files
        |               |               |               |               |
        +---------------+---------------+---------------+---------------+
                                        |
                              +---------+---------+
                              |                   |
                         +----+----+         +----+----+
                         |  SAFE   |         | UNSAFE  |
                         |  chat   |         | blocked |
                         +---------+         +---------+
```

---

## Diagrama do grafo

```
                              +-------+
                              | START |
                              +---+---+
                                  |
                                  v
                         +-------------------+
                         | guardrails_check  |
                         | (safeguard LLM)   |
                         +---------+---------+
                                   |
                    +--------------+--------------+
                    |                             |
           guardrails off                  guardrails on
           ou check.safe                   e check unsafe
                    |                             |
                    v                             v
             +-----------+                 +-----------+
             |   chat    |                 |  blocked  |
             | agent+MCP |                 | template  |
             +-----+-----+                 +-----+-----+
                   |                             |
                   v                             v
               +-------+                     +-------+
               |  END  |                     |  END  |
               +-------+                     +-------+
```

---

## Defense in depth (ASCII)

```
  Entrada do usuário
        |
        v
  +------------------+     UNSAFE      +------------------+
  | Camada 1         | ---------------->| blocked          |
  | Safeguard model  |                   | (sem chat/tools) |
  +--------+---------+                   +------------------+
           | SAFE
           v
  +------------------+     pode falhar  +------------------+
  | Camada 2         | ---------------->| LLM ignora rules |
  | System prompt    |   (injection)    | usa MCP read     |
  +--------+---------+                   +------------------+
           |
           v
  +------------------+     produção     +------------------+
  | Camada 3         | ---------------->| API valida role  |
  | Backend real     |   (recomendado)  | sem confiar LLM  |
  +------------------+                   +------------------+
```

---

## Modo safe vs unsafe

```
+------------------+---------------------------+---------------------------+
|                  | Safe (padrão)             | Unsafe (--unsafe)         |
+------------------+---------------------------+---------------------------+
| guardrailsEnabled| true                      | false                     |
| safeguard roda?  | sim                       | não (retorna safe:true)   |
| injection        | bloqueado em blocked      | pode chegar ao chat       |
| member + arquivo | negado                    | risco de ler via MCP      |
+------------------+---------------------------+---------------------------+
```

---

## Usuários e permissões

```
  erickwendel (admin)
    ├── read_package
    ├── execute_commands
    └── system prompt: pode usar filesystem tools

  ananeri (member)
    ├── permissions: []
    └── system prompt: deve recusar leitura de arquivos
```

---

## Sequência (invoke único)

```
  CLI index.ts
      |
      | invoke({ user, guardrailsEnabled, messages })
      v
  guardrails_check
      |  concatena system + user → safeguard
      |  guardrailCheck = { safe, reason?, analysis? }
      v
  routeAfterGuardrails
      |
      +---> chat --> OpenRouter agent + MCP tools --> AIMessage
      |
      +---> blocked --> blocked.txt template --> AIMessage
      v
  stdout: Assistant: ...
```

---

## Ligação arquivo ↔ conceito

| Conceito | Onde no código |
|----------|----------------|
| Grafo | `src/graph/graph.ts` |
| Estado | `src/graph/state.ts` |
| Verificação segurança | `nodes/guardrailsCheckNode.ts` |
| Chat com tools | `nodes/chatNode.ts` |
| Mensagem bloqueio | `nodes/blockedNode.ts` |
| Rotas | `nodes/edgeConditions.ts` |
| Dois LLMs | `services/openrouterService.ts` |
| MCP filesystem | `services/mcpService.ts` |
| Usuários | `data/users.json` |
| CLI flags | `src/index.ts` |
| Prompts | `prompts/*.txt` + `config.ts` |

---

## Comparação módulo 02 (aulas 01–05)

```
+--------+----------+-------------+-------------+-------------+-------------+
|        | 01       | 02          | 03          | 04          | 05          |
+--------+----------+-------------+-------------+-------------+-------------+
| Tema   | roteamento| grafo local | domínio     | memória     | segurança   |
| LLM    | 1        | 0           | 2 structured| 2 structured| 2 (+tools)  |
| Tools  | não      | não         | não         | não         | MCP FS      |
| Persist| não      | não         | não         | PG+SQLite   | não         |
| Extra  | sort     | upper/lower | medical     | summarize   | safeguard   |
+--------+----------+-------------+-------------+-------------+-------------+
```
