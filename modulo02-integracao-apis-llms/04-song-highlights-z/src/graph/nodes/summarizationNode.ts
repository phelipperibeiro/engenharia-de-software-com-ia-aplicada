import { HumanMessage } from 'langchain';
import { type Runtime } from '@langchain/langgraph'
import { OpenRouterService } from '../../services/openrouterService.ts';
import type { GraphState } from '../graph.ts';
import { type ConversationSummary, getSummarizationSystemPrompt, getSummarizationUserPrompt, SummarySchema } from '../../prompts/v1/summarization.ts';
import { PreferencesService } from '../../services/preferencesService.ts';
import { RemoveMessage } from '@langchain/core/messages';

// Factory: recebe dependências injetadas e devolve a função-nó do LangGraph
export function createSummarizationNode(llmClient: OpenRouterService, preferencesService: PreferencesService) {

    // Nó executado quando needsSummarization === true (histórico ficou grande demais)
    return async (state: GraphState, runtime?: Runtime): Promise<Partial<GraphState>> => {

        // Converte mensagens do grafo em { role, content } para o prompt de sumarização
        const conversationHistory = state.messages.map(msg => ({
            role: HumanMessage.isInstance(msg) ? 'User' : 'AI',
            content: msg.text
        }))

        // Se já houve sumarização antes, o LLM mescla com o sumário anterior (não perde dados antigos)
        const previousSummary = state.conversationSummary as ConversationSummary | undefined
        const systemPrompt = getSummarizationSystemPrompt()
        const userPrompt = getSummarizationUserPrompt(
            conversationHistory,
            previousSummary,
        )

        // LLM (OpenRouter) devolve JSON validado pelo SummarySchema (nome, gêneros, bandas, etc.)
        const result = await llmClient.generateStructured(
            systemPrompt,
            userPrompt,
            SummarySchema,
        )

        // Falha na API ou no parse: desliga a flag para não entrar em loop de sumarização
        if (result.error || !result.data) {
            console.error('❌ Falha ao sumarizar conversa:', result.error);

            return {
                needsSummarization: false
            }
        }

        // userId vem do context da invoke (CLI) ou do estado; identifica o perfil no SQLite
        const userId = String(runtime?.context?.userId || state.userId || 'unknown')

        // Persiste o sumário estruturado em user_preferences (memória de longo prazo)
        await preferencesService.storeSummary(
            userId, result.data,
        )

        // Remove do checkpointer todas as mensagens exceto as 2 últimas (última troca user + AI)
        // RemoveMessage instrui o LangGraph a apagar pelo id no histórico persistido
        const deleteMessages = state.messages
            .slice(0, -2)
            .map(m => new RemoveMessage({ id: m.id as string }))


        return {
            messages: deleteMessages,
            conversationSummary: result.data,
            needsSummarization: false, // sumarização concluída; próxima rodada não reentra aqui
        };
    };
}
