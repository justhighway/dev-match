import CarouselSection from './carousel-section';
import EmptyState from '@/shared/components/ui/empty-state';
import RecruitmentCard from '@/features/recruitments/components/recruitment-card';
import { getFeaturedRecruitments } from '@/features/recruitments/services/get-recruitments';

export default async function RecruitmentSection() {
  const recruitments = await getFeaturedRecruitments(8);

  return (
    <CarouselSection title="🔥 지금 인기 있는 팀원 모집" href="/recruitments">
      {recruitments.length === 0 ? (
        <EmptyState message="아직 등록된 팀원 모집이 없어요" />
      ) : (
        recruitments.map((r) => (
          <div
            key={r.id}
            className="w-[280px] shrink-0 md:w-[320px]"
            style={{ scrollSnapAlign: 'start' }}
          >
            <RecruitmentCard recruitment={r} />
          </div>
        ))
      )}
    </CarouselSection>
  );
}
