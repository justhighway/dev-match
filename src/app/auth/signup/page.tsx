import SignupForm from '@/features/auth/components/signup-form';
import SocialLoginButton from '@/features/auth/components/social-login-button';
import { OrDivider } from '@/features/auth/components/or-divider';

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="w-full max-w-sm space-y-4 px-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">회원가입</h1>
          <p className="text-muted-foreground text-sm">
            가입 후 이메일 인증을 완료해주세요.
          </p>
        </div>

        <SignupForm />

        <OrDivider />
        <SocialLoginButton provider="github" />
        <SocialLoginButton provider="google" />
      </div>
    </div>
  );
}
