import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Bookmark, Eye, Heart } from 'lucide-react';

import Link from 'next/link';
import type { PostCardProps } from '@/shared/types/post-card';
import TagList from '@/shared/components/ui/tag-list';
import { cn } from '@/shared/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

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
                aria-hidden
              />
              {isClosed ? '모집 마감' : '모집 중'}
            </span>
          )}
        </div>

        <div className="flex-1">
          <h3 className="group-hover:text-primary line-clamp-2 leading-snug font-semibold transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground mt-1.5 line-clamp-2 text-sm leading-relaxed">
            {summary}
          </p>
        </div>

        {tags && tags.length > 0 && <TagList tags={tags} />}

        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <span>
            {formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
              locale: ko,
            })}
          </span>
          <div className="flex items-center gap-3">
            <span
              className="flex items-center gap-1"
              aria-label={`좋아요 ${likeCount}개`}
            >
              <Heart className="size-3.5" aria-hidden />
              {likeCount}
            </span>
            <span
              className="flex items-center gap-1"
              aria-label={`북마크 ${bookmarkCount}개`}
            >
              <Bookmark className="size-3.5" aria-hidden />
              {bookmarkCount}
            </span>
            <span
              className="flex items-center gap-1"
              aria-label={`조회수 ${viewCount}회`}
            >
              <Eye className="size-3.5" aria-hidden />
              {viewCount}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
