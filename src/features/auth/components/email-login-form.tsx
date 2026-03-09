'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';
import { signInWithEmailAction } from '../actions';
import { signInSchema, type SignInInput } from '../schemas';
import { FormInput } from '@/shared/components/ui/form-input';

export default function EmailLoginForm() {
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: SignInInput) => {
    const result = await signInWithEmailAction(data);
    if (!result.success) {
      form.setError('root', { message: result.message });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          control={form.control}
          name="email"
          label="이메일"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <FormInput
          control={form.control}
          name="password"
          label="비밀번호"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
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
          {form.formState.isSubmitting ? '로그인 중...' : '로그인'}
        </Button>

        <p className="text-muted-foreground text-center text-sm">
          계정이 없으신가요?{' '}
          <Link
            href="/auth/signup"
            className="text-foreground underline-offset-4 hover:underline"
          >
            회원가입
          </Link>
        </p>
      </form>
    </Form>
  );
}
