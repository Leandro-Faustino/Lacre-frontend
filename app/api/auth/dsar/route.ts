import { NextRequest, NextResponse } from "next/server";

const RESEND_FROM = process.env.RESEND_FROM || "Lacre <onboarding@resend.dev>";
const DPO_EMAIL = "privacidade@lacre.app";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    nome?: string;
    email?: string;
    tipo?: string;
    detalhes?: string;
  };

  if (!body.nome || !body.email || !body.tipo) {
    return NextResponse.json(
      { error: "Nome, e-mail e tipo de solicitação são obrigatórios." },
      { status: 400 },
    );
  }

  const tiposValidos = [
    "acesso",
    "correcao",
    "exclusao",
    "portabilidade",
    "revogacao",
    "outro",
  ];
  if (!tiposValidos.includes(body.tipo)) {
    return NextResponse.json(
      { error: "Tipo de solicitação inválido." },
      { status: 400 },
    );
  }

  const tipoLabel: Record<string, string> = {
    acesso: "Acesso aos dados pessoais",
    correcao: "Correção de dados",
    exclusao: "Exclusão de dados",
    portabilidade: "Portabilidade dos dados",
    revogacao: "Revogação de consentimento",
    outro: "Outra solicitação",
  };

  const protocolo = `DSAR-${Date.now()}`;
  const agora = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

  // Notifica o DPO
  const emailDpo = {
    from: RESEND_FROM,
    to: [DPO_EMAIL],
    subject: `[LGPD] Nova solicitação DSAR — ${tipoLabel[body.tipo]}`,
    html: `
      <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
        <h1 style="font-size: 18px; color: #100e3d;">Nova solicitação DSAR</h1>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333;">
          <tr><td style="padding: 8px 0; font-weight: 600; width: 120px;">Protocolo</td><td>${protocolo}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600;">Data</td><td>${agora}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600;">Nome</td><td>${body.nome}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600;">E-mail</td><td>${body.email}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600;">Tipo</td><td>${tipoLabel[body.tipo]}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600;">Detalhes</td><td>${body.detalhes || "—"}</td></tr>
        </table>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #dfe3e8;" />
        <p style="font-size: 12px; color: #9299a3;">
          Prazo de resposta: 15 dias úteis (LGPD Art. 18, §5°).
        </p>
      </div>
    `,
  };

  // Confirmação para o titular
  const emailTitular = {
    from: RESEND_FROM,
    to: [body.email],
    subject: `Sua solicitação LGPD foi recebida — Protocolo ${protocolo}`,
    html: `
      <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
        <div style="margin-bottom: 32px;">
          <span style="font-size: 24px; font-weight: 800; color: #100e3d; letter-spacing: -0.04em;">Lacre</span>
        </div>
        <h1 style="margin: 0 0 8px; font-size: 20px; font-weight: 700; color: #111318;">Solicitação recebida</h1>
        <p style="margin: 0 0 16px; font-size: 14px; color: #69717e; line-height: 1.6;">
          Olá ${body.nome}, recebemos sua solicitação de <strong>${tipoLabel[body.tipo]?.toLowerCase()}</strong>.
        </p>
        <p style="margin: 0 0 16px; font-size: 14px; color: #69717e; line-height: 1.6;">
          <strong>Protocolo:</strong> ${protocolo}<br/>
          <strong>Data:</strong> ${agora}
        </p>
        <p style="margin: 0 0 24px; font-size: 14px; color: #69717e; line-height: 1.6;">
          Nosso Encarregado de Proteção de Dados (DPO) analisará sua solicitação
          e responderá em até <strong>15 dias úteis</strong>, conforme previsto na LGPD (Art. 18, §5°).
        </p>
        <p style="margin: 0; font-size: 12px; color: #9299a3;">
          Em caso de dúvidas, entre em contato: privacidade@lacre.app
        </p>
        <hr style="margin: 32px 0 16px; border: none; border-top: 1px solid #dfe3e8;" />
        <p style="margin: 0; font-size: 11px; color: #b8bec6;">Lacre &copy; 2026. Provas de entrega sem atrito.</p>
      </div>
    `,
  };

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    const enviar = (payload: object) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

    await Promise.allSettled([enviar(emailDpo), enviar(emailTitular)]);
  }

  return NextResponse.json({ ok: true, protocolo });
}
