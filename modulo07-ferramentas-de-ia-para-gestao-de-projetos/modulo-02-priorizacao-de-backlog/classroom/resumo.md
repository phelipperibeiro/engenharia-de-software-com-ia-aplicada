# Módulo 07.02 — resumo

## Contexto no curso

Segunda aula do Módulo 07, dando sequência ao backlog RouteWise criado no Módulo 1. Antes de montar cronograma (Módulo 3), o backlog precisa de uma ordem defensável — é isso que o Backlog Scorer (RICE + WSJF) resolve.

## Arquivos da aula

| Arquivo | Papel |
|---|---|
| `backlog-scorer-prompt.md` | Template RICE/WSJF + variante para System Instructions + prompt degradado |
| `backlog-routewise-input.md` | Contexto (OKR de Carlos) + 6 User Stories do RouteWise |
| `output-exemplo-scorer-m23.md` | Output calibrado (U2.3) + comparativo com a rodada sem calibração (U2.2) |
| `jira-estado-board.md` | Estado esperado do board: backlog plano, Sprint 1 não iniciada |
| `Atividade - Módulo 2.pdf`, `Exemplo - Módulo 2.pdf` | Materiais complementares |

## Como rodar

1. Colar o contexto de negócio (OKR + perfil da empresa + restrições) no template.
2. Colar as User Stories de `backlog-routewise-input.md`.
3. Rodar no AI Studio e comparar com `output-exemplo-scorer-m23.md`.
4. Repetir com dados de calibração (analogia com feature parecida, benchmark de mercado) e observar como o ranking muda.

## Takeaways

1. **RICE e WSJF são só tão bons quanto a âncora do Reach/Impact** — sem dado real, é estimativa; com analogia/benchmark, o número muda drasticamente (420 → 3.091 no exemplo).
2. **Toda estimativa carrega justificativa obrigatória** — "Impact 3" sem explicação não passa no formato do prompt.
3. **Confidence baixo vira Flag, não decisão silenciosa** — itens com Confidence < 70% ou dependência não resolvida ficam sinalizados para validação humana.
4. **Prompt genérico ("priorize isso pra mim") produz ranking indefensável** — sem OKR como âncora, o modelo inventa critério e usa linguagem vaga.
5. O ranking resultante alimenta diretamente o **Módulo 3** (cronograma) — a ordem de prioridade vira ordem de alocação em sprint.

## Onde olhar

O framework completo (RICE, WSJF, calibração, prompt degradado): [backlog-scorer.md](./backlog-scorer.md).
