import Footer from '@/shared/components/layout/footer';
import Header from '@/shared/components/layout/header';
import { ReactNode } from 'react';

export default function MainLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex flex-1">{children}</main>
      <Footer />
    </div>
  );
}
