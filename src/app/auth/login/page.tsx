import { Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import SocialLoginButton from '@/features/auth/components/social-login-button';
import { OrDivider } from '@/features/auth/components/or-divider';

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="w-full max-w-sm space-y-4 px-4">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight">로그인</h1>
          <p className="text-muted-foreground text-sm">
            서비스를 계속하려면 로그인해주세요.
          </p>
        </div>

        <div className="space-y-3">
          <SocialLoginButton provider="github" />
          <SocialLoginButton provider="google" />
          <OrDivider />
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login/email">
              <Mail className="size-4" />
              이메일로 로그인
            </Link>
          </Button>
        </div>

        <p className="text-muted-foreground text-center text-sm">
          계정이 없으신가요?{' '}
          <Link
            href="/auth/signup"
            className="text-foreground underline-offset-4 hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
