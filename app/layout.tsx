import type { Metadata } from "next";
import CookieBanner from "@/components/cookie-banner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lacre — Painel de provas",
  description: "Provas de entrega organizadas para o financeiro cobrar sem atraso.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
