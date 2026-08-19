import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Resend exige domínio verificado para "from" customizado.
// Antes da verificação do domínio, use "onboarding@resend.dev" para testes.
const RESEND_FROM = process.env.RESEND_FROM || "Lacre <onboarding@resend.dev>";

export async function POST(request: NextRequest) {
  const { email } = (await request.json()) as { email?: string };

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "E-mail obrigatório." }, { status: 400 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Generate recovery link without sending Supabase's default email
  const origin = request.nextUrl.origin;
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: `${origin}/auth/callback?next=/update-password` },
  });

  if (error) {
    // Don't leak whether the user exists or not
    return NextResponse.json({ ok: true });
  }

  // Build the confirmation URL from the returned token
  const confirmUrl = data.properties?.action_link;

  if (!confirmUrl) {
    return NextResponse.json({ ok: true });
  }

  // Send via Resend
  const resendPayload = {
    from: RESEND_FROM,
    to: [email],
    subject: "Redefinir sua senha — Lacre",
    html: `
      <div style="font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
        <div style="margin-bottom: 32px;">
          <span style="font-size: 24px; font-weight: 800; color: #100e3d; letter-spacing: -0.04em;">Lacre</span>
        </div>
        <h1 style="margin: 0 0 8px; font-size: 20px; font-weight: 700; color: #111318;">Redefinir senha</h1>
        <p style="margin: 0 0 24px; font-size: 14px; color: #69717e; line-height: 1.6;">
          Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha.
        </p>
        <a href="${confirmUrl}" style="display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #3b37a8, #221f6b); color: white; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 8px;">
          Redefinir minha senha
        </a>
        <p style="margin: 24px 0 0; font-size: 12px; color: #9299a3; line-height: 1.5;">
          Se você não solicitou a redefinição, ignore este e-mail. O link expira em 1 hora.
        </p>
        <hr style="margin: 32px 0 16px; border: none; border-top: 1px solid #dfe3e8;" />
        <p style="margin: 0; font-size: 11px; color: #b8bec6;">Lacre &copy; 2026. Provas de entrega sem atrito.</p>
      </div>
    `,
  };

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resendPayload),
  });

  if (!resendRes.ok) {
    const body = await resendRes.json().catch(() => null);
    console.error(`Resend error [${resendRes.status}]:`, body?.message || body);
  }

  // Always return ok to not leak user existence
  return NextResponse.json({ ok: true });
}
