import { Button } from '@/shared/components/ui/button';
import { ArrowRight, Lightbulb } from 'lucide-react';
import Link from 'next/link';

export default function CtaBanner() {
  return (
    <section className="from-primary/10 via-primary/5 relative overflow-hidden rounded-3xl bg-gradient-to-br to-transparent px-8 py-14 text-center md:px-16 md:py-20">
      {/* 배경 장식 원 */}
      <div className="bg-primary/10 absolute -top-16 -right-16 size-64 rounded-full blur-3xl" />
      <div className="bg-primary/5 absolute -bottom-16 -left-16 size-64 rounded-full blur-3xl" />

      <div className="relative z-10 mx-auto max-w-2xl">
        <div className="bg-primary/10 text-primary mb-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium">
          <Lightbulb className="size-3.5" />
          지금 바로 시작해보세요
        </div>

        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
          아이디어가 있으신가요?
          <br />
          <span className="text-primary">함께 만들</span> 팀원을 찾고 있나요?
        </h2>

        <p className="text-muted-foreground mb-8 text-base md:text-lg">
          MONOLINK에서 사이드 프로젝트 동료를 만나보세요.
          <br className="hidden md:block" />
          아이디어 공유부터 팀 빌딩까지, 한 곳에서.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/ideas/new">
              아이디어 등록하기
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/recruitments">팀원 모집 보기</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
