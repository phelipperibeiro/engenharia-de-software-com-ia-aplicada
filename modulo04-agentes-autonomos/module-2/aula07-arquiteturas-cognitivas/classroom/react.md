# ReAct como contrato (Aula 07)

`contratos.py` carrega os 9 contratos e, se `--arquitetura react`, sobrescreve `planejador` e `executor` com `architectures/react/`.

Open-Closed: runtime sem `if/else` por arquitetura.

Flag: `--arquitetura {react, plan_execute, reflect}`.

ReAct exige campo `raciocínio` no formato de saída — o trace mostra **por que** a decisão aconteceu.
