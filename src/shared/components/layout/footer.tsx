import { Github } from 'lucide-react';
import Link from 'next/link';
import Container from './container';

export default function Footer() {
  return (
    <footer className="w-full border-t">
      <Container className="flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
        <div>© 2026 MONOLINK</div>
        <div className="flex items-center gap-4">
          <Link href="/privacy">개인정보처리방침</Link>
          <Link href="/terms">이용약관</Link>
        </div>
        <div>
          <Github size={20} />
        </div>
      </Container>
    </footer>
  );
}
