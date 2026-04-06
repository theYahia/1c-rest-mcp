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
import {
  listEntitiesSchema, handleListEntities,
  getDocumentByNumberSchema, handleGetDocumentByNumber,
} from "./tools/metadata.js";

export const VERSION = "1.2.1";

/**
 * Фильтрация модулей через переменную окружения ONEC_SERVICES.
 * Значение: comma-separated список модулей (catalogs, documents, registers, reports, odata, meta).
 * Пример: ONEC_SERVICES=catalogs,documents
 * По умолчанию (переменная не задана): регистрируются все tools.
 */
function getEnabledModules(): Set<string> {
  const env = process.env["ONEC_SERVICES"];
  if (!env || env.trim() === "" || env.trim() === "all") {
    return new Set(["catalogs", "documents", "registers", "reports", "odata", "meta"]);
  }
  return new Set(env.split(",").map((s) => s.trim().toLowerCase()));
}

export function createServer(): McpServer {
  const server = new McpServer({
    name: "1c-rest-mcp",
    version: VERSION,
  });

  const modules = getEnabledModules();

  // --- Discovery (meta) — всегда включён ---
  // list_entities и get_document_by_number регистрируются независимо от ONEC_SERVICES,
  // потому что без них агент не сможет узнать структуру базы.
  server.tool(
    "list_entities",
    "Получить список всех доступных сущностей базы 1С: справочники (Catalog_*), " +
    "документы (Document_*), регистры (AccumulationRegister_*, InformationRegister_*). " +
    "Используй этот инструмент первым при работе с незнакомой базой 1С.",
    listEntitiesSchema.shape,
    async (params) => ({
      content: [{ type: "text", text: await handleListEntities(params) }],
    }),
  );

  server.tool(
    "get_document_by_number",
    "Найти документ в 1С по номеру. Удобная обёртка над OData $filter. " +
    "Пример: найти накладную №ТД-00123 от 2025-03-01.",
    getDocumentByNumberSchema.shape,
    async (params) => ({
      content: [{ type: "text", text: await handleGetDocumentByNumber(params) }],
    }),
  );

  // --- Catalogs ---
  if (modules.has("catalogs")) {
    server.tool(
      "get_catalogs",
      "Получение данных из справочников 1С через OData 3.0. Поддерживает фильтрацию, сортировку, пагинацию.",
      getCatalogsSchema.shape,
      async (params) => ({
        content: [{ type: "text", text: await handleGetCatalogs(params) }],
      }),
    );
  }

  // --- Documents ---
  if (modules.has("documents")) {
    server.tool(
      "get_documents",
      "Получение документов 1С через OData 3.0. Фильтрация по дате, типу, произвольным полям.",
      getDocumentsSchema.shape,
      async (params) => ({
        content: [{ type: "text", text: await handleGetDocuments(params) }],
      }),
    );

    server.tool(
      "create_document",
      "Создание нового документа в 1С через OData POST.",
      createDocumentSchema.shape,
      async (params) => ({
        content: [{ type: "text", text: await handleCreateDocument(params) }],
      }),
    );

    server.tool(
      "update_document",
      "Обновление существующего документа в 1С через OData PATCH.",
      updateDocumentSchema.shape,
      async (params) => ({
        content: [{ type: "text", text: await handleUpdateDocument(params) }],
      }),
    );
  }

  // --- Registers ---
  if (modules.has("registers")) {
    server.tool(
      "get_register",
      "Получение данных из регистров 1С (информационных и накопления) через OData 3.0.",
      getRegisterSchema.shape,
      async (params) => ({
        content: [{ type: "text", text: await handleGetRegister(params) }],
      }),
    );
  }

  // --- Reports ---
  if (modules.has("reports")) {
    server.tool(
      "get_report",
      "Получение отчёта из 1С по произвольному URL HTTP-сервиса (/hs/...).",
      getReportSchema.shape,
      async (params) => ({
        content: [{ type: "text", text: await handleGetReport(params) }],
      }),
    );
  }

  // --- Generic OData ---
  if (modules.has("odata")) {
    server.tool(
      "odata_query",
      "Произвольный OData 3.0 запрос к любой сущности 1С. Поддерживает $filter, $select, $expand, $orderby, $top, $skip, $inlinecount.",
      odataQuerySchema.shape,
      async (params) => ({
        content: [{ type: "text", text: await handleODataQuery(params) }],
      }),
    );
  }

  return server;
}
