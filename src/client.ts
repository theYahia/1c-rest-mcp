const TIMEOUT = 15_000;
const MAX_RETRIES = 3;

function getBaseUrl(): string {
  const url = process.env["ONEC_BASE_URL"] || process.env["1C_BASE_URL"];
  if (!url) throw new Error("Переменная окружения ONEC_BASE_URL не задана");
  return url.replace(/\/+$/, "");
}

function getAuthHeader(): string {
  const login = process.env["ONEC_LOGIN"] || process.env["1C_LOGIN"];
  const password = process.env["ONEC_PASSWORD"] || process.env["1C_PASSWORD"];
  if (!login || !password) throw new Error("Переменные окружения ONEC_LOGIN и ONEC_PASSWORD не заданы");
  return "Basic " + Buffer.from(`${login}:${password}`).toString("base64");
}

export function buildODataPath(entity: string, query?: Record<string, string>): string {
  if (!query || Object.keys(query).length === 0) {
    return `/odata/standard.odata/${encodeURIComponent(entity)}`;
  }
  const qs = Object.entries(query)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
  return `/odata/standard.odata/${encodeURIComponent(entity)}?${qs}`;
}

export async function oneCGet(path: string): Promise<unknown> {
  return oneCRequest("GET", path);
}

export async function oneCPost(path: string, body: unknown): Promise<unknown> {
  return oneCRequest("POST", path, body);
}

export async function oneCPatch(path: string, body: unknown): Promise<unknown> {
  return oneCRequest("PATCH", path, body);
}

async function oneCRequest(method: string, path: string, body?: unknown): Promise<unknown> {
  const baseUrl = getBaseUrl();
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": getAuthHeader(),
          "Accept": "application/json",
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (response.ok) return response.json();

      if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
        console.error(`[1c-rest-mcp] ${response.status}, повтор через ${delay}мс (${attempt}/${MAX_RETRIES})`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      const text = await response.text().catch(() => "");
      throw new Error(`1С HTTP ${response.status}: ${response.statusText} ${text}`.trim());
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof DOMException && error.name === "AbortError" && attempt < MAX_RETRIES) {
        console.error(`[1c-rest-mcp] Таймаут, повтор (${attempt}/${MAX_RETRIES})`);
        continue;
      }
      throw error;
    }
  }
  throw new Error("1С API: все попытки исчерпаны");
}
