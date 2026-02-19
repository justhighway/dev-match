'use client';

import { ActionState, createIdeaAction } from '../actions';
import { CreateIdeaInput, createIdeaSchema } from '../schema';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const initialState: ActionState = {
  success: false,
  message: null,
  errors: {},
};

export default function IdeaForm() {
  const [state, formAction, isPending] = useActionState(
    createIdeaAction,
    initialState,
  );

  const form = useForm<CreateIdeaInput>({
    resolver: zodResolver(createIdeaSchema), // 버전 맞췄으니 이제 에러 없음!
    defaultValues: {
      title: '',
      content: '',
    },
    // ❌ errors 속성은 여기서 삭제! (필수)
  });

  return (
    <form action={formAction} className="space-y-4">
      {state.message && !state.success && (
        <div className="text-sm font-medium text-red-500">
          ⚠️ {state.message}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">제목</label>
        <Input {...form.register('title')} placeholder="제목을 입력하세요" />
        {/* 클라이언트 에러(RHF) 또는 서버 에러(Action) 표시 */}
        <p className="mt-1 text-xs text-red-500">
          {form.formState.errors.title?.message || state.errors?.title?.[0]}
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">내용</label>
        <Textarea
          {...form.register('content')}
          placeholder="내용을 입력하세요"
        />
        <p className="mt-1 text-xs text-red-500">
          {form.formState.errors.content?.message || state.errors?.content?.[0]}
        </p>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? '등록 중...' : '아이디어 등록'}
      </Button>
    </form>
  );
}
