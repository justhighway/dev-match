import { db } from '@/shared/db';
import { usersTable } from '@/shared/db/schema';
import { createClient } from '@/shared/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // OAuth / Email에서 받아온 유저 정보를 우리 DB에 upsert
      const { id, email, user_metadata } = data.user;

      await db
        .insert(usersTable)
        .values({
          id,
          email: email!,
          nickname:
            user_metadata.user_name ??
            user_metadata.full_name ??
            email!.split('@')[0],
          avatarUrl: user_metadata.avatar_url ?? null,
          githubUrl: user_metadata.html_url ?? null,
        })
        .onConflictDoUpdate({
          target: usersTable.id,
          set: {
            avatarUrl: user_metadata.avatar_url ?? null,
          },
        });

      return NextResponse.redirect(origin);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=callback_error`);
}
