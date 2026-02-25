import Footer from '@/shared/components/layout/footer';
import { ReactNode } from 'react';

export default function AuthLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <main className="flex min-h-dvh flex-col">{children}</main>
      <Footer />
    </>
  );
}
