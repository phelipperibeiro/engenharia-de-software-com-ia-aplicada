# BragBot

`src/flows.ts` — Genkit + Google AI (`gemini-2.5-flash`).

`bragGeneratorFlow` recebe `definition` (texto livre) e devolve:

| Campo | Significado |
|-------|-----------|
| title | ação + resultado |
| context | problema original |
| actionTaken | o que foi feito |
| businessImpact | impacto de negócio |
| metrics | só números |
| technologiesUsed | stack inferida |

UI Angular: dashboard e detalhe (`src/app/`). MCP em `.vscode/mcp.json`. Instruções Gemini em `.gemini/GEMINI.md`.

`ng serve` → `:4200`.
