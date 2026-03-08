import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="to-primary/10 my-8 flex flex-col items-center justify-center bg-linear-to-b from-transparent px-6 py-28 text-center">
      <div className="mx-auto max-w-3xl">
        <div className="bg-background text-muted-foreground mb-5 inline-flex items-center rounded-full border px-3 py-1 text-sm">
          🚀 사이드 프로젝트 매칭 플랫폼
        </div>

        <h1 className="mb-6 text-5xl leading-tight font-bold tracking-tight md:text-6xl">
          나만의 프로젝트,
          <br />
          <span className="text-primary">함께할</span> 사람을{' '}
          <br className="block md:hidden" />
          찾고 있나요?
        </h1>

        <p className="text-muted-foreground mb-10 text-lg md:text-xl">
          아이디어를 현실로 만들 팀원을 구하거나,
          <br className="block" />
          진행 중인 프로젝트에 합류해보세요.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" asChild>
            <Link href="/recruitments">팀원 구하기</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/showcase">프로젝트 구경하기</Link>
          </Button>
        </div>

        <div className="text-muted-foreground mt-12 flex items-center justify-center gap-6 text-sm">
          <span>
            <strong className="text-foreground">127개</strong>
            <br className="block md:hidden" /> 모집 진행 중
          </span>
          <span>·</span>
          <span>
            <strong className="text-foreground">34개</strong>
            <br className="block md:hidden" /> 사이드 프로젝트
          </span>
          <span>·</span>
          <span>
            <strong className="text-foreground">89개</strong>
            <br className="block md:hidden" /> 아이디어
          </span>
        </div>
      </div>
    </section>
  );
}
