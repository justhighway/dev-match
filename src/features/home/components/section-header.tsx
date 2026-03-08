import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  href: string;
}

export default function SectionHeader({ title, href }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <Link
        href={href}
        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
      >
        전체보기 →
      </Link>
    </div>
  );
}
