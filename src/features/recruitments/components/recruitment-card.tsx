import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { cn } from '@/shared/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';

import type { FeaturedRecruitment } from '../services/get-recruitments';

interface RecruitmentCardProps {
  recruitment: FeaturedRecruitment;
}

export default function RecruitmentCard({ recruitment }: RecruitmentCardProps) {
  const isClosed = recruitment.isClosed === 'TRUE';

  return (
    <Link
      href={`/recruitments/${recruitment.id}`}
      className="group block h-full"
    >
      <article className="bg-card border-border hover:border-primary/40 flex h-full flex-col gap-4 rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        {/* 헤더: 아바타 + 작성자 + 상태 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Avatar className="size-8 border">
              <AvatarImage src={recruitment.leader.avatarUrl ?? ''} />
              <AvatarFallback>{recruitment.leader.nickname[0]}</AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground text-sm font-medium">
              {recruitment.leader.nickname}
            </span>
          </div>
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
              isClosed
                ? 'bg-muted text-muted-foreground'
                : 'bg-primary/10 text-primary',
            )}
          >
            <span
              className={cn(
                'size-1.5 rounded-full',
                isClosed ? 'bg-muted-foreground' : 'bg-primary',
              )}
            />
            {isClosed ? '모집 마감' : '모집 중'}
          </span>
        </div>

        {/* 제목 */}
        <div className="flex-1">
          <h3 className="group-hover:text-primary line-clamp-2 text-base leading-snug font-semibold transition-colors">
            {recruitment.title}
          </h3>
          <p className="text-muted-foreground mt-1.5 line-clamp-2 text-sm leading-relaxed">
            {recruitment.summary}
          </p>
        </div>

        {/* 기술 스택 태그 */}
        <div className="flex flex-wrap gap-1.5">
          {recruitment.techStacks.slice(0, 4).map((stack) => (
            <span
              key={stack}
              className="bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 text-xs font-medium"
            >
              {stack}
            </span>
          ))}
          {recruitment.techStacks.length > 4 && (
            <span className="text-muted-foreground py-0.5 text-xs">
              +{recruitment.techStacks.length - 4}
            </span>
          )}
        </div>

        {/* 푸터: 날짜 */}
        <p className="text-muted-foreground text-xs">
          {formatDistanceToNow(new Date(recruitment.createdAt), {
            addSuffix: true,
            locale: ko,
          })}
        </p>
      </article>
    </Link>
  );
}
