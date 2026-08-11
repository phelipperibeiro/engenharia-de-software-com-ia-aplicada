# Mapa mental — Aula 07 (Template)

## Visão em árvore

```
API Security (Template)
│
├── Você implementa
│   ├── auth.js (JWT, service-token, rate limit)
│   └── index.js (plugins + requireRole)
│
├── Já pronto
│   ├── customers-mcp-z (Bearer + errors)
│   ├── tests MCP
│   └── getServiceToken.sh
│
├── Validar
│   ├── npm test (API)
│   └── SERVICE_TOKEN=... npm test (MCP)
│
└── Referência
    └── 07-api-security-auth-rate-limiting-z
```

---

## Template vs Solução

```
                    TEMPLATE              SOLUÇÃO (-z)
                    --------              ------------
auth.js             authUsers only        completo
index.js            CRUD aberto           jwt + rate-limit
MCP                 pronto                pronto
Testes API          falham até auth       passam
Testes MCP          falham até API auth   passam
```

---

## Ordem de implementação

```
1. auth.js (initAuthRoute, requireRole, rateLimitOptions)
        |
        v
2. index.js (register jwt, rate-limit, preHandlers)
        |
        v
3. npm test API
        |
        v
4. getServiceToken.sh
        |
        v
5. npm test MCP
```

---

## Fluxo credenciais (alvo final)

```
service-token → SERVICE_TOKEN → MCP Bearer → API hook → CRUD
```

Detalhes: **[../07-api-security-auth-rate-limiting-z/classroom/mapa-mental.md](../07-api-security-auth-rate-limiting-z/classroom/mapa-mental.md)**

Checklist: **[exercicio.md](./exercicio.md)**
