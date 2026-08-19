"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("admin.a+aceite@exemplo.local");
  const [password, setPassword] = useState("teste-lacre-2026");
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
            autoComplete="current-password"
            className="auth-input"
            placeholder="••••••••"
          />
        </label>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={loading} className="auth-button">
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
