import IdeaForm from '@/features/ideas/components/idea-form';
import Container from '@/shared/components/layout/container';

export default function NewIdeaPage() {
  return (
    <Container className="py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            아이디어 등록
          </h1>
          <p className="text-muted-foreground mt-1">
            자유롭게 아이디어를 공유해보세요.
          </p>
        </div>
        <IdeaForm />
      </div>
    </Container>
  );
}
