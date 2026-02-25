import { LogInIcon } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function LoginButton() {
  return (
    <Button asChild>
      <Link href="/auth/login">
        <LogInIcon className="size-4" />
        <span>로그인</span>
      </Link>
    </Button>
  );
}
