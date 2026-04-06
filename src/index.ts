#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer, VERSION } from "./server.js";

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  const modules = process.env["ONEC_SERVICES"] || "all";
  console.error(`[1c-rest-mcp] v${VERSION} запущен (stdio). 9 инструментов. OData 3.0. Модули: ${modules}.`);
  console.error("[1c-rest-mcp] Опционально: ONEC_SERVICES=catalogs,documents,registers,reports,odata");
  console.error("[1c-rest-mcp] Требуются: ONEC_BASE_URL, ONEC_LOGIN, ONEC_PASSWORD.");
}

main().catch((error) => {
  console.error("[1c-rest-mcp] Ошибка:", error);
  process.exit(1);
});
