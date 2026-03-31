/**
 * Skill: skill-documents
 * Quick document query — wraps get_documents with date range helpers.
 *
 * Usage in MCP client:
 *   skill-documents РеализацияТоваровУслуг --from 2024-01-01 --to 2024-12-31
 */

import { handleGetDocuments } from "../tools/documents.js";

export interface DocumentsSkillInput {
  /** Short document type without prefix (e.g. "РеализацияТоваровУслуг") */
  type: string;
  /** Start date YYYY-MM-DD */
  from?: string;
  /** End date YYYY-MM-DD */
  to?: string;
  /** Max results, default 50 */
  limit?: number;
}

export async function runDocumentsSkill(input: DocumentsSkillInput): Promise<string> {
  const docType = input.type.startsWith("Document_")
    ? input.type
    : `Document_${input.type}`;

  const filters: string[] = [];
  if (input.from) {
    filters.push(`Date ge datetime'${input.from}T00:00:00'`);
  }
  if (input.to) {
    filters.push(`Date le datetime'${input.to}T23:59:59'`);
  }

  return handleGetDocuments({
    document_type: docType,
    filter: filters.length ? filters.join(" and ") : undefined,
    top: input.limit ?? 50,
    skip: 0,
    orderby: "Date desc",
  });
}
