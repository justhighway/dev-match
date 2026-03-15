import PostCard from '@/shared/components/ui/post-card';

import type { Recruitment } from '../services/get-recruitments';

interface RecruitmentCardProps {
  recruitment: Recruitment;
}

export default function RecruitmentCard({ recruitment }: RecruitmentCardProps) {
  return (
    <PostCard
      variant="recruitment"
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
