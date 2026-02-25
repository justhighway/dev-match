import { ArrowLeft, MessageSquare, ThumbsUp } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';

import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { getIdea } from '@/features/ideas/services';
import { ko } from 'date-fns/locale';
import { notFound } from 'next/navigation';

interface IdeaDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function page({ params }: IdeaDetailPageProps) {
  const { id } = await params;
  const idea = await getIdea(id);

  if (!idea) notFound();

  return (
    <div className="container mx-auto max-w-screen-md px-4 py-12">
      {/* 1. 네비게이션 (뒤로가기) */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent"
        >
          <Link href="/ideas">
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록으로 돌아가기
          </Link>
        </Button>
      </div>

      {/* 2. 헤더 (제목 + 작성자 정보) */}
      <div className="mb-8 border-b pb-8">
        <h1 className="mb-6 text-3xl leading-tight font-bold tracking-tight">
          {idea.title}
        </h1>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={idea.author.avatarUrl || ''} />
              <AvatarFallback>{idea.author.nickname[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {idea.author.nickname}
              </span>
              <span className="text-muted-foreground text-xs">
                {formatDistanceToNow(new Date(idea.createdAt), {
                  addSuffix: true,
                  locale: ko,
                })}
              </span>
            </div>
          </div>

          {/* 3. 액션 버튼 (좋아요, 댓글 등 - 추후 기능 구현) */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <ThumbsUp className="mr-2 h-4 w-4" />
              {idea.likeCount ?? 0}
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              댓글
            </Button>
          </div>
        </div>
      </div>

      {/* 4. 본문 내용 */}
      <div className="prose dark:prose-invert max-w-none">
        {/* whitespace-pre-wrap: 줄바꿈 문자를 실제 줄바꿈으로 렌더링 */}
        <p className="text-foreground/90 text-lg leading-relaxed whitespace-pre-wrap">
          {idea.content}
        </p>
      </div>
    </div>
  );
}
