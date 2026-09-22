# CFP Platform — spec antes do código

Workspace Nx em `cfp-platform/`:

| Projeto | Papel |
|---------|-------|
| `frontend/` | UI |
| `api/` | API |
| `shared-types/` | contratos compartilhados |
| `frontend-e2e/` / `api-e2e/` | e2e |
| `openspec/` | specs e changes |

`openspec/specs/` e `openspec/changes/` descrevem features (proposta → design → tasks) antes da implementação.

Agentes: pasta `.agent/`.

Comando típico: `npx nx <target> <project>`.
