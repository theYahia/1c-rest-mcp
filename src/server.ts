import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getCatalogsSchema, handleGetCatalogs } from "./tools/catalogs.js";
import {
  getDocumentsSchema, handleGetDocuments,
  createDocumentSchema, handleCreateDocument,
  updateDocumentSchema, handleUpdateDocument,
} from "./tools/documents.js";
import { getRegisterSchema, handleGetRegister } from "./tools/registers.js";
import { getReportSchema, handleGetReport } from "./tools/reports.js";
import { odataQuerySchema, handleODataQuery } from "./tools/odata-query.js";

export const VERSION = "1.1.0";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "1c-rest-mcp",
    version: VERSION,
  });

  // --- Catalogs ---
  server.tool(
    "get_catalogs",
    "Получение данных из справочников 1С через OData 3.0. Поддерживает фильтрацию, сортировку, пагинацию.",
    getCatalogsSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleGetCatalogs(params) }] }),
  );

  // --- Documents ---
  server.tool(
    "get_documents",
    "Получение документов 1С через OData 3.0. Фильтрация по дате, типу, произвольным полям.",
    getDocumentsSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleGetDocuments(params) }] }),
  );

  server.tool(
    "create_document",
    "Создание нового документа в 1С через OData POST.",
    createDocumentSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleCreateDocument(params) }] }),
  );

  server.tool(
    "update_document",
    "Обновление существующего документа в 1С через OData PATCH.",
    updateDocumentSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleUpdateDocument(params) }] }),
  );

  // --- Registers ---
  server.tool(
    "get_register",
    "Получение данных из регистров 1С (информационных и накопления) через OData 3.0.",
    getRegisterSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleGetRegister(params) }] }),
  );

  // --- Reports ---
  server.tool(
    "get_report",
    "Получение отчёта из 1С по произвольному URL HTTP-сервиса (/hs/...).",
    getReportSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleGetReport(params) }] }),
  );

  // --- Generic OData ---
  server.tool(
    "odata_query",
    "Произвольный OData 3.0 запрос к любой сущности 1С. Поддерживает $filter, $select, $expand, $orderby, $top, $skip, $inlinecount.",
    odataQuerySchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleODataQuery(params) }] }),
  );

  return server;
}
