import { Github } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { GoogleIcon } from './google-icon';
import { signInWithGithub } from '@/features/auth/actions/sign-in-with-github';
import { signInWithGoogle } from '@/features/auth/actions/sign-in-with-google';
import { signInWithKakao } from '@/features/auth/actions/sign-in-with-kakao';
import { KakaoIcon } from './kakao-icon';
import { cn } from '@/shared/lib/utils';

type SocialProvider = 'github' | 'google' | 'kakao';

const PROVIDERS: Record<
  SocialProvider,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    action: () => Promise<void>;
    className: string;
  }
> = {
  github: {
    label: 'GitHub로 로그인',
    icon: Github,
    action: signInWithGithub,
    className:
      'bg-[#24292F] text-white border-[#24292F] hover:bg-[#24292F]/90 hover:text-white',
  },
  google: {
    label: 'Google로 로그인',
    icon: GoogleIcon,
    action: signInWithGoogle,
    className:
      'bg-white text-[#3C4043] border-[#dadce0] hover:bg-[#F8FAFF]/80 hover:text-[#3C4043]',
  },
  kakao: {
    label: 'Kakao로 로그인',
    icon: KakaoIcon,
    action: signInWithKakao,
    className:
      'bg-[#FEE500] text-black/85 border-[#FEE500] hover:bg-[#FEE500]/80 hover:text-black/85',
  },
};

interface SocialLoginButtonProps {
  provider: SocialProvider;
}

export default function SocialLoginButton({
  provider,
}: SocialLoginButtonProps) {
  const { label, icon: Icon, action, className } = PROVIDERS[provider];

  return (
    <form action={action}>
      <Button
        type="submit"
        variant="outline"
        className={cn(
          'hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer space-x-1',
          className,
        )}
      >
        <Icon className="size-4" />
        <span>{label}</span>
      </Button>
    </form>
  );
}
