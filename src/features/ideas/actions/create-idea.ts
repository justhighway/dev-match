'use server';

import { createIdea } from '../services';
import { createIdeaSchema } from '../schemas';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// CreateIdeaActionState 타입 정의
export type CreateIdeaActionState = {
  success: boolean;
  message?: string | null;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

export async function createIdeaAction(
  prevState: CreateIdeaActionState,
  formData: FormData,
): Promise<CreateIdeaActionState> {
  // FormData에서 값 가져오기
  const rawData = {
    title: formData.get('title')?.toString() ?? '',
    content: formData.get('content')?.toString() ?? '',
  };

  // Zod 최신 safeParse
  const parsed = createIdeaSchema.safeParse(rawData);

  if (!parsed.success) {
    // Zod v4: flattenError() 권장
    const flattened = z.flattenError(parsed.error);

    return {
      success: false,
      message: '입력값에 오류가 있습니다.',
      errors: flattened.fieldErrors, // 각 필드별 오류 배열
    };
  }

  // (임시 하드코딩 ID – 최종적으로 auth 시스템과 연동 고려)
  const TEST_USER_ID = 'b466d3a8-4444-4444-4444-444444444444';

  try {
    await createIdea({
      title: parsed.data.title,
      content: parsed.data.content,
      authorId: TEST_USER_ID,
    });
  } catch (error) {
    console.error('Create Idea Error:', error);
    return {
      success: false,
      message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    };
  }

  // ISR / 캐시 재검증
  revalidatePath('/ideas');

  // 성공 시 redirect
  redirect('/ideas');
}
