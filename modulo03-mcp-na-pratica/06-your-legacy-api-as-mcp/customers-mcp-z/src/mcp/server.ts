import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListCustomersTool } from "./tools/listCustomers.ts";
import { CustomerService } from "../application/customerService.ts";
import { registerApiInfoResource } from "./resources/apiInfo.ts";
import { registerCreateCustomersTool } from "./tools/createCustomer.ts";
import { registerGetCustomerTool } from "./tools/getCustomer.ts";
import { registerFindCustomerPrompt } from "./prompts/findCustomer.ts";
import { registerUpdateCustomersTool } from "./tools/updateCustomer.ts";
import { registerDeleteCustomersTool } from "./tools/deleteCustomer.ts";

const BASE_URL = "http://localhost:9999/v1";
const customerService = new CustomerService(BASE_URL)

export const mcpServer = new McpServer({
    name: "@erickwendel/ew-customers-mcp",
    version: "0.0.1",
});

// register tools
registerCreateCustomersTool(mcpServer, customerService)
registerGetCustomerTool(mcpServer, customerService)
registerListCustomersTool(mcpServer, customerService)
registerUpdateCustomersTool(mcpServer, customerService)
registerDeleteCustomersTool(mcpServer, customerService)

// register prompts
registerFindCustomerPrompt(mcpServer)

// register resources
registerApiInfoResource(mcpServer, BASE_URL)