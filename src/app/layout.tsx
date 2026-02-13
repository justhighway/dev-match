import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dev Match",
  description: "Dev Match",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
