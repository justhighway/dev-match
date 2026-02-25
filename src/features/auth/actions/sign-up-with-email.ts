'use server';

import { createClient } from '@/shared/supabase/server';
import { redirect } from 'next/navigation';
import { signUpSchema, type SignUpInput } from '../schemas';
import { type AuthActionState } from '../types';

export async function signUpWithEmailAction(
  data: SignUpInput,
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: '입력값이 올바르지 않습니다.' };
  }

  const { email, password, nickname } = parsed.data;

  const supabase = await createClient();
  const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: nickname },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error('Supabase signUp error:', error);
    return { success: false, message: '회원가입 중 오류가 발생했습니다.' };
  }

  // identities가 빈 배열이면 이미 가입된 이메일 (user_repeated_signup)
  // Supabase는 이메일 열거 공격 방지를 위해 에러 대신 200을 반환함
  if (signUpData.user?.identities?.length === 0) {
    return {
      success: false,
      message: '이미 가입된 이메일입니다. 로그인을 시도해주세요.',
      field: 'email',
    };
  }

  redirect('/auth/signup/verify');
}
