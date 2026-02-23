import './globals.css';

import type { Metadata } from 'next';
import Header from '@/shared/components/layout/header';
import Footer from '@/shared/components/layout/footer';

export const metadata: Metadata = {
  title: 'Dev Match',
  description: 'Dev Match',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <Header user={{ nickname: 'John Doe', avatarUrl: null }} />
        <main className="flex-1 py-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
