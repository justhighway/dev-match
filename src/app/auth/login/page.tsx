import { Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import SocialLoginButton from '@/features/auth/components/social-login-button';
import { Divider } from '@/shared/components/ui/divider';
import Container from '@/shared/components/layout/container';

export default function LoginPage() {
  return (
    <Container className="flex flex-1 items-center justify-center py-12">
      <div className="flex w-full max-w-sm flex-col space-y-4">
        <div className="mb-8 text-center">
          <Link href="/">
            <h1 className="text-primary text-4xl font-bold">MONOLINK</h1>
          </Link>
        </div>

        <div className="flex flex-col space-y-4">
          <SocialLoginButton provider="github" />
          <SocialLoginButton provider="google" />
          <Divider label="또는" />
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login/email">
              <Mail className="size-4" />
              이메일로 로그인
            </Link>
          </Button>
          <p className="text-muted-foreground text-center">
            계정이 없으신가요?{' '}
            <Link
              href="/auth/signup"
              className="text-primary font-medium hover:underline"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </Container>
  );
}
