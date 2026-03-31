#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer, VERSION } from "./server.js";

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`[1c-rest-mcp] v${VERSION} запущен (stdio). 7 инструментов. OData 3.0.`);
  console.error("[1c-rest-mcp] Требуются: ONEC_BASE_URL, ONEC_LOGIN, ONEC_PASSWORD.");
}

main().catch((error) => {
  console.error("[1c-rest-mcp] Ошибка:", error);
  process.exit(1);
});
