"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao enviar e-mail.");
      }

      setSent(true);
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
            Recupere o acesso à sua conta de forma segura
          </h1>
          <p className="auth-panel-desc">
            Enviaremos um link seguro para o seu e-mail cadastrado.
            O link expira em 1 hora por questões de segurança.
          </p>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-wrapper">
          {sent ? (
            <>
              <div className="auth-form-header">
                <h2 className="auth-form-title">E-mail enviado</h2>
                <p className="auth-form-subtitle">
                  Se existe uma conta associada a <strong>{email}</strong>,
                  você receberá um link para redefinir sua senha em instantes.
                </p>
              </div>
              <div className="auth-success-box">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="24" fill="#e7f4ed" />
                  <path d="M15 24l6 6 12-12" stroke="#237a57" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p>Verifique sua caixa de entrada e a pasta de spam.</p>
              </div>
              <Link href="/sign-in" className="auth-button" style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", marginTop: 24 }}>
                Voltar ao login
              </Link>
            </>
          ) : (
            <>
              <div className="auth-form-header">
                <h2 className="auth-form-title">Esqueceu a senha?</h2>
                <p className="auth-form-subtitle">
                  Informe o e-mail cadastrado e enviaremos um link para redefinir sua senha.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="auth-field">
                  <label htmlFor="reset-email" className="auth-field-label">E-mail</label>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="auth-input"
                    placeholder="voce@empresa.com"
                    autoFocus
                  />
                </div>

                {error && <p className="auth-error">{error}</p>}

                <button type="submit" disabled={loading} className="auth-button">
                  {loading ? "Enviando..." : "Enviar link de redefinição"}
                </button>
              </form>

              <p className="auth-footer">
                Lembrou a senha?{" "}
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
