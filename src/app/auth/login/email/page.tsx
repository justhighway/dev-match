import EmailLoginForm from '@/features/auth/components/email-login-form';
import SocialLoginButton from '@/features/auth/components/social-login-button';
import { OrDivider } from '@/features/auth/components/or-divider';

export default function LoginEmailPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="w-full max-w-sm space-y-4 px-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">이메일로 로그인</h1>
          <p className="text-muted-foreground text-sm">
            이메일과 비밀번호를 입력해주세요.
          </p>
        </div>

        <EmailLoginForm />

        <OrDivider />
        <SocialLoginButton provider="github" />
        <SocialLoginButton provider="google" />
      </div>
    </div>
  );
}
