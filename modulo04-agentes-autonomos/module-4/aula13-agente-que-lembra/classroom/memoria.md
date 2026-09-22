# 4 tipos de memória (Aula 13)

| Tipo | Pasta | Papel |
|------|-------|-------|
| curta | `memory_store/curta/` | execução atual (limpa entre runs) |
| longa | `memory_store/longa/` | fatos persistentes YAML |
| episodica | `memory_store/episodica/` | resumos de execuções |
| contextual | `memory_store/contextual/` | placeholder — embeddings na aula 14 |

`memory_adapter.py`: gravar, recuperar, atualizar, remover, listar.

`ciclo.py`: `_recuperar_contexto` antes do loop, `_persistir_memoria` depois.

Hooks e `politicas_memoria` em `rules.md`.
