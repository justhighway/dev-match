import { Github } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { GoogleIcon } from './google-icon';
import {
  signInWithGithub,
  signInWithGoogle,
  signInWithKakao,
} from '@/features/auth/actions';
import { KakaoIcon } from './kakao-icon';

type SocialProvider = 'github' | 'google' | 'kakao';

const PROVIDERS: Record<
  SocialProvider,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    action: () => Promise<void>;
  }
> = {
  github: {
    label: 'GitHub로 로그인',
    icon: Github,
    action: signInWithGithub,
  },
  google: {
    label: 'Google로 로그인',
    icon: GoogleIcon,
    action: signInWithGoogle,
  },
  kakao: {
    label: 'Kakao로 로그인',
    icon: KakaoIcon,
    action: signInWithKakao,
  },
};

interface SocialLoginButtonProps {
  provider: SocialProvider;
}

export default function SocialLoginButton({
  provider,
}: SocialLoginButtonProps) {
  const { label, icon: Icon, action } = PROVIDERS[provider];

  return (
    <form action={action}>
      <Button
        type="submit"
        variant="outline"
        className="hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer space-x-2"
      >
        <Icon className="size-4" />
        <span>{label}</span>
      </Button>
    </form>
  );
}
