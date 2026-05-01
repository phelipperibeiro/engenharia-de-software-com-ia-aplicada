import type { Runtime } from '@langchain/langgraph';
import { OpenRouterService } from '../../services/openrouterService.ts';
import type { GraphState } from '../graph.ts';
import { ChatResponseSchema, getSystemPrompt, getUserPromptTemplate } from '../../prompts/v1/chatResponse.ts';
import { AIMessage, HumanMessage } from 'langchain';
import { PreferencesService } from '../../services/preferencesService.ts';
import { config } from '../../config.ts';


// Factory: monta o nó principal de conversa (primeiro nó após START)
export function createChatNode(llmClient: OpenRouterService, preferencesService: PreferencesService) {

  // Executado a cada mensagem do usuário; devolve resposta da IA + flags para os próximos nós
  return async (state: GraphState, runtime?: Runtime): Promise<Partial<GraphState>> => {

    // Identifica o usuário (CLI passa em runtime.context; fallback no estado)
    const userId = String(runtime?.context?.userId || state.userId || 'unknown')

    // Carrega perfil musical salvo no SQLite; injeta no system prompt se ainda não veio no estado
    const userContext = state.userContext ?? await preferencesService.getBasicInfo(userId)
    const systemPrompt = getSystemPrompt(userContext)

    // Histórico textual da thread (checkpointer) para o LLM ter contexto da conversa
    const conversationHistory = state.messages
      .map(msg => `${HumanMessage.isInstance(msg) ? 'User' : 'AI'}: ${msg.content}`)
      .join('\n')

    // Última mensagem é sempre a do usuário nesta invoke
    const userMessage = state.messages.at(-1)?.text as string
    const userPrompt = getUserPromptTemplate(
      userMessage,
      conversationHistory,
    )

    // OpenRouter responde em JSON: message, preferences?, shouldSavePreferences
    const result = await llmClient.generateStructured(
      systemPrompt,
      userPrompt,
      ChatResponseSchema,
    )

    // Erro de API/parse: adiciona AIMessage de fallback sem alterar preferências nem sumarização
    if (!result.success || !result.data) {
      console.error('❌ Falha ao gerar resposta:', result.error);
      return {
        messages: [
          new AIMessage('Desculpe, encontrei um erro. Pode tentar novamente?')
        ]
      }
    }

    const response = result.data

    // Calcular se a sumarização é necessária com base no total de mensagens
    // Após a sumarização, mantemos 2 mensagens (1 usuário + 1 IA)
    // Disparamos a sumarização quando há 6+ mensagens (3 trocas)
    // Isso resulta em: iniciais 2 + 4 novas mensagens = 6 mensagens no total
    const totalMessages = state.messages.length
    const needsSummarization = totalMessages >= config.maxMessagesToSummary

    return {
      // Acrescenta a resposta da IA ao histórico (merge do LangGraph com messages existentes)
      messages: [
        new AIMessage(response.message)
      ],
      // Só preenche se o LLM marcou shouldSavePreferences (dados novos declarados pelo usuário)
      extractedPreferences: response.shouldSavePreferences ? response.preferences : undefined,
      // edgeConditions usa esta flag para rotear → summarize
      needsSummarization,
    };
  };
}
