# Módulo 07.07 — resumo

## Contexto no curso

Sétima aula do Módulo 07. Usa o mesmo fechamento de Sprint 4 já analisado sob a lente de risco no Módulo 5 — agora o objetivo é **comunicar** essa mesma crise para três públicos diferentes sem reescrever a análise do zero.

## Arquivos da aula

| Arquivo | Papel |
|---|---|
| `status-report-prompt.md` | System prompt + query de exemplo + output de referência completo (tudo em um arquivo) |
| `output-exemplo-status-report-m72.md` | Backup do output (mesmo conteúdo, arquivo isolado) |
| `jira-estado-board.md` | Estado esperado: snapshot da Sprint 4 encerrada (mesmo com board ao vivo na Sprint 5) |
| `Atividade - Módulo 7.pdf`, `Exemplo - Módulo 7.pdf` | Materiais complementares |

## Como rodar

1. Colar o SYSTEM PROMPT em System Instructions (temperatura 0.3).
2. Colar os dados da Sprint 4 (já prontos em `status-report-prompt.md`) na mensagem do usuário.
3. Comparar os 3 relatórios gerados com a seção "OUTPUT DE REFERÊNCIA" do mesmo arquivo.
4. Rodar a Checklist de Curadoria antes de considerar pronto pra enviar.

## Takeaways

1. **Mesma sprint, três narrativas legítimas** — não é "resumir mais" pro executivo, é traduzir métrica técnica em risco de negócio.
2. **O Relatório Executivo nunca leva jargão técnico** — se SP/velocity/Lead Time aparecem ali, é erro de calibração, não estilo.
3. **Máximo 2 decisões no relatório gerencial** — força priorização em vez de empurrar a decisão inteira pro leitor.
4. **Status Vermelho não é opcional suavizar** — se os dados mostram risco sério, a linguagem de urgência é obrigatória nos 3 relatórios (calibrada por audiência, mas presente).
5. Essa mesma disciplina de "uma fonte, múltiplas audiências" reaparece no **Módulo 10** (scorecard de portfólio) — outro caso de consolidar dado técnico em decisão executiva.

## Onde olhar

O framework completo (3 audiências, restrições, checklist de curadoria): [status-report.md](./status-report.md).
