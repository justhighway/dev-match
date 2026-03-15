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

import type { ActionState } from '@/shared/types/action-state';
import { Button } from '@/shared/components/ui/button';
import { useScrollDirection } from '@/shared/hooks/use-scroll-direction';

import { createRecruitmentAction } from '../actions/create-recruitment';
import {
  RECRUITMENT_HEADCOUNT_MIN,
  RECRUITMENT_SUMMARY_MAX,
  RECRUITMENT_TITLE_MAX,
} from '../constants/recruitment';
import {
  createRecruitmentSchema,
  type CreateRecruitmentInput,
} from '../schemas/create-recruitment';
import RecruitmentConditionFields from './recruitment-condition-fields';

const initialState: ActionState = {
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

  const handleRecruitmentFormSubmit = form.handleSubmit((data) => {
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
    ).forEach(([fieldName, serverErrors]) => {
      if (serverErrors?.[0]) {
        form.setError(fieldName, { type: 'server', message: serverErrors[0] });
      }
    });
  }, [actionState, form]);

  return (
    <Form {...form}>
      <form onSubmit={handleRecruitmentFormSubmit} className="space-y-6">
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
                  id="title-input"
                  placeholder={`프로젝트 팀원 모집 제목을 입력해주세요 (최대 ${RECRUITMENT_TITLE_MAX}자)`}
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
                  id="intro-input"
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

        {/* 모집조건 (종류 / 대상 / 인원 / 기술스택) */}
        <RecruitmentConditionFields form={form} isPending={isPending} />

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

        {/* 서버 에러 메시지 */}
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
