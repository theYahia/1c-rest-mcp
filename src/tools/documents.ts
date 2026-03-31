import { z } from "zod";
import { oneCGet, oneCPost } from "../client.js";

export const getDocumentsSchema = z.object({
  document_type: z.string().optional().describe("Тип документа (например, РеализацияТоваровУслуг)"),
  date_from: z.string().optional().describe("Дата начала (YYYY-MM-DD)"),
  date_to: z.string().optional().describe("Дата окончания (YYYY-MM-DD)"),
  limit: z.number().int().min(1).max(1000).default(100).describe("Количество записей"),
});

export async function handleGetDocuments(params: z.infer<typeof getDocumentsSchema>): Promise<string> {
  const query = new URLSearchParams();
  if (params.date_from) query.set("dateFrom", params.date_from);
  if (params.date_to) query.set("dateTo", params.date_to);
  query.set("limit", String(params.limit));

  const path = params.document_type
    ? `/documents/${encodeURIComponent(params.document_type)}?${query.toString()}`
    : `/documents?${query.toString()}`;

  const result = await oneCGet(path);
  return JSON.stringify(result, null, 2);
}

export const createDocumentSchema = z.object({
  document_type: z.string().describe("Тип документа (например, РеализацияТоваровУслуг)"),
  data: z.record(z.unknown()).describe("Данные документа в формате JSON"),
});

export async function handleCreateDocument(params: z.infer<typeof createDocumentSchema>): Promise<string> {
  const result = await oneCPost(
    `/documents/${encodeURIComponent(params.document_type)}`,
    params.data,
  );
  return JSON.stringify(result, null, 2);
}
