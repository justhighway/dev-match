import IdeaCard from '@/features/ideas/components/idea-card';
import { getIdeas } from '@/features/ideas/services/get-ideas';
import Container from '@/shared/components/layout/container';
import { Button } from '@/shared/components/ui/button';
import EmptyState from '@/shared/components/ui/empty-state';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function IdeasPage() {
  const ideas = await getIdeas();

  return (
    <Container className="max-w-3xl py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">아이디어 광장</h1>
          <p className="text-muted-foreground mt-1">
            가벼운 아이디어를 던지고 반응을 확인해보세요.
          </p>
        </div>
        <Button asChild>
          <Link href="/ideas/new">
            <Plus className="mr-2 size-4" />
            아이디어 등록
          </Link>
        </Button>
      </div>

      {ideas.length === 0 ? (
        <EmptyState message="아직 등록된 아이디어가 없습니다." />
      ) : (
        <div className="flex flex-col gap-4">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </Container>
  );
}
