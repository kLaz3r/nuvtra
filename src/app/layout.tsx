import { dark } from "@clerk/themes";
import "~/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { type Metadata } from "next";
import { NavbarWrapper } from "~/components/NavbarWrapper";

export const metadata: Metadata = {
  title: "NEXA",
  description: "Nexa | Legaturi fara limite",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
        <body className="bg-background text-text">
          <NavbarWrapper />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
