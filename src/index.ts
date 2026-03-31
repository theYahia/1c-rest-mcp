#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getCatalogsSchema, handleGetCatalogs } from "./tools/catalogs.js";
import { getDocumentsSchema, handleGetDocuments, createDocumentSchema, handleCreateDocument } from "./tools/documents.js";

const server = new McpServer({
  name: "1c-rest-mcp",
  version: "1.0.0",
});

server.tool(
  "get_catalogs",
  "Получение данных из справочников 1С.",
  getCatalogsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetCatalogs(params) }] }),
);

server.tool(
  "get_documents",
  "Получение документов 1С по типу и периоду.",
  getDocumentsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetDocuments(params) }] }),
);

server.tool(
  "create_document",
  "Создание нового документа в 1С.",
  createDocumentSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCreateDocument(params) }] }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[1c-rest-mcp] Сервер запущен. 3 инструмента. Требуются 1C_BASE_URL, 1C_LOGIN, 1C_PASSWORD.");
}

main().catch((error) => {
  console.error("[1c-rest-mcp] Ошибка:", error);
  process.exit(1);
});
