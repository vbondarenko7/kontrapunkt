import type { Metadata } from "next";
import "./globals.css";
import YandexMetrika from "./YandexMetrika";
import VkPixel from "./VkPixel";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Разговор по душам и живой джаз — вечер в Москве",
  description:
    "Камерный вечер в Москве, где живой джаз отвечает на разговор гостей.",
  icons: {
    icon: `${basePath}/favicon.svg`,
    shortcut: `${basePath}/favicon.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        {/* Правило рассчитано на старый pages-роутер; здесь это корневой
            layout, он применяется ко всем страницам сразу. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500;1,600&family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        {children}
        <YandexMetrika />
        <VkPixel />
      </body>
    </html>
  );
}
