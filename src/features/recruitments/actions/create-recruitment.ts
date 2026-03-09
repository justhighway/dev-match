'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { createClient } from '@/shared/supabase/server';

import { createRecruitmentSchema } from '../schemas/create-recruitment';
import { createRecruitment } from '../services/create-recruitment';

export interface CreateRecruitmentActionState {
  success: boolean;
  message?: string | null;
  errors?: Record<string, string[] | undefined>;
}

const formSchema = createRecruitmentSchema.extend({
  headcount: z.coerce.number().int().min(1).max(10),
  roles: z.array(z.string()).or(z.string().transform((v) => [v])),
  techStacks: z.array(z.string()).or(z.string().transform((v) => [v])),
});

export async function createRecruitmentAction(
  prevState: CreateRecruitmentActionState,
  formData: FormData,
): Promise<CreateRecruitmentActionState> {
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

  const created = await createRecruitment({
    ...parsed.data,
    summary: parsed.data.summary ?? '',
    leaderId: user.id,
  });

  revalidatePath('/recruitments');
  redirect(`/recruitments/${created.numId}`);
}
