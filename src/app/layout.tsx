import './globals.css';

import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Header from '@/shared/components/layout/header';
import Footer from '@/shared/components/layout/footer';
import { ReactNode } from 'react';

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
  weight: '100 900',
  fallback: [
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    'Malgun Gothic',
    'sans-serif',
  ],
});

export const metadata: Metadata = {
  title: 'MONOLINK',
  description: 'MONOLINK',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.className}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
