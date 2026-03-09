'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { FormInput } from '@/shared/components/ui/form-input';
import { Slider } from '@/shared/components/ui/slider';
import { Textarea } from '@/shared/components/ui/textarea';
import { cn } from '@/shared/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import {
  createRecruitmentAction,
  type CreateRecruitmentActionState,
} from '../actions/create-recruitment';
import {
  RECRUITMENT_TYPE_OPTIONS,
  ROLE_OPTIONS,
} from '../constants/filter-options';
import {
  createRecruitmentSchema,
  type CreateRecruitmentInput,
} from '../schemas/create-recruitment';
import TechStackField from './tech-stack-field';

const MIN = 1;
const MAX = 10;

const initialState: CreateRecruitmentActionState = {
  success: false,
  message: null,
  errors: {},
};

export default function RecruitmentForm() {
  const [state, formAction, isPending] = useActionState(
    createRecruitmentAction,
    initialState,
  );

  const form = useForm<CreateRecruitmentInput>({
    resolver: zodResolver(createRecruitmentSchema),
    defaultValues: {
      title: '',
      summary: '',
      content: '',
      projectType: '',
      roles: [],
      headcount: 2,
      techStacks: [],
      openChatUrl: '',
    },
  });

  const headcount = useWatch({ control: form.control, name: 'headcount' });
  const headcountLabel =
    headcount === MAX ? `${headcount}명 이상` : `${headcount}명`;

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-8">
        {/* 서버 에러 메시지 */}
        {state.message && !state.success && (
          <p className="text-destructive text-sm">{state.message}</p>
        )}

        {/* 제목 */}
        <FormInput
          control={form.control}
          name="title"
          label="제목"
          placeholder="프로젝트 팀원 모집 제목을 입력해주세요"
          required
        />

        {/* 한 줄 소개 (선택) */}
        <FormInput
          control={form.control}
          name="summary"
          label="한 줄 소개"
          placeholder="프로젝트를 한 문장으로 소개해주세요 (최대 200자)"
          maxLength={200}
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
              <FormMessage>{state.errors?.content?.[0]}</FormMessage>
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
                {/* hidden input — Server Action FormData 전달용 */}
                <input type="hidden" name="projectType" value={field.value} />
                <FormControl>
                  <div className="flex flex-wrap gap-2">
                    {RECRUITMENT_TYPE_OPTIONS.map(({ label, value }) => (
                      <button
                        key={value}
                        type="button"
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
                <FormMessage>{state.errors?.projectType?.[0]}</FormMessage>
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
                {/* hidden inputs */}
                {field.value.map((v) => (
                  <input key={v} type="hidden" name="roles" value={v} />
                ))}
                <FormControl>
                  <div className="flex flex-wrap gap-2">
                    {ROLE_OPTIONS.map(({ label, value }) => {
                      const selected = field.value.includes(value);
                      return (
                        <button
                          key={value}
                          type="button"
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
                <FormMessage>{state.errors?.roles?.[0]}</FormMessage>
              </FormItem>
            )}
          />

          {/* 모집인원 */}
          <FormField
            control={form.control}
            name="headcount"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>
                    모집인원 <span className="text-destructive">*</span>
                  </FormLabel>
                  <span className="text-muted-foreground text-sm">
                    {headcountLabel}
                  </span>
                </div>
                {/* hidden input */}
                <input type="hidden" name="headcount" value={field.value} />
                <FormControl>
                  <Slider
                    min={MIN}
                    max={MAX}
                    step={1}
                    value={[field.value]}
                    onValueChange={([v]) => field.onChange(v)}
                  />
                </FormControl>
                <div className="text-muted-foreground flex justify-between text-sm">
                  <span>{MIN}명</span>
                  <span>{MAX}명 이상</span>
                </div>
                <FormMessage>{state.errors?.headcount?.[0]}</FormMessage>
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
              {field.value.map((v) => (
                <input key={v} type="hidden" name="techStacks" value={v} />
              ))}
              <FormControl>
                <TechStackField
                  selected={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage>{state.errors?.techStacks?.[0]}</FormMessage>
            </FormItem>
          )}
        />

        {/* 카카오톡 오픈채팅 링크 */}
        <FormInput
          control={form.control}
          name="openChatUrl"
          label="카카오톡 오픈채팅 링크"
          placeholder="https://open.kakao.com/o/..."
          type="url"
          required
        />

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
            disabled={isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? '등록 중...' : '모집 등록'}
          </button>
        </div>
      </form>
    </Form>
  );
}
