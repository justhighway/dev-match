import RecruitmentForm from '@/features/recruitments/components/recruitment-form';
import Container from '@/shared/components/layout/container';

export default function NewRecruitmentPage() {
  return (
    <Container className="py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-800">
            모집 등록
          </h1>
          <p className="text-muted-foreground mt-1">
            함께할 팀원을 모집해보세요.
          </p>
        </div>
        <RecruitmentForm />
      </div>
    </Container>
  );
}
