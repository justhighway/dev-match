'use client';

import { cn } from '@/shared/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  {
    href: '/',
    label: '쇼케이스',
  },
  {
    href: '/recruitments',
    label: '팀원모집',
  },
  {
    href: '/ideas',
    label: '아이디어',
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-6 md:flex">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            pathname === link.href ? 'text-primary' : 'text-muted-foreground',
            'hover:text-primary font-medium transition-colors',
          )}
        >
          <span>{link.label}</span>
        </Link>
      ))}
    </nav>
  );
}
