import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import type { Showcase } from '../services/get-showcases';

interface ShowcaseCardProps {
  showcase: Showcase;
}

export default function ShowcaseCard({ showcase }: ShowcaseCardProps) {
  return (
    <Link href={`/showcase/${showcase.id}`} className="group block h-full">
      <article className="bg-card border-border hover:border-primary/40 flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        {/* 썸네일 */}
        <div className="bg-muted relative aspect-video w-full overflow-hidden">
          {showcase.thumbnailUrl ? (
            <Image
              src={showcase.thumbnailUrl}
              alt={showcase.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <div className="from-primary/20 to-primary/5 flex h-full w-full items-center justify-center bg-gradient-to-br">
              <span className="text-primary/40 text-4xl font-bold">
                {showcase.title[0]}
              </span>
            </div>
          )}
        </div>

        {/* 바디 */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex-1">
            <h3 className="group-hover:text-primary line-clamp-1 font-semibold transition-colors">
              {showcase.title}
            </h3>
            <p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-relaxed">
              {showcase.summary}
            </p>
          </div>

          {/* 푸터: 작성자 + 좋아요 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="size-6">
                <AvatarImage src={showcase.author.avatarUrl ?? ''} />
                <AvatarFallback className="text-xs">
                  {showcase.author.nickname[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground text-xs">
                {showcase.author.nickname}
              </span>
            </div>
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <Heart className="size-3.5" />
              <span>{showcase.likeCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
