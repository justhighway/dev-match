import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/">
      <span className="text-primary text-xl font-bold italic">MONOLINK</span>
    </Link>
  );
}
