import { z } from 'zod';

export const createIdeaSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요.')
    .min(2, '제목은 최소 2글자 이상이어야 합니다.')
    .max(100, '제목은 100자를 넘을 수 없습니다.'),
  content: z
    .string()
    .min(1, '내용을 입력해주세요.')
    .min(10, '내용은 최소 10글자 이상 작성해주세요.'),
});

export type CreateIdeaInput = z.infer<typeof createIdeaSchema>;
