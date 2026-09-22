# Observabilidade (Aula 05)

Quatro níveis, do imediato ao profundo:

1. **Hooks** — ponto a ponto, tempo real
2. **Telemetria** — eventos, tempo, tokens (`telemetria.py`)
3. **Rastreamento / replay** — mesma entrada, mesma trilha
4. **trace-analyzer** — segundo agente que analisa a execução do primeiro

Novo agente: `trace-analyzer/` com skills como `analisar_saude` e `analisar_performance`.

CLI nova: `analisar`.
