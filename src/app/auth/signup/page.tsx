import SignupForm from '@/features/auth/components/signup-form';
import SocialLoginButton from '@/features/auth/components/social-login-button';
import { Divider } from '@/shared/components/ui/divider';
import Container from '@/shared/components/layout/container';

export default function SignupPage() {
  return (
    <Container className="flex flex-1 items-center justify-center py-12">
      <div className="flex w-full max-w-sm flex-col space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">회원가입</h2>
        </div>

        <SignupForm />

        <Divider label="또는" />

        <div className="flex flex-col space-y-4">
          <SocialLoginButton provider="github" />
          <SocialLoginButton provider="google" />
        </div>
      </div>
    </Container>
  );
}
