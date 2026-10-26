# O que acontece de fato — passo a passo mecânico do Módulo 2

Igual ao Módulo 1: aqui **não roda nenhum programa**. É preenchimento de template + chat com IA + leitura de tabela. A "matemática" do RICE/WSJF é feita pelo modelo dentro da resposta de texto, não por uma calculadora separada.

---

## Passo a passo

### Passo 1: Preencher o template com os dados do seu projeto

Você abre `backlog-scorer-prompt.md`, copia o bloco de template e substitui os campos `[PREENCHER]` — contexto de negócio (OKR, empresa, restrições) e o backlog (as User Stories completas). Isso é edição de texto, feita por você, não pela IA.

### Passo 2: Colar no AI Studio

Diferente do Módulo 1 (que usava "System Instructions"), aqui o template inteiro (já preenchido) vai direto na **mensagem do usuário**. Existe uma variante opcional pra colocar o contexto fixo em "System Instructions" quando você vai rodar várias sessões de scoring pro mesmo projeto — mas o cálculo em si continua acontecendo na resposta do chat.

### Passo 3: O modelo "calcula" RICE e WSJF — mas calcula em texto, não em código

Quando o Gemini responde com a Tabela RICE e a Tabela WSJF, ele está **gerando números plausíveis seguindo a fórmula descrita no prompt** (`RICE = R×I×C/E`), não executando uma fórmula de planilha de verdade. Ele "faz a conta" da mesma forma que faz o resto do texto: prevendo a sequência mais provável de tokens dado o que você pediu.

**Isso importa:** se você mudar um número de Reach no meio da conversa e pedir "recalcule", o modelo tende a acertar contas simples, mas não há garantia matemática como teria uma fórmula de Excel — é sempre bom conferir a aritmética manualmente em números que vão pra uma decisão real.

### Passo 4: Comparar duas rodadas (o ponto pedagógico do módulo)

O material roda o **mesmo prompt duas vezes**: uma sem dado de calibração (Reach estimado só por "140 veículos") e outra com dado de calibração (Reach por analogia com outro cliente). Isso não é um script comparando automaticamente — é você, comparando as duas respostas de chat lado a lado (`output-exemplo-scorer-m23.md` documenta essa comparação).

### Passo 5: Ler o ranking e decidir

O output final é uma tabela e uma lista ordenada, texto puro. A decisão de "o que entra primeiro no cronograma" (Módulo 3) é humana — o modelo não escreve em nenhum board, banco de dados ou planilha automaticamente.

---

## Tabela-resumo: o que é o quê

| Etapa | Parece que é | De fato é |
|---|---|---|
| "Calcular RICE/WSJF" | Uma fórmula sendo executada | Geração de texto seguindo uma fórmula descrita em prompt — sem garantia matemática de uma calculadora real |
| Comparação U2.2 vs U2.3 | Um script de diff automático | Duas respostas de chat separadas, comparadas manualmente |
| Ranking final | Saída de um sistema de priorização | Uma lista em texto — a decisão de agir sobre ela é sempre humana |

## Por que isso importa

Se você precisar de um número que **realmente não pode estar errado** (ex: cálculo financeiro que vai virar contrato), não confie só na "conta" que o LLM mostra na tabela — refaça em calculadora/planilha. A aula do Módulo 4 é explícita sobre esse limite: é por isso que o Monte Carlo daquele módulo roda em **script real**, não em prompt — porque ali o erro de "parecer estatístico mas não ser" é inaceitável.
