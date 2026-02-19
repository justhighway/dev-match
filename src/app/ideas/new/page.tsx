import IdeaForm from '@/features/ideas/components/idea-form';

export default function NewIdeaPage() {
  return (
    <div className="container mx-auto max-w-screen-md px-4 py-12">
      {/* 헤더 섹션 */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          새 아이디어 등록 💡
        </h1>
        <p className="text-muted-foreground">
          당신의 상상을 현실로 만드는 첫 걸음입니다. 자유롭게 작성해주세요.
        </p>
      </div>

      {/* 폼 섹션 (카드 스타일 컨테이너) */}
      <div className="bg-card rounded-xl border p-6 shadow-sm">
        <IdeaForm />
      </div>
    </div>
  );
}
