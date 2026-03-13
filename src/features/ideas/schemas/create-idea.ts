import { z } from 'zod';

import {
  IDEA_CONTENT_MIN,
  IDEA_TITLE_MAX,
  IDEA_TITLE_MIN,
} from '../constants/idea';

export const createIdeaSchema = z.object({
  title: z
    .string()
    .trim()
    .min(IDEA_TITLE_MIN, `제목은 최소 ${IDEA_TITLE_MIN}글자 이상이어야 합니다.`)
    .max(IDEA_TITLE_MAX, `제목은 ${IDEA_TITLE_MAX}자를 넘을 수 없습니다.`),
  content: z
    .string()
    .trim()
    .min(
      IDEA_CONTENT_MIN,
      `내용은 최소 ${IDEA_CONTENT_MIN}글자 이상 작성해주세요.`,
    ),
});

export type CreateIdeaInput = z.infer<typeof createIdeaSchema>;
