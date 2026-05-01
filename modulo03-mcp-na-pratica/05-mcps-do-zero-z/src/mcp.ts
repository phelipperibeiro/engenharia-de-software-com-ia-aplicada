import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { z } from 'zod/v3'
import { decrypt, encrypt } from "./service.ts";

export const server = new McpServer({
    name: '@erickwendel/ciphersuite-mcp',
    version: '0.0.1'
})

/**
 * MCP Tool — uma "ferramenta" que o cliente (ex.: Cursor, Claude Desktop) pode
 * chamar em nome do usuário. O LLM lê name + description para decidir quando usar.
 */
server.registerTool(
    'encrypt_message',
    {
        description:
            'Criptografa um texto em formato seguro (AES-256). Use quando o usuário pedir para ' +
            'proteger, codificar ou "embaralhar" uma mensagem. Retorna uma string no formato iv:ciphertext ' +
            'que pode ser descriptografada depois com a mesma senha.',
        inputSchema: {
            message: z.string().describe(
                'Texto em claro que você quer proteger (ex.: "Olá, mundo")'
            ),
            encryptionKey: z.string().describe(
                'Senha escolhida pelo usuário. Pode ser qualquer frase — o servidor transforma ' +
                'ela em chave forte internamente (scrypt). Guarde mentalmente: a mesma senha ' +
                'será necessária para descriptografar.'
            )
        },
        outputSchema: {
            encryptedMessage: z.string().describe(
                'Texto criptografado no formato "iv:ciphertext" (dois blocos hex separados por ":"). ' +
                'Copie essa string inteira para usar em decrypt_message.'
            )
        }
    },
    async ({ message, encryptionKey }) => {
        try {
            const encryptedMessage = encrypt(message, encryptionKey)
            return {
                content: [{ type: "text", text: encryptedMessage }],
                structuredContent: { encryptedMessage }
            }
        } catch (error) {
            return {
                isError: true,
                content: [{
                    type: 'text',
                    text: `Failed to encrypt message! Check if the message and encryption key are correct. Error details: ${error instanceof Error ? error.message : String(error)}`
                }]
            }
        }

    }
)

/**
 * MCP Tool — par da encrypt_message. Só funciona com o texto retornado por ela
 * e com a mesma senha usada na criptografia.
 */
server.registerTool(
    'decrypt_message',
    {
        description:
            'Descriptografa um texto que foi gerado pela tool encrypt_message. Use quando o usuário ' +
            'tiver uma string iv:ciphertext e quiser ler o conteúdo original. A senha deve ser ' +
            'exatamente a mesma usada na criptografia.',
        inputSchema: {
            encryptedMessage: z.string().describe(
                'String completa retornada por encrypt_message, no formato iv:ciphertext ' +
                '(ex.: "a1b2c3...:d4e5f6..."). Não remova nem altere nenhuma parte.'
            ),
            encryptionKey: z.string().describe(
                'A mesma senha/passphrase que foi usada ao chamar encrypt_message'
            )
        },
        outputSchema: {
            decryptedMessage: z.string().describe(
                'Mensagem original em texto legível, antes da criptografia'
            )
        }
    },
    async ({ encryptedMessage, encryptionKey })=> {
        try {
            const decryptedMessage = decrypt(encryptedMessage, encryptionKey)
            return {
                content: [{ type: 'text', text: decryptedMessage }],
                structuredContent: { decryptedMessage }
            }

        } catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Failed to decrypt message! Check if the encrypted message is correct and if the encryption key matches the one used for encryption. Error details: ${error instanceof Error ? error.message : String(error)}`,

                    }
                ]
            }

        }
    }
)

/**
 * MCP Resource — dados somente leitura que o cliente pode listar e buscar.
 * Diferente de Tool: não executa ação; expõe informação de referência (como um "documento").
 */
server.registerResource(
    'encryption://info',
    'encryption://info',
    {
        description:
            'Documentação técnica deste servidor MCP: algoritmo de criptografia (AES-256-CBC), ' +
            'como a senha vira chave, formato da saída iv:ciphertext e dicas para usar ' +
            'encrypt_message e decrypt_message corretamente. Leia antes de implementar integrações.',
    },
    () => ({
        contents: [
            {
                uri: "encryption://info",
                mimeType: "text/plain",
                text: `
Algorithm : AES-256-CBC
Key derivation: scrypt (passphrase + fixed server salt → 32-byte key)
Output format: <16-byte IV in hex>:<ciphertext in hex>  (separated by ":")
Notes:
  - Users pass any passphrase — the server derives a strong 32-byte key automatically using scrypt.
  - A random IV is generated for every encryption — the same message encrypted twice will produce different output.
  - Use the exact same passphrase to decrypt.
  - Keep the full "iv:ciphertext" string to decrypt later.
                `.trim(),
            },
        ]
    })
)

/**
 * MCP Prompt — template pronto que monta uma mensagem para o LLM.
 * O cliente chama getPrompt(...) e recebe instruções padronizadas (útil para fluxos repetíveis).
 */
server.registerPrompt(
    "encrypt_message_prompt",
    {
        description:
            'Template que pede ao assistente para criptografar uma mensagem usando a tool encrypt_message. ' +
            'Use quando quiser um fluxo padronizado: o prompt já inclui a mensagem e a senha nos ' +
            'argumentos, e orienta o LLM a chamar a tool correta.',
        argsSchema: {
            message: z.string().describe(
                'Texto que será criptografado (repassado ao prompt e à tool)'
            ),
            encryptionKey: z.string().describe(
                'Senha que será usada na criptografia (repassada ao prompt e à tool)'
            )
        }
    },
    ({ message, encryptionKey }) => ({
        messages: [
            {
                role: 'user',
                content: {
                    type: "text",
                    text: `Please encrypt the following message using the encrypt_message tool.\nMessage: ${message}\nEncryption key: ${encryptionKey}`,
                }
            }
        ]
    })
)
