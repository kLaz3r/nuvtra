import { dark } from "@clerk/themes";
import "~/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { type Metadata } from "next";
import Script from "next/script";
import { NavbarWrapper } from "~/components/NavbarWrapper";

export const metadata: Metadata = {
  title: "NEXA",
  description: "Nexa | Legaturi fara limite",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  manifest: "/manifest.json",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NEXA",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#EB5E28",
          colorBackground: "#0A0706",
          colorInputBackground: "#0A0706",
          colorText: "#FFFFFF",
          colorTextSecondary: "#FFFFFF",
        },
      }}
    >
      <html lang="en">
        <head>
          <meta name="application-name" content="NEXA" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="NEXA" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#000000" />
          <meta name="msapplication-tap-highlight" content="no" />
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        </head>
        <body className="bg-background text-text">
          <NavbarWrapper />
          {children}
          <Script src="/sw-register.js" strategy="lazyOnload" />
        </body>
      </html>
    </ClerkProvider>
  );
}
