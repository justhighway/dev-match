'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { cn } from '@/shared/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, X } from 'lucide-react';
import { useActionState, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import {
  createRecruitmentAction,
  type CreateRecruitmentActionState,
} from '../actions/create-recruitment';
import {
  ALL_TECH_STACKS,
  RECRUITMENT_TYPE_OPTIONS,
  ROLE_OPTIONS,
} from '../constants/filter-options';
import {
  RECRUITMENT_HEADCOUNT_MAX,
  RECRUITMENT_HEADCOUNT_MIN,
  RECRUITMENT_SUMMARY_MAX,
} from '../constants/recruitment';
import {
  createRecruitmentSchema,
  type CreateRecruitmentInput,
} from '../schemas/create-recruitment';

const initialState: CreateRecruitmentActionState = {
  success: false,
  message: null,
  errors: {},
};

function TechStackSelector({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? ALL_TECH_STACKS.filter((s) =>
        s.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : ALL_TECH_STACKS;

  const toggle = (stack: string) =>
    onChange(
      selected.includes(stack)
        ? selected.filter((s) => s !== stack)
        : [...selected, stack],
    );

  const remove = (stack: string) =>
    onChange(selected.filter((s) => s !== stack));

  return (
    <div className="border-border rounded-xl border">
      {/* 검색창 */}
      <div className="border-b px-3 py-2.5">
        <div className="border-border bg-secondary flex items-center gap-2 rounded-lg border px-3 py-2">
          <Search className="text-muted-foreground size-4 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="기술스택 검색"
            className="placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 선택된 스택 배지 */}
      <div className="min-h-10 border-b px-3 py-2.5">
        {selected.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            선택된 기술스택이 없습니다.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selected.map((stack) => (
              <span
                key={stack}
                className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
              >
                {stack}
                <button
                  type="button"
                  onClick={() => remove(stack)}
                  className="cursor-pointer opacity-60 transition-opacity hover:opacity-100"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 스택 목록 */}
      <div className="max-h-48 overflow-y-auto px-3 py-2.5">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground py-4 text-center text-sm">
            검색 결과가 없습니다
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {filtered.map((stack) => (
              <button
                key={stack}
                type="button"
                onClick={() => toggle(stack)}
                className={cn(
                  'cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                  selected.includes(stack)
                    ? 'bg-primary/10 text-primary border-transparent'
                    : 'border-border bg-background text-foreground hover:bg-secondary',
                )}
              >
                {stack}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RecruitmentForm() {
  const [state, formAction] = useActionState(
    createRecruitmentAction,
    initialState,
  );
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateRecruitmentInput>({
    resolver: zodResolver(createRecruitmentSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      summary: '',
      content: '',
      projectType: '',
      roles: [],
      headcount: RECRUITMENT_HEADCOUNT_MIN,
      techStacks: [],
      openChatUrl: '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.summary) formData.append('summary', data.summary);
    formData.append('content', data.content);
    formData.append('projectType', data.projectType);
    data.roles.forEach((r) => formData.append('roles', r));
    formData.append('headcount', String(data.headcount));
    data.techStacks.forEach((s) => formData.append('techStacks', s));
    formData.append('openChatUrl', data.openChatUrl);
    startTransition(() => formAction(formData));
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 제목 */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                제목 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="프로젝트 팀원 모집 제목을 입력해주세요"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 한 줄 소개 (선택) */}
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                한 줄 소개{' '}
                <span className="text-muted-foreground text-sm font-normal">
                  (선택)
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={`프로젝트를 한 문장으로 소개해주세요 (최대 ${RECRUITMENT_SUMMARY_MAX}자)`}
                  maxLength={RECRUITMENT_SUMMARY_MAX}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 내용 */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                내용 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="프로젝트 소개, 진행 방식, 지원 방법 등을 자유롭게 작성해주세요"
                  className="min-h-48 resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 모집조건 묶음 */}
        <fieldset className="space-y-6">
          <legend className="text-base font-semibold">모집조건</legend>

          {/* 모집종류 */}
          <FormField
            control={form.control}
            name="projectType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  모집종류 <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-2">
                    {RECRUITMENT_TYPE_OPTIONS.map(({ label, value }) => (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={field.value === value}
                        disabled={isPending}
                        onClick={() => field.onChange(value)}
                        className={cn(
                          'cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                          field.value === value
                            ? 'bg-primary/10 text-primary border-transparent'
                            : 'border-border bg-background text-foreground hover:bg-secondary',
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 모집대상 */}
          <FormField
            control={form.control}
            name="roles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  모집대상 <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-2">
                    {ROLE_OPTIONS.map(({ label, value }) => {
                      const selected = field.value.includes(value);
                      return (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={selected}
                          disabled={isPending}
                          onClick={() => {
                            const next = selected
                              ? field.value.filter((v) => v !== value)
                              : [...field.value, value];
                            field.onChange(next);
                          }}
                          className={cn(
                            'cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                            selected
                              ? 'bg-primary/10 text-primary border-transparent'
                              : 'border-border bg-background text-foreground hover:bg-secondary',
                          )}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 모집인원 */}
          <FormField
            control={form.control}
            name="headcount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  모집인원 <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={RECRUITMENT_HEADCOUNT_MIN}
                    max={RECRUITMENT_HEADCOUNT_MAX}
                    placeholder={`${RECRUITMENT_HEADCOUNT_MIN}~${RECRUITMENT_HEADCOUNT_MAX}명`}
                    className="no-spinner"
                    {...field}
                    onChange={(e) => {
                      const val = e.target.valueAsNumber;
                      field.onChange(isNaN(val) ? '' : val);
                    }}
                    onBlur={(e) => {
                      if (e.target.value === '')
                        field.onChange(RECRUITMENT_HEADCOUNT_MIN);
                      field.onBlur();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        {/* 기술스택 */}
        <FormField
          control={form.control}
          name="techStacks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                기술스택 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <TechStackSelector
                  selected={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 카카오톡 오픈채팅 링크 */}
        <FormField
          control={form.control}
          name="openChatUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                카카오톡 오픈채팅 링크{' '}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://open.kakao.com/o/..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 서버 에러 메시지 */}
        {state.message && !state.success && (
          <p className="text-destructive text-sm">{state.message}</p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => history.back()}
            className="border-border text-foreground hover:bg-secondary cursor-pointer rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isPending || !form.formState.isValid}
            className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? '등록 중...' : '모집 등록'}
          </button>
        </div>
      </form>
    </Form>
  );
}
