import type { Runtime } from '@langchain/langgraph';
import type { GraphState } from '../graph.ts';
import { PreferencesService } from '../../services/preferencesService.ts';

// Factory: nó intermediário entre chat e summarize/END (sem LLM)
export function createSavePreferencesNode(preferencesService: PreferencesService) {
  // Só roda quando routeAfterChat envia para 'savePreferences' (extractedPreferences preenchido)
  return async (state: GraphState, runtime?: Runtime): Promise<Partial<GraphState>> => {
    // Guard: se o chat não extraiu nada, não altera o estado
    if(!state.extractedPreferences) return {}

    const userId = String(runtime?.context?.userId || state.userId || 'unknown')

    // Mescla novos gêneros/bandas/nome no SQLite (deduplica arrays, preserva dados antigos)
    await preferencesService.mergePreferences(userId, state.extractedPreferences)

    // Limpa extractedPreferences para não salvar de novo na mesma rodada do grafo
    return {
      extractedPreferences: undefined
    };
  };
}
