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
    <ClerkProvider>
      <html lang="en">
        <body>
          <NavbarWrapper />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
