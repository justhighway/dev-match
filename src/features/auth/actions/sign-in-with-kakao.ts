'use server';

import { createClient } from '@/shared/supabase/server';
import { redirect } from 'next/navigation';

export async function signInWithKakao() {
  const supabase = await createClient();

  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (data.url) redirect(data.url);
}
