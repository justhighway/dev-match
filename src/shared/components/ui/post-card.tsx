import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import TagList from '@/shared/components/ui/tag-list';
import { Bookmark, Eye, Heart } from 'lucide-react';

import Link from 'next/link';
import { cn } from '@/shared/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface PostCardAuthor {
  nickname: string;
  avatarUrl: string | null;
}

interface PostCardBase {
  id: string;
  title: string;
  summary: string;
  href: string;
  author: PostCardAuthor;
  likeCount: number;
  bookmarkCount: number;
  viewCount: number;
  createdAt: Date;
  tags?: string[];
}

interface RecruitmentPostCard extends PostCardBase {
  variant: 'recruitment';
  isClosed: boolean;
}

interface DefaultPostCard extends PostCardBase {
  variant?: 'idea';
  isClosed?: never;
}

type PostCardProps = RecruitmentPostCard | DefaultPostCard;

export default function PostCard({
  title,
  summary,
  href,
  author,
  likeCount,
  bookmarkCount,
  viewCount,
  createdAt,
  tags,
  variant,
  isClosed,
}: PostCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <article className="bg-card border-border hover:border-primary/40 flex h-full flex-col gap-4 rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        {/* 헤더: 아바타 + 작성자 + (모집 배지) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Avatar className="size-8 border">
              <AvatarImage src={author.avatarUrl ?? ''} />
              <AvatarFallback>{author.nickname[0]}</AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground text-sm font-medium">
              {author.nickname}
            </span>
          </div>

          {variant === 'recruitment' && (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
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
          )}
        </div>

        {/* 본문: 제목 + 요약 */}
        <div className="flex-1">
          <h3 className="group-hover:text-primary line-clamp-2 leading-snug font-semibold transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground mt-1.5 line-clamp-2 text-sm leading-relaxed">
            {summary}
          </p>
        </div>

        {/* 태그 */}
        {tags && tags.length > 0 && <TagList tags={tags} />}

        {/* 푸터: 날짜 + 통계 */}
        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <span>
            {formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
              locale: ko,
            })}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Heart className="size-3.5" />
              {likeCount}
            </span>
            <span className="flex items-center gap-1">
              <Bookmark className="size-3.5" />
              {bookmarkCount}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="size-3.5" />
              {viewCount}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
