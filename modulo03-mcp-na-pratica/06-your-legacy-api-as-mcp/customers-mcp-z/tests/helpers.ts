import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export async function createTestClient () {
    const transport = new StdioClientTransport({
        command: 'node',
        args: [
            '--experimental-strip-types', // remove the types from the code
            'src/index.ts' // path to the MCP server
        ]
    })

    const client = new Client({
        name: 'test-client',
        version: '1.0.1'
    }, {
        capabilities: {}
    })

    await client.connect(transport)
    return client
}