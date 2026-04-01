#!/usr/bin/env node
/**
 * Streamable HTTP transport for 1c-rest-mcp.
 * Usage: ONEC_BASE_URL=... ONEC_LOGIN=... ONEC_PASSWORD=... node dist/http.js [--port 3000]
 */

import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer, VERSION } from "./server.js";
import http from "node:http";

const PORT = parseInt(process.env["PORT"] || "3000", 10);

async function main() {
  const server = createServer();

  const httpServer = http.createServer(async (req, res) => {
    // Health check
    if (req.method === "GET" && req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", version: VERSION }));
      return;
    }

    if (req.url === "/mcp" || req.url === "/") {
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
      await server.connect(transport);
      await transport.handleRequest(req, res);
    } else {
      res.writeHead(404);
      res.end("Not found");
    }
  });

  httpServer.listen(PORT, () => {
    console.error(`[1c-rest-mcp] v${VERSION} HTTP on port ${PORT}. 7 tools. OData 3.0.`);
  });
}

main().catch((error) => {
  console.error("[1c-rest-mcp] HTTP error:", error);
  process.exit(1);
});
