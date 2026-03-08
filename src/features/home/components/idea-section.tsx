import EmptyState from '@/shared/components/ui/empty-state';
import IdeaCard from '@/features/ideas/components/idea-card';
import { getIdeas } from '@/features/ideas/services/get-ideas';
import CarouselSection from './carousel-section';

export default async function IdeaSection() {
  const ideas = await getIdeas();
  const featured = ideas.slice(0, 8);

  return (
    <CarouselSection title="이런 아이디어 어때요? 💡" href="/ideas">
      {featured.length === 0 ? (
        <EmptyState message="아직 등록된 아이디어가 없어요" />
      ) : (
        featured.map((idea) => (
          <div key={idea.id} className="w-70 shrink-0 snap-start md:w-80">
            <IdeaCard idea={idea} />
          </div>
        ))
      )}
    </CarouselSection>
  );
}
