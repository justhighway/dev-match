import { Suspense } from 'react';

import CtaBanner from '@/features/home/components/cta-banner';
import Hero from '@/features/home/components/hero';
import IdeaSection from '@/features/home/components/idea-section';
import RecruitmentSection from '@/features/home/components/recruitment-section';
import SectionSkeleton from '@/features/home/components/section-skeleton';
import ShowcaseSection from '@/features/home/components/showcase-section';
import Container from '@/shared/components/layout/container';

export default function Page() {
  return (
    <div className="w-full">
      <Hero />
      <Container className="flex flex-col gap-16 py-16">
        <Suspense fallback={<SectionSkeleton />}>
          <RecruitmentSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton cardHeight="h-64" />}>
          <ShowcaseSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <IdeaSection />
        </Suspense>

        <CtaBanner />
      </Container>
    </div>
  );
}
