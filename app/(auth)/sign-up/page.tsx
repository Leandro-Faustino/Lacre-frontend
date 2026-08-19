"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="auth-screen">
        <div className="auth-brand">
          <span className="auth-lacre-mark" aria-hidden="true">
            <span className="lacre-stub" />
            <span className="lacre-perf"><i /><i /><i /><i /><i /></span>
            <span className="lacre-note" />
          </span>
          <span className="auth-brand-name">Lacre</span>
        </div>
        <div className="auth-form" style={{ textAlign: "center" }}>
          <p style={{ color: "white", marginBottom: 12 }}>
            Verifique seu e-mail para confirmar o cadastro.
          </p>
          <button className="auth-button" onClick={() => router.push("/sign-in")}>
            Voltar ao login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-screen">
      <div className="auth-brand">
        <span className="auth-lacre-mark" aria-hidden="true">
          <span className="lacre-stub" />
          <span className="lacre-perf"><i /><i /><i /><i /><i /></span>
          <span className="lacre-note" />
        </span>
        <span className="auth-brand-name">Lacre</span>
      </div>
      <p className="auth-tagline">
        Provas de entrega organizadas para o financeiro cobrar sem atraso.
      </p>

      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-label">
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="auth-input"
            placeholder="voce@empresa.com"
          />
        </label>

        <label className="auth-label">
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="auth-input"
            placeholder="Mínimo 8 caracteres"
          />
        </label>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={loading} className="auth-button">
          {loading ? "Criando conta…" : "Criar conta"}
        </button>

        <p className="auth-link">
          Já tem conta?{" "}
          <a href="/sign-in">Entrar</a>
        </p>
      </form>
    </div>
  );
}
