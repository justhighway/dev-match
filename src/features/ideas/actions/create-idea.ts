'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import type { ActionState } from '@/shared/types/action-state';
import { createClient } from '@/shared/supabase/server';

import { createIdeaSchema } from '../schemas/create-idea';
import { createIdea } from '../services/create-idea';

export async function createIdeaAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: '로그인이 필요합니다.' };
  }

  const rawData = {
    title: formData.get('title')?.toString() ?? '',
    content: formData.get('content')?.toString() ?? '',
  };

  const parsed = createIdeaSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: '입력값에 오류가 있습니다.',
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    await createIdea({
      title: parsed.data.title,
      content: parsed.data.content,
      authorId: user.id,
    });
  } catch {
    return {
      success: false,
      message:
        '아이디어 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    };
  }

  revalidatePath('/ideas');
  redirect('/ideas');
}
