"use client";

import { useState } from "react";
import Link from "next/link";

const TIPOS_SOLICITACAO = [
  { value: "acesso", label: "Acesso aos meus dados pessoais" },
  { value: "correcao", label: "Correção de dados incorretos" },
  { value: "exclusao", label: "Exclusão dos meus dados" },
  { value: "portabilidade", label: "Portabilidade dos dados" },
  { value: "revogacao", label: "Revogação de consentimento" },
  { value: "outro", label: "Outra solicitação" },
];

export default function DsarPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState("");
  const [detalhes, setDetalhes] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/dsar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, tipo, detalhes }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao enviar solicitação.");
      }

      setEnviado(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-panel">
        <div className="auth-panel-brand">
          <span className="auth-panel-mark" aria-hidden="true">
            <span className="lacre-stub" />
            <span className="lacre-perf"><i /><i /><i /><i /><i /></span>
            <span className="lacre-note" />
          </span>
          <span className="auth-panel-name">Lacre</span>
        </div>
        <div className="auth-panel-content">
          <h1 className="auth-panel-headline">
            Seus dados, seus direitos
          </h1>
          <p className="auth-panel-desc">
            Em conformidade com a Lei Geral de Proteção de Dados (LGPD),
            você pode exercer seus direitos sobre seus dados pessoais
            a qualquer momento.
          </p>
          <ul className="auth-features">
            <li className="auth-feature">
              <span className="auth-feature-icon">1</span>
              <span><strong>Art. 18, I</strong> — Confirmação e acesso aos seus dados</span>
            </li>
            <li className="auth-feature">
              <span className="auth-feature-icon">2</span>
              <span><strong>Art. 18, III</strong> — Correção de dados incompletos ou inexatos</span>
            </li>
            <li className="auth-feature">
              <span className="auth-feature-icon">3</span>
              <span><strong>Art. 18, VI</strong> — Exclusão de dados tratados com consentimento</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-wrapper">
          {enviado ? (
            <>
              <div className="auth-form-header">
                <h2 className="auth-form-title">Solicitação recebida</h2>
                <p className="auth-form-subtitle">
                  Sua solicitação foi registrada com sucesso. Nosso Encarregado
                  de Proteção de Dados (DPO) responderá em até 15 dias úteis,
                  conforme previsto na LGPD.
                </p>
              </div>
              <div className="auth-success-box">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="24" fill="#e7f4ed" />
                  <path d="M15 24l6 6 12-12" stroke="#237a57" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p>
                  Você receberá uma confirmação no e-mail <strong>{email}</strong>.
                </p>
              </div>
              <Link
                href="/sign-in"
                className="auth-button"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", marginTop: 24 }}
              >
                Voltar ao login
              </Link>
            </>
          ) : (
            <>
              <div className="auth-form-header">
                <h2 className="auth-form-title">Solicitação de dados pessoais</h2>
                <p className="auth-form-subtitle">
                  Preencha o formulário abaixo para exercer seus direitos sobre seus dados.
                  Contato direto do DPO:{" "}
                  <a href="mailto:privacidade@lacre.app">privacidade@lacre.app</a>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="auth-field">
                  <label htmlFor="dsar-nome" className="auth-field-label">Nome completo</label>
                  <input
                    id="dsar-nome"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    className="auth-input"
                    placeholder="Seu nome completo"
                    autoFocus
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="dsar-email" className="auth-field-label">E-mail de contato</label>
                  <input
                    id="dsar-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="auth-input"
                    placeholder="voce@empresa.com"
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="dsar-tipo" className="auth-field-label">Tipo de solicitação</label>
                  <select
                    id="dsar-tipo"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    required
                    className="auth-input"
                  >
                    <option value="" disabled>Selecione...</option>
                    {TIPOS_SOLICITACAO.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div className="auth-field">
                  <label htmlFor="dsar-detalhes" className="auth-field-label">Detalhes da solicitação</label>
                  <textarea
                    id="dsar-detalhes"
                    value={detalhes}
                    onChange={(e) => setDetalhes(e.target.value)}
                    className="auth-input"
                    placeholder="Descreva sua solicitação com o máximo de detalhes possível..."
                    rows={4}
                    style={{ resize: "vertical" }}
                  />
                </div>

                {error && <p className="auth-error">{error}</p>}

                <button type="submit" disabled={loading} className="auth-button">
                  {loading ? "Enviando..." : "Enviar solicitação"}
                </button>
              </form>

              <p className="auth-footer">
                <Link href="/politica-privacidade">Política de Privacidade</Link>
                {" · "}
                <Link href="/sign-in">Voltar ao login</Link>
              </p>
            </>
          )}
          <p className="auth-copyright">Lacre &copy; 2026. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}
