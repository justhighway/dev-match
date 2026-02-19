import { Button } from '@/shared/components/ui/button';
import IdeaCard from '@/features/ideas/components/IdeaCard';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getIdeas } from '@/features/ideas/services';

export default async function IdeasPage() {
  const ideas = await getIdeas();
  void ideas;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
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
        <div className="rounded-lg border-dashed py-20 text-center">
          <p className="text-muted-fourground mb-4">
            아직 등록된 아이디어가 없습니다.
          </p>
          <Button variant="outline">첫 번째 아이디어를 등록해보세요</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  );
}
