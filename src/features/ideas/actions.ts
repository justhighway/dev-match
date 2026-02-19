'use server';

import { createIdea } from './services';
import { createIdeaSchema } from './schema';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// ActionState 타입 정의
export type ActionState = {
  success: boolean;
  message?: string | null;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

export async function createIdeaAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const rawData = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
  };

  // Zod v3 유효성 검사
  const validated = createIdeaSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: '입력값에 오류가 있습니다.',
      // 🔥 정답: flatten() 사용
      // Zod v3에서는 이게 가장 깔끔하고 에러가 안 납니다.
      errors: validated.error.flatten().fieldErrors,
    };
  }

  // (임시 하드코딩 ID)
  const TEST_USER_ID = 'b466d3a8-4444-4444-4444-444444444444';

  try {
    await createIdea({
      title: validated.data.title,
      content: validated.data.content,
      authorId: TEST_USER_ID,
    });
  } catch (error) {
    console.error('Create Idea Error:', error);
    return {
      success: false,
      message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    };
  }

  revalidatePath('/ideas');
  redirect('/ideas');
}
