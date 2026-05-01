import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres"
import { PostgresStore } from "@langchain/langgraph-checkpoint-postgres/store"
import { config } from "../config.ts"

export type MemoryService = {
    checkpointer: PostgresSaver
    store: PostgresStore
}

export async function createMemoryService(): Promise<MemoryService> {
    const dbUri = config.memory.dbUri

    // PostgresStore — store do LangGraph (dados auxiliares por namespace; não substitui o estado do grafo)
    const store = PostgresStore.fromConnString(dbUri)

    // PostgresSaver — checkpointer: persiste o GraphState inteiro por thread_id entre invocações
    const checkpointer = PostgresSaver.fromConnString(dbUri)

    // Cria tabelas no PostgreSQL (docker-compose) na primeira execução
    await store.setup()
    await checkpointer.setup()

    console.log(`✅ Memória configurada: PostgreSQL`);
    return {
        checkpointer,
        store,
    }
}