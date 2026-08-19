"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8, label: "Mínimo 8 caracteres" },
  { test: (p: string) => /[A-Z]/.test(p), label: "Uma letra maiúscula" },
  { test: (p: string) => /[0-9]/.test(p), label: "Um número" },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: "Um caractere especial" },
];

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const pwdStrength = PASSWORD_RULES.filter((r) => r.test(password));
  const pwdValid = pwdStrength.length === PASSWORD_RULES.length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!pwdValid) {
      setError("A senha não atende todos os requisitos.");
      return;
    }

    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setDone(true);
    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 2000);
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
            Crie uma nova senha segura para sua conta
          </h1>
          <p className="auth-panel-desc">
            Escolha uma senha forte com pelo menos 8 caracteres.
            Combine letras maiúsculas, números e caracteres especiais.
          </p>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-wrapper">
          {done ? (
            <>
              <div className="auth-form-header">
                <h2 className="auth-form-title">Senha atualizada</h2>
                <p className="auth-form-subtitle">
                  Sua senha foi redefinida com sucesso. Redirecionando...
                </p>
              </div>
              <div className="auth-success-box">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="24" fill="#e7f4ed" />
                  <path d="M15 24l6 6 12-12" stroke="#237a57" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p>Você será redirecionado ao painel automaticamente.</p>
              </div>
            </>
          ) : (
            <>
              <div className="auth-form-header">
                <h2 className="auth-form-title">Nova senha</h2>
                <p className="auth-form-subtitle">
                  Defina a nova senha para a sua conta.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="auth-field">
                  <label htmlFor="new-password" className="auth-field-label">Nova senha</label>
                  <div className="auth-input-group">
                    <input
                      id="new-password"
                      type={showPwd ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className="auth-input"
                      placeholder="Crie uma senha forte"
                      autoFocus
                    />
                    <button type="button" className="auth-toggle-pwd" onClick={() => setShowPwd(!showPwd)} aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}>
                      <EyeIcon open={showPwd} />
                    </button>
                  </div>
                  {password.length > 0 && (
                    <ul className="auth-pwd-rules">
                      {PASSWORD_RULES.map((rule) => (
                        <li key={rule.label} className={rule.test(password) ? "auth-pwd-ok" : "auth-pwd-fail"}>
                          {rule.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="auth-field">
                  <label htmlFor="confirm-password" className="auth-field-label">Confirmar senha</label>
                  <div className="auth-input-group">
                    <input
                      id="confirm-password"
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      autoComplete="new-password"
                      className="auth-input"
                      placeholder="Repita a nova senha"
                    />
                    <button type="button" className="auth-toggle-pwd" onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}>
                      <EyeIcon open={showConfirm} />
                    </button>
                  </div>
                </div>

                {error && <p className="auth-error">{error}</p>}

                <button type="submit" disabled={loading || !pwdValid} className="auth-button">
                  {loading ? "Salvando..." : "Redefinir senha"}
                </button>
              </form>
            </>
          )}
          <p className="auth-copyright">Lacre &copy; 2026. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}
