import EmailLoginForm from '@/features/auth/components/email-login-form';
import SocialLoginButton from '@/features/auth/components/social-login-button';
import { Divider } from '@/shared/components/ui/divider';
import Container from '@/shared/components/layout/container';

export default function LoginEmailPage() {
  return (
    <Container className="flex flex-1 items-center justify-center py-12">
      <div className="flex w-full max-w-sm flex-col space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">이메일로 로그인</h2>
          <p className="text-muted-foreground text-sm">
            이메일과 비밀번호를 입력해주세요.
          </p>
        </div>

        <EmailLoginForm />

        <Divider label="또는" />

        <div className="flex flex-col space-y-4">
          <SocialLoginButton provider="github" />
          <SocialLoginButton provider="google" />
        </div>
      </div>
    </Container>
  );
}
