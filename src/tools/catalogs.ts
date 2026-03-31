import { z } from "zod";
import { oneCGet } from "../client.js";

export const getCatalogsSchema = z.object({
  catalog_name: z.string().optional().describe("Имя справочника (например, Номенклатура)"),
  search: z.string().optional().describe("Строка поиска"),
  limit: z.number().int().min(1).max(1000).default(100).describe("Количество записей"),
});

export async function handleGetCatalogs(params: z.infer<typeof getCatalogsSchema>): Promise<string> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  query.set("limit", String(params.limit));

  const path = params.catalog_name
    ? `/catalogs/${encodeURIComponent(params.catalog_name)}?${query.toString()}`
    : `/catalogs?${query.toString()}`;

  const result = await oneCGet(path);
  return JSON.stringify(result, null, 2);
}
