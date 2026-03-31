/**
 * Skill: skill-catalog
 * Quick catalog lookup — wraps get_catalogs with sensible defaults.
 *
 * Usage in MCP client:
 *   skill-catalog Номенклатура "Молоко"
 *   → Calls get_catalogs with catalog_name=Catalog_Номенклатура, filter contains 'Молоко'
 */

import { handleGetCatalogs } from "../tools/catalogs.js";

export interface CatalogSkillInput {
  /** Short catalog name without prefix (e.g. "Номенклатура") */
  name: string;
  /** Optional search term for Description contains filter */
  search?: string;
  /** Max results, default 20 */
  limit?: number;
}

export async function runCatalogSkill(input: CatalogSkillInput): Promise<string> {
  const catalogName = input.name.startsWith("Catalog_")
    ? input.name
    : `Catalog_${input.name}`;

  const filter = input.search
    ? `substringof('${input.search}', Description)`
    : undefined;

  return handleGetCatalogs({
    catalog_name: catalogName,
    filter,
    top: input.limit ?? 20,
    skip: 0,
  });
}
