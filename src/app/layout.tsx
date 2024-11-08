import "~/styles/globals.css";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "NEXA",
  description: "Nexa | Legaturi fara limite",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
