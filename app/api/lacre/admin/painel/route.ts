import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { serverApiFetch } from "@/lib/api/client";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const params: Record<string, string> = {};
  request.nextUrl.searchParams.forEach((v, k) => { params[k] = v; });

  const res = await serverApiFetch("/admin/painel", session.access_token, { params });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
