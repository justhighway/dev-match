'use server';

import { createClient } from '@/shared/supabase/server';
import { redirect } from 'next/navigation';
import { signInSchema, type SignInInput } from '../schemas';
import { type AuthActionState } from '../types';

const ERROR_MAP: Record<string, string> = {
  'Invalid login credentials': '이메일 또는 비밀번호가 올바르지 않습니다.',
  'Email not confirmed':
    '이메일 인증이 완료되지 않았습니다. 받은 편지함을 확인해주세요.',
};

export async function signInWithEmailAction(
  data: SignInInput,
): Promise<AuthActionState> {
  // 서버 사이드 보안 검증 (클라이언트 우회 대비)
  const parsed = signInSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: '입력값이 올바르지 않습니다.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      success: false,
      message: ERROR_MAP[error.message] ?? '로그인 중 오류가 발생했습니다.',
    };
  }

  redirect('/');
}
