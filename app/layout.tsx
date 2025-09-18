import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "I Teach You Control Panel",
  description: "Painel administrativo base para o projeto I Teach You",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
