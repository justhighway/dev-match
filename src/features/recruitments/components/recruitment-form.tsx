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
import { useActionState, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { useScrollDirection } from '@/shared/hooks/use-scroll-direction';

import {
  createRecruitmentAction,
  type CreateRecruitmentActionState,
} from '../actions/create-recruitment';
import {
  RECRUITMENT_TYPE_OPTIONS,
  ROLE_OPTIONS,
} from '../constants/filter-options';
import {
  RECRUITMENT_HEADCOUNT_MAX,
  RECRUITMENT_HEADCOUNT_MIN,
  RECRUITMENT_SUMMARY_MAX,
  RECRUITMENT_TITLE_MAX,
} from '../constants/recruitment';
import {
  createRecruitmentSchema,
  type CreateRecruitmentInput,
} from '../schemas/create-recruitment';
import { Button } from '@/shared/components/ui/button';
import TechStackSelector from './tech-stack-selector';

const initialState: CreateRecruitmentActionState = {
  success: false,
  message: null,
  errors: {},
};

export default function RecruitmentForm() {
  const isScrollingUp = useScrollDirection();

  const [actionState, formAction] = useActionState(
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
    data.roles.forEach((role) => formData.append('roles', role));
    formData.append('headcount', String(data.headcount));
    data.techStacks.forEach((stack) => formData.append('techStacks', stack));
    formData.append('openChatUrl', data.openChatUrl);
    startTransition(() => formAction(formData));
  });

  useEffect(() => {
    if (actionState.success || !actionState.errors) return;

    (
      Object.entries(actionState.errors) as [
        keyof CreateRecruitmentInput,
        string[] | undefined,
      ][]
    ).forEach(([fieldName, errorMessages]) => {
      if (errorMessages?.[0]) {
        form.setError(fieldName, { type: 'server', message: errorMessages[0] });
      }
    });
  }, [actionState, form]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 제목 */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                htmlFor="title-input"
                className="text-base font-semibold"
              >
                제목<span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={`프로젝트 팀원 모집 제목을 입력해주세요 (최대 ${RECRUITMENT_TITLE_MAX}자)`}
                  id="title-input"
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
              <FormLabel
                htmlFor="intro-input"
                className="text-base font-semibold"
              >
                한 줄 소개
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
              <FormLabel
                htmlFor="content-textarea"
                className="text-base font-semibold"
              >
                내용 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  id="content-textarea"
                  placeholder="프로젝트 소개, 진행 방식, 지원 방법 등을 자유롭게 작성해주세요"
                  className="min-h-48 resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 모집조건 묶음 */}
        <fieldset className="space-y-8">
          {/* 모집종류 */}
          <FormField
            control={form.control}
            name="projectType"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="type-option-selector"
                  className="text-base font-semibold"
                >
                  모집종류 <span className="text-destructive">*</span>
                </FormLabel>
                <p className="text-muted-foreground -mt-1.5 mb-1 text-sm">
                  프로젝트의 종류를 선택해주세요.
                </p>
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
                <FormLabel
                  htmlFor="role-options-selector"
                  className="text-base font-semibold"
                >
                  모집대상 <span className="text-destructive">*</span>
                </FormLabel>
                <p className="text-muted-foreground -mt-1.5 mb-1 text-sm">
                  프로젝트의 종류를 선택해주세요.
                </p>
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
                <FormLabel
                  htmlFor="headcount-input"
                  className="text-base font-semibold"
                >
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
                      field.onChange(isNaN(val) ? undefined : val);
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
              <FormLabel className="text-base font-semibold">
                기술스택 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <TechStackSelector
                  selectedStacks={field.value}
                  onStacksChange={field.onChange}
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
              <FormLabel
                htmlFor="contact-url-input"
                className="text-base font-semibold"
              >
                카카오톡 오픈채팅 링크{' '}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="contact-url-input"
                  type="url"
                  placeholder="https://open.kakao.com/o/..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 서버 에러 메시지 (필드별 에러가 없는 경우 — DB/인증 오류) */}
        {actionState.message &&
          !actionState.success &&
          !Object.keys(actionState.errors ?? {}).length && (
            <p role="alert" className="text-destructive text-sm">
              {actionState.message}
            </p>
          )}

        {/* floating 제출 버튼 */}
        <div
          className={cn(
            'max-w-screen-3xl fixed bottom-10 left-1/2 w-full -translate-x-1/2 px-6 transition-transform duration-300 ease-in-out md:px-8',
            isScrollingUp ? 'translate-y-0' : 'translate-y-24',
          )}
        >
          <Button
            type="submit"
            size="lg"
            className="w-full shadow-lg"
            disabled={isPending || !form.formState.isValid}
          >
            {isPending ? '등록 중...' : '모집 등록'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
