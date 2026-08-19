import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { serverApiFetch } from "@/lib/api/client";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const res = await serverApiFetch("/entregas", session.access_token, { method: "POST", body });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
