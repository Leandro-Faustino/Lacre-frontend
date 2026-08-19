"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_KEY = "lacre_cookies_aceito";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_KEY, new Date().toISOString());
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <p>
        Utilizamos apenas cookies <strong>estritamente necessários</strong> para manter sua sessão ativa.
        Saiba mais na nossa <Link href="/politica-privacidade">Política de Privacidade</Link>.
      </p>
      <div className="cookie-banner-actions">
        <button className="cookie-banner-accept" onClick={accept}>
          Entendi
        </button>
      </div>
    </div>
  );
}
