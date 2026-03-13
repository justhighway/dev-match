'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import type { ActionState } from '@/shared/types/action-state';
import { createClient } from '@/shared/supabase/server';
import {
  RECRUITMENT_HEADCOUNT_MAX,
  RECRUITMENT_HEADCOUNT_MIN,
} from '../constants/recruitment';
import { createRecruitmentSchema } from '../schemas/create-recruitment';
import { createRecruitment } from '../services/create-recruitment';

const formSchema = createRecruitmentSchema.extend({
  headcount: z.coerce
    .number()
    .int()
    .min(RECRUITMENT_HEADCOUNT_MIN)
    .max(RECRUITMENT_HEADCOUNT_MAX),
});

export async function createRecruitmentAction(
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
    summary: formData.get('summary')?.toString() || undefined,
    content: formData.get('content')?.toString() ?? '',
    projectType: formData.get('projectType')?.toString() ?? '',
    roles: formData.getAll('roles').map(String),
    headcount: formData.get('headcount')?.toString() ?? '',
    techStacks: formData.getAll('techStacks').map(String),
    openChatUrl: formData.get('openChatUrl')?.toString() ?? '',
  };

  const parsed = formSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: '입력값에 오류가 있습니다.',
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  let numId: number;
  try {
    const created = await createRecruitment({
      ...parsed.data,
      summary: parsed.data.summary ?? '',
      leaderId: user.id,
    });
    numId = created.numId;
  } catch {
    return {
      success: false,
      message:
        '모집 글 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    };
  }

  revalidatePath('/recruitments');
  redirect(`/recruitments/${numId}`);
}
