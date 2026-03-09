import Container from '@/shared/components/layout/container';
import SocialLoginButton from '@/features/auth/components/social-login-button';
import Link from 'next/link';

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
          <SocialLoginButton provider="kakao" />
          <SocialLoginButton provider="google" />
        </div>
      </div>
    </Container>
  );
}
