import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Context = { params: Promise<{ path: string[] }> };

async function proxy(request: NextRequest, { params }: Context) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const apiBaseUrl = process.env.LACRE_API_URL;
  if (!apiBaseUrl) return NextResponse.json({ error: "LACRE_API_URL não configurada" }, { status: 500 });

  const { path } = await params;
  const url = new URL(`/v1/${path.map(encodeURIComponent).join("/")}`, apiBaseUrl);
  request.nextUrl.searchParams.forEach((value, key) => url.searchParams.append(key, value));

  const headers = new Headers({ Authorization: `Bearer ${session.access_token}` });
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");
  if (contentType) headers.set("content-type", contentType);
  if (accept) headers.set("accept", accept);

  const body = request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer();
  const response = await fetch(url, { method: request.method, headers, body, cache: "no-store" });
  const responseHeaders = new Headers();
  for (const header of ["content-type", "content-disposition", "content-length"]) {
    const value = response.headers.get(header);
    if (value) responseHeaders.set(header, value);
  }

  // A rota de exportação da API transmite o ZIP em stream, mas alguns runtimes
  // não preservam seus cabeçalhos na resposta raw. O contrato dessa rota é ZIP;
  // normalizamos os metadados no BFF para que o navegador faça o download certo.
  if (path.length === 1 && path[0] === "exportacao" && response.ok) {
    const dataInicio = request.nextUrl.searchParams.get("data_inicio") ?? "comprovantes";
    const dataFim = request.nextUrl.searchParams.get("data_fim") ?? "exportacao";
    if (!responseHeaders.has("content-type")) responseHeaders.set("content-type", "application/zip");
    if (!responseHeaders.has("content-disposition")) {
      responseHeaders.set("content-disposition", `attachment; filename="exportacao-${dataInicio}-${dataFim}.zip"`);
    }
  }

  return new NextResponse(response.body, { status: response.status, headers: responseHeaders });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
