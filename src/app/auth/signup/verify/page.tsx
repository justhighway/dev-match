import { MailCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import Container from '@/shared/components/layout/container';

export default function SignupVerifyPage() {
  return (
    <Container className="flex flex-1 items-center justify-center py-12">
      <div className="w-full max-w-sm space-y-6 text-center">
        <MailCheck className="text-primary mx-auto size-12" />

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            이메일을 확인해주세요
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            입력하신 이메일로 인증 링크를 보냈습니다.
            <br />
            링크를 클릭하면 자동으로 로그인됩니다.
          </p>
          <p className="text-muted-foreground text-xs">
            이메일이 오지 않으셨나요? 스팸 폴더를 확인해주세요.
          </p>
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link href="/auth/login">로그인으로 돌아가기</Link>
        </Button>
      </div>
    </Container>
  );
}
