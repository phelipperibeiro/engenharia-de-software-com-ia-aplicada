# Runtime (Aula 04)

```
runtime/
├── contratos.py     # carrega os 9 .md
├── ciclo.py         # loop + circuit breaker
├── planejador.py    # percepção + LLM
├── ferramentas.py   # tools a partir das skills
├── executor.py      # valida, executa, hooks, avalia
├── telemetria.py    # eventos, tempo, tokens
├── main.py          # CLI
└── validador.py     # cruzamento entre contratos
```

`carregar_yaml_do_md` extrai o primeiro bloco `yaml` do Markdown. `criar_estado` monta a folha em branco (contadores, limites, histórico).

CLI típica: `rodar`, `validar`, rastreamento, replay.
