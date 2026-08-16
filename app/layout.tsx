import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lacre — Painel de provas",
  description: "Provas de entrega organizadas para o financeiro cobrar sem atraso.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
