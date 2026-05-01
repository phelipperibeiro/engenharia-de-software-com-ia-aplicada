import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { HumanMessage } from '@langchain/core/messages';
import { buildGraph } from './graph/factory.ts';

function parseArgs(): { userId?: string } {
  const args = process.argv.slice(2);
  const userIndex = args.indexOf('--user');

  if (userIndex !== -1 && args[userIndex + 1]) {
    return { userId: args[userIndex + 1] };
  }

  return {};
}

async function main(): Promise<void> {
  const readline = createInterface({ input: stdin, output: stdout });

  try {
    console.log('═'.repeat(60));
    console.log('  🎵 Recomendador de Músicas com Memória (LangGraph)');
    console.log('═'.repeat(60));
    console.log('\nDigite suas mensagens abaixo. Digite "exit" para sair.\n');

    /**
     * buildGraph: cria o grafo e as dependências
     * graph: o grafo compilado
     * preferencesService: o serviço de preferências
     */
    const { graph, preferencesService } = await buildGraph();

    /**
     * parseArgs: parseia os argumentos da linha de comando
     * userId: o usuário que está conversando
     * actualUserId: o usuário que está conversando ou 'anonymous' se não for fornecido
     * threadId: o id da thread da conversa
     * config: a configuração do grafo
     */
    const { userId } = parseArgs();
    const actualUserId = userId || 'anonymous';
    const threadId = `${actualUserId}-${Date.now()}`;
    const config = {
      configurable: { thread_id: threadId },
      context: { userId: actualUserId }
    };

    /**
     * console.log: imprime o usuário e o id da thread da conversa
     */
    console.log(`👤 Usuário: ${actualUserId}`);
    console.log(`💬 Thread da Conversa: ${threadId}\n`);

    /**
     * preferencesService.getBasicInfo: pega as informações básicas do usuário (sqlite)
     * userContext: as informações básicas do usuário (sqlite)
     */
    const userContext = await preferencesService.getBasicInfo(actualUserId);
    if (userContext) {
      console.log(`📚 Informações do usuário carregadas:\n${userContext}\n`);
    }

    try {
      /**
       * initialMessage: a mensagem inicial da conversa
       * userContext: as informações básicas do usuário (sqlite)
       * userId: o usuário que está conversando
       */
      const initialMessage = userContext
        ? 'Inicie a conversa de forma casual mencionando o que você sabe sobre mim e recomende uma música!'
        : 'Olá! Me apresente de forma amigável e pergunte sobre meu nome e preferências musicais.';

      /**
       * graph.invoke: invoca o grafo
       * messages: as mensagens da conversa
       * userContext: as informações básicas do usuário (sqlite)
       * userId: o usuário que está conversando
       * config: a configuração do grafo
       */
      const result = await graph.invoke(
        {
          messages: [new HumanMessage(initialMessage)],
          userContext,
          userId: actualUserId,
        },
        config
      );

      /**
       * greeting: a resposta da IA
       * result.messages: as mensagens da conversa
       * result.messages.length - 1: a última mensagem da conversa
       */
      const greeting = result.messages[result.messages.length - 1];
      /**
       * console.log: imprime a resposta da IA
       */
      console.log(`AI: ${greeting.content}\n`);
    } catch (error) {
      console.error('❌ Erro ao iniciar conversa:', (error as Error).message);
    }

    /**
     * while: loop infinito para continuar a conversa
     * userInput: a mensagem do usuário
     * if: se a mensagem do usuário for vazia, continua o loop
     * if: se a mensagem do usuário for 'exit', sai do loop
     */
    while (true) {
      /**
       * userInput: a mensagem do usuário
       * readline.question: lê a mensagem do usuário
       */
      const userInput = await readline.question('Você: ');

      if (!userInput.trim()) continue;
      if (userInput.toLowerCase() === 'exit') {
        console.log('\n👋 Até mais!\n');
        break;
      }

      try {
        /**
         * graph.invoke: invoca o grafo
         * messages: as mensagens da conversa
         * userId: o usuário que está conversando
         * config: a configuração do grafo
         */
        const result = await graph.invoke(
          {
            messages: [new HumanMessage(userInput)],
            userId: actualUserId,
          },
          config
        );

        /**
         * lastMessage: a última mensagem da conversa
         * result.messages: as mensagens da conversa
         * result.messages.length - 1: a última mensagem da conversa
         */
        const lastMessage = result.messages[result.messages.length - 1];
        /**
         * console.log: imprime a resposta da IA
         */
        console.log(`\nAI: ${lastMessage.content}\n`);

      } catch (error) {
        console.error('\n❌ Erro ao gerar resposta:', error instanceof Error ? error.message : 'Erro desconhecido');
        console.log('AI: Desculpe, encontrei um erro. Pode tentar novamente?\n');
      }
    }

    readline.close();

  } catch (error) {
    /**
     * console.error: imprime o erro fatal
     * (error as Error).message: o erro fatal
     * (error as Error).stack: o stack trace do erro
     * process.exit: sai do programa
     */
    console.error('\n❌ Erro fatal:', (error as Error).message);
    console.error('\nStack trace:', (error as Error).stack);
    process.exit(1);
  }
}

main();
