'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';
import { signUpWithEmailAction } from '../actions';
import { signUpSchema, type SignUpInput } from '../schemas';
import { FormInput } from './form-input';

export default function SignupForm() {
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      nickname: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const onSubmit = async (data: SignUpInput) => {
    const result = await signUpWithEmailAction(data);
    if (!result.success) {
      if (result.field) {
        // 특정 필드 에러 (예: 중복 이메일 → email 필드에 표시)
        form.setError(result.field, { message: result.message });
      } else {
        // 일반 서버 에러 → 폼 하단에 표시
        form.setError('root', { message: result.message });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          control={form.control}
          name="nickname"
          label="닉네임"
          placeholder="2~20자"
          autoComplete="username"
        />
        <FormInput
          control={form.control}
          name="email"
          label="이메일"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
        />
        <FormInput
          control={form.control}
          name="password"
          label="비밀번호"
          type="password"
          placeholder="8자 이상"
          autoComplete="new-password"
        />
        <FormInput
          control={form.control}
          name="passwordConfirm"
          label="비밀번호 확인"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
        />

        {form.formState.errors.root && (
          <p className="text-destructive text-sm">
            {form.formState.errors.root.message}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? '가입 중...' : '회원가입'}
        </Button>

        <p className="text-muted-foreground text-center text-sm">
          이미 계정이 있으신가요?{' '}
          <Link
            href="/auth/login/email"
            className="text-foreground underline-offset-4 hover:underline"
          >
            로그인
          </Link>
        </p>
      </form>
    </Form>
  );
}
