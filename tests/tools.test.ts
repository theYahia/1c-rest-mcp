import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { handleGetCatalogs } from "../src/tools/catalogs.js";
import { handleGetDocuments, handleCreateDocument, handleUpdateDocument } from "../src/tools/documents.js";
import { handleGetRegister } from "../src/tools/registers.js";
import { handleGetReport } from "../src/tools/reports.js";
import { handleODataQuery } from "../src/tools/odata-query.js";

function mockFetchOk(data: unknown) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
  }));
}

describe("tool handlers", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env["ONEC_BASE_URL"] = "http://test:8080";
    process.env["ONEC_LOGIN"] = "user";
    process.env["ONEC_PASSWORD"] = "pass";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it("handleGetCatalogs returns JSON string", async () => {
    const data = { value: [{ Ref_Key: "1", Description: "Test" }] };
    mockFetchOk(data);

    const result = await handleGetCatalogs({ catalog_name: "Catalog_Test", top: 10, skip: 0 });
    const parsed = JSON.parse(result);
    expect(parsed.value).toHaveLength(1);
    expect(parsed.value[0].Description).toBe("Test");
  });

  it("handleGetDocuments applies filter", async () => {
    mockFetchOk({ value: [] });

    await handleGetDocuments({
      document_type: "Document_Test",
      filter: "Date ge datetime'2024-01-01T00:00:00'",
      top: 50,
      skip: 0,
    });

    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("$filter=");
    expect(url).toContain("$top=50");
  });

  it("handleCreateDocument sends POST", async () => {
    mockFetchOk({ Ref_Key: "new-guid" });

    const result = await handleCreateDocument({
      document_type: "Document_Test",
      data: { Number: "001" },
    });
    const parsed = JSON.parse(result);
    expect(parsed.Ref_Key).toBe("new-guid");
  });

  it("handleUpdateDocument sends PATCH", async () => {
    mockFetchOk({ Ref_Key: "abc" });

    const result = await handleUpdateDocument({
      document_type: "Document_Test",
      ref_key: "abc-def-123",
      data: { Posted: true },
    });

    const [url, opts] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("guid'abc-def-123'");
    expect(opts.method).toBe("PATCH");
    expect(JSON.parse(result).Ref_Key).toBe("abc");
  });

  it("handleGetRegister builds correct entity path", async () => {
    mockFetchOk({ value: [{ Period: "2024-01-01", Price: 100 }] });

    await handleGetRegister({
      register_type: "InformationRegister",
      register_name: "ЦеныНоменклатуры",
      top: 10,
      skip: 0,
    });

    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("InformationRegister_");
  });

  it("handleGetReport uses custom URL", async () => {
    mockFetchOk({ total: 1000 });

    const result = await handleGetReport({ report_url: "/hs/reports/balance?date=2024-12-31" });
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("/hs/reports/balance");
    expect(JSON.parse(result).total).toBe(1000);
  });

  it("handleODataQuery supports $expand and $inlinecount", async () => {
    mockFetchOk({ value: [], "odata.count": "42" });

    await handleODataQuery({
      entity: "Document_Test",
      expand: "Товары",
      inlinecount: true,
      top: 10,
      skip: 0,
    });

    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("$expand=");
    expect(url).toContain("$inlinecount=allpages");
  });
});
