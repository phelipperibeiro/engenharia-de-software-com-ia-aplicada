# Aula 07 — Arquiteturas cognitivas (ReAct)

Troca a cognição sem mexer no agente: pasta `architectures/<nome>/` sobrescreve planner e executor. Primeira arquitetura: ReAct, com campo `raciocínio` obrigatório.

## Takeaways

1. O contrato (Markdown + YAML) governa o comportamento — o runtime é agnóstico de domínio.
2. Cada aula acrescenta um mecanismo sem reescrever o agente do zero.
3. Medir (evals) fecha a unidade: decisão boa precisa de evidência, não só de demo.

## Onde olhar

Leia o `README.md` da pasta da aula — ele lista arquivos novos vs inalterados e os comandos da CLI.
