import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { serverApiFetch } from "@/lib/api/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const queryParams: Record<string, string> = {};
  const variante = request.nextUrl.searchParams.get("variante");
  if (variante) queryParams.variante = variante;

  const res = await serverApiFetch(`/midias/${id}/url`, session.access_token, { params: queryParams });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
