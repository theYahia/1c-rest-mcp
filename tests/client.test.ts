import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { buildODataPath, oneCGet, oneCPost, oneCPatch } from "../src/client.js";

describe("buildODataPath", () => {
  it("builds path without query params", () => {
    const path = buildODataPath("Catalog_Test");
    expect(path).toBe("/odata/standard.odata/Catalog_Test");
  });

  it("builds path with query params preserving $ signs", () => {
    const path = buildODataPath("Catalog_Test", { $format: "json", $top: "10" });
    expect(path).toContain("/odata/standard.odata/Catalog_Test?");
    expect(path).toContain("$format=json");
    expect(path).toContain("$top=10");
  });

  it("encodes entity name", () => {
    const path = buildODataPath("Document_Счёт");
    expect(path).toContain(encodeURIComponent("Document_Счёт"));
  });
});

describe("oneCGet / oneCPost / oneCPatch", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env["ONEC_BASE_URL"] = "http://localhost:8080/base";
    process.env["ONEC_LOGIN"] = "admin";
    process.env["ONEC_PASSWORD"] = "secret";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it("oneCGet sends GET with auth header", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ value: [] }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await oneCGet("/odata/standard.odata/Catalog_Test?$format=json");
    expect(mockFetch).toHaveBeenCalledOnce();

    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toBe("http://localhost:8080/base/odata/standard.odata/Catalog_Test?$format=json");
    expect(opts.method).toBe("GET");
    expect(opts.headers.Authorization).toMatch(/^Basic /);
    expect(result).toEqual({ value: [] });
  });

  it("oneCPost sends POST with body", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ Ref_Key: "abc-123" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await oneCPost("/odata/standard.odata/Document_Test", { Number: "001" });
    const [, opts] = mockFetch.mock.calls[0];
    expect(opts.method).toBe("POST");
    expect(opts.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(opts.body)).toEqual({ Number: "001" });
    expect(result).toEqual({ Ref_Key: "abc-123" });
  });

  it("oneCPatch sends PATCH with body", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ Ref_Key: "abc-123" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await oneCPatch("/odata/standard.odata/Document_Test(guid'abc')", { Posted: true });
    const [, opts] = mockFetch.mock.calls[0];
    expect(opts.method).toBe("PATCH");
  });

  it("throws when env vars missing", async () => {
    delete process.env["ONEC_BASE_URL"];
    delete process.env["1C_BASE_URL"];
    await expect(oneCGet("/test")).rejects.toThrow("ONEC_BASE_URL");
  });

  it("retries on 500", async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 500, statusText: "Internal", text: () => Promise.resolve("") })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ value: [1] }) });
    vi.stubGlobal("fetch", mockFetch);

    const result = await oneCGet("/test");
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ value: [1] });
  });

  it("throws on 4xx without retry", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false, status: 404, statusText: "Not Found",
      text: () => Promise.resolve("Not found"),
    });
    vi.stubGlobal("fetch", mockFetch);

    await expect(oneCGet("/missing")).rejects.toThrow("404");
    expect(mockFetch).toHaveBeenCalledOnce();
  });
});
