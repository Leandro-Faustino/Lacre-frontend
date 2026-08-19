"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("E-mail ou senha incorretos.");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
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
            Provas de entrega organizadas para o financeiro cobrar sem atraso
          </h1>
          <p className="auth-panel-desc">
            Controle total das suas entregas com comprovantes digitais,
            rastreamento em tempo real e relatórios automatizados.
          </p>

          <ul className="auth-features">
            <li className="auth-feature">
              <span className="auth-feature-icon">1</span>
              <span><strong>Comprovantes digitais</strong> — fotos com geolocalização e timestamp automático</span>
            </li>
            <li className="auth-feature">
              <span className="auth-feature-icon">2</span>
              <span><strong>Rastreamento em tempo real</strong> — acompanhe cada entrega do início ao fim</span>
            </li>
            <li className="auth-feature">
              <span className="auth-feature-icon">3</span>
              <span><strong>Relatórios inteligentes</strong> — taxa de comprovação, pendências e exportação em um clique</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Entrar na sua conta</h2>
            <p className="auth-form-subtitle">
              Acesse o painel de gestão de entregas
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="auth-email" className="auth-field-label">E-mail</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="auth-input"
                placeholder="voce@empresa.com"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="auth-password" className="auth-field-label">Senha</label>
              <div className="auth-input-group">
                <input
                  id="auth-password"
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="auth-input"
                  placeholder="Digite sua senha"
                />
                <button type="button" className="auth-toggle-pwd" onClick={() => setShowPwd(!showPwd)} aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}>
                  <EyeIcon open={showPwd} />
                </button>
              </div>
              <div className="auth-field-hint">
                <Link href="/forgot-password">Esqueceu a senha?</Link>
              </div>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" disabled={loading} className="auth-button">
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="auth-footer">
            Não tem conta?{" "}
            <Link href="/sign-up">Criar conta</Link>
          </p>
          <p className="auth-copyright">
            Lacre &copy; 2026. Todos os direitos reservados.
            <br />
            <Link href="/politica-privacidade">Privacidade</Link>
            {" · "}
            <Link href="/dsar">Seus dados (LGPD)</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
