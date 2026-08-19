import { ApiError, parseApiError } from "./errors";

type FetchOptions = Omit<RequestInit, "body"> & {
  params?: Record<string, string | number | undefined>;
  body?: unknown;
};

type RawFetchOptions = Omit<RequestInit, "body"> & {
  params?: Record<string, string | number | undefined>;
  body?: BodyInit | null;
};

/**
 * Fetch wrapper tipado para chamar os BFF route handlers em `/api/lacre/*`.
 *
 * Uso no lado **client** (componentes "use client"):
 *   const data = await apiFetch<PendenciasResponse>("/pendencias");
 *   const data = await apiFetch<ComprovantesResponse>("/comprovantes", { params: { status: "COMPROVADA" } });
 *   await apiFetch("/entregas", { method: "POST", body: { ... } });
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { params, body, headers: extra, ...rest } = options;

  const url = new URL(`/api/lacre${path}`, window.location.origin);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }

  const headers: HeadersInit = { ...extra };
  if (body !== undefined) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) throw await parseApiError(response);

  // 204 No Content
  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

/**
 * Envia corpos que não são JSON ao BFF, como XML de NF-e, ZIPs e arquivos.
 * A resposta é mantida como `Response` para suportar downloads e streams.
 */
export async function apiRawFetch(
  path: string,
  options: RawFetchOptions = {},
): Promise<Response> {
  const { params, body, headers: extra, ...rest } = options;
  const url = new URL(`/api/lacre${path}`, window.location.origin);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  return fetch(url, { ...rest, headers: extra, body });
}

/**
 * Chama a API Fastify diretamente do lado **server** (route handlers, server actions).
 * Recebe o access_token do usuário logado (Supabase JWT) e repassa à API.
 * As rotas da API são `/v1/*` (ex: `/pendencias`, `/comprovantes`).
 */
export async function serverApiFetch(
  path: string,
  accessToken: string,
  options: FetchOptions = {},
): Promise<Response> {
  const API_URL = process.env.LACRE_API_URL;
  if (!API_URL) {
    throw new ApiError(500, "LACRE_API_URL deve estar configurado no .env");
  }

  const { params, body, headers: extra, ...rest } = options;

  const url = new URL(`/v1${path}`, API_URL);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }

  const headers: HeadersInit = {
    Authorization: `Bearer ${accessToken}`,
    ...extra,
  };
  if (body !== undefined) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  return fetch(url, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
}
