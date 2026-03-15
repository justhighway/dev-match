import { getIdea } from '@/features/ideas/services/get-idea';
import Container from '@/shared/components/layout/container';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ArrowLeft, MessageSquare, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface IdeaDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function IdeaDetailPage({ params }: IdeaDetailPageProps) {
  const { id } = await params;
  const idea = await getIdea(id);

  if (!idea) notFound();

  return (
    <Container className="max-w-screen-md py-12">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent"
        >
          <Link href="/ideas">
            <ArrowLeft className="mr-2 size-4" />
            목록으로 돌아가기
          </Link>
        </Button>
      </div>

      <div className="mb-8 border-b pb-8">
        <h1 className="mb-6 text-3xl leading-tight font-bold tracking-tight">
          {idea.title}
        </h1>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border">
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

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <ThumbsUp className="mr-2 size-4" />
              {idea.likeCount ?? 0}
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="mr-2 size-4" />
              댓글
            </Button>
          </div>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-foreground/90 text-lg leading-relaxed whitespace-pre-wrap">
          {idea.content}
        </p>
      </div>
    </Container>
  );
}
