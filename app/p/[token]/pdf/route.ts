import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  void _request;
  const { token } = await params;
  const apiBaseUrl = process.env.LACRE_API_URL;
  if (!apiBaseUrl) return NextResponse.json({ error: "LACRE_API_URL não configurada" }, { status: 500 });

  const response = await fetch(new URL(`/p/${encodeURIComponent(token)}`, apiBaseUrl), {
    cache: "no-store",
    headers: { Accept: "application/pdf" },
  });
  return new NextResponse(response.body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/pdf",
      "Content-Disposition": response.headers.get("content-disposition") ?? "inline; filename=comprovante.pdf",
    },
  });
}
