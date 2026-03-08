import CarouselSection from './carousel-section';
import EmptyState from '@/shared/components/ui/empty-state';
import ShowcaseCard from '@/features/showcase/components/showcase-card';
import { getShowcases } from '@/features/showcase/services/get-showcases';

export default async function ShowcaseSection() {
  const showcases = await getShowcases(8);

  return (
    <CarouselSection title="✨ 주목받는 사이드 프로젝트" href="/showcase">
      {showcases.length === 0 ? (
        <EmptyState message="아직 등록된 프로젝트가 없어요" />
      ) : (
        showcases.map((s) => (
          <div key={s.id} className="w-70 shrink-0 snap-start md:w-84">
            <ShowcaseCard showcase={s} />
          </div>
        ))
      )}
    </CarouselSection>
  );
}
