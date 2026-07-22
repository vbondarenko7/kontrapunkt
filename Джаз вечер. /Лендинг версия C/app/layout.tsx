import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Разговоры о главном под живой джаз",
  description:
    "Камерный вечер в Москве, где разговор становится материалом для живой джазовой импровизации.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
