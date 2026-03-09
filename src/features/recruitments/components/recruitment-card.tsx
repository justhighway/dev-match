import PostCard from '@/shared/components/ui/post-card';

import type { FeaturedRecruitment } from '../services/get-recruitments';

interface RecruitmentCardProps {
  recruitment: FeaturedRecruitment;
}

export default function RecruitmentCard({ recruitment }: RecruitmentCardProps) {
  return (
    <PostCard
      variant="recruitment"
      id={recruitment.id}
      href={`/recruitments/${recruitment.numId}`}
      title={recruitment.title}
      summary={recruitment.summary}
      author={recruitment.leader}
      tags={recruitment.techStacks}
      isClosed={recruitment.isClosed === 'TRUE'}
      likeCount={recruitment.likeCount}
      bookmarkCount={recruitment.bookmarkCount}
      viewCount={recruitment.viewCount}
      createdAt={recruitment.createdAt}
    />
  );
}
