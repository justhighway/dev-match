import OnlyOpenToggle from '@/features/recruitments/components/only-open-toggle';
import RecruitmentCard from '@/features/recruitments/components/recruitment-card';
import RecruitmentFilterBar from '@/features/recruitments/components/recruitment-filter-bar';
import { SORT_OPTIONS } from '@/features/recruitments/constants/filter-options';
import {
  getRecruitments,
  type RecruitmentsFilter,
} from '@/features/recruitments/services/get-recruitments';
import Container from '@/shared/components/layout/container';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { Plus, SearchX } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

interface PageProps {
  searchParams: Promise<{
    onlyOpen?: string;
    sort?: string;
    type?: string | string[];
    role?: string | string[];
    stack?: string | string[];
    headcountMin?: string;
    headcountMax?: string;
  }>;
}

const VALID_SORTS = SORT_OPTIONS.map((o) => o.value);

const toArray = (v: string | string[] | undefined): string[] => {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
};

export default async function RecruitmentsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const filter: RecruitmentsFilter = {
    onlyOpen: params.onlyOpen === 'true',
    sort: VALID_SORTS.includes(params.sort as never)
      ? (params.sort as RecruitmentsFilter['sort'])
      : undefined,
    types: toArray(params.type),
    roles: toArray(params.role),
    stacks: toArray(params.stack),
    headcountMin: params.headcountMin ? Number(params.headcountMin) : undefined,
    headcountMax: params.headcountMax ? Number(params.headcountMax) : undefined,
  };

  const recruitments = await getRecruitments(filter);

  return (
    <Container className="py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-800">
            팀원 모집
          </h1>
          <p className="text-muted-foreground mt-1">
            함께할 팀원을 찾거나, 프로젝트에 합류해보세요.
          </p>
        </div>
        <Button asChild>
          <Link href="/recruitments/new">
            <Plus className="mr-2 size-4" />
            모집 등록
          </Link>
        </Button>
      </div>

      <Suspense>
        <RecruitmentFilterBar />
      </Suspense>

      <Separator className="bg-border/40 my-6" />

      <div className="mb-8 flex items-center justify-end">
        <Suspense>
          <OnlyOpenToggle />
        </Suspense>
      </div>

      {recruitments.length === 0 ? (
        <div className="flex h-120 flex-col items-center justify-center gap-4">
          <SearchX
            className="text-muted-foreground/50 size-14"
            strokeWidth={1.2}
          />
          <p className="text-muted-foreground font-medium">
            조건에 맞는 모집 공고가 없어요
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recruitments.map((recruitment) => (
            <RecruitmentCard key={recruitment.id} recruitment={recruitment} />
          ))}
        </div>
      )}
    </Container>
  );
}
