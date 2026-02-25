import './globals.css';

import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ReactNode } from 'react';

const pretendard = localFont({
  src: './PretendardVariable.woff2',
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
      <body>{children}</body>
    </html>
  );
}
