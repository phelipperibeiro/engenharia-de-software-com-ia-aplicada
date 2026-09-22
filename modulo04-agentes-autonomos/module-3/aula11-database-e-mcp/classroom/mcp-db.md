# DB + MCP (Aula 11)

| Adapter | Uso |
|---------|-----|
| `rest_adapter.py` | métricas, logs ao vivo |
| `db_adapter.py` | histórico SQLite (`monitor.db`, seed 20 linhas) — 3 regras de segurança |
| `mcp_adapter.py` | SDK MCP stdio |

Servidor MCP (`mcp/server.py`): `buscar_issues`, `verificar_ci_status`. `mcp/config.json` no formato Claude/Cursor.

Policies extras em `rules.md` (rate limit, segurança). Hooks listam ações.
