'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import type { ActionState } from '@/shared/types/action-state';
import { Button } from '@/shared/components/ui/button';
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

import { createIdeaAction } from '../actions/create-idea';
import { type CreateIdeaInput, createIdeaSchema } from '../schemas/create-idea';

const initialState: ActionState = {
  success: false,
  message: null,
  errors: {},
};

export default function IdeaForm() {
  const [actionState, formAction, isPending] = useActionState(
    createIdeaAction,
    initialState,
  );

  const form = useForm<CreateIdeaInput>({
    resolver: zodResolver(createIdeaSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      content: '',
    },
  });

  useEffect(() => {
    if (actionState.success || !actionState.errors) return;

    (
      Object.entries(actionState.errors) as [
        keyof CreateIdeaInput,
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
      <form action={formAction} className="space-y-6">
        {actionState.message && !actionState.success && (
          <p role="alert" className="text-destructive text-sm">
            {actionState.message}
          </p>
        )}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                htmlFor="title-input"
                className="text-base font-semibold"
              >
                제목 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="title-input"
                  placeholder="제목을 입력하세요"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  id="content-textarea"
                  placeholder="내용을 입력하세요"
                  className="min-h-48 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? '등록 중...' : '아이디어 등록'}
        </Button>
      </form>
    </Form>
  );
}
