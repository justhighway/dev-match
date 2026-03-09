import {
  RECRUITMENT_TYPE_OPTIONS,
  ROLE_OPTIONS,
} from '../constants/filter-options';

import { z } from 'zod';

const VALID_TYPES = RECRUITMENT_TYPE_OPTIONS.map((o) => o.value);
const VALID_ROLES = ROLE_OPTIONS.map((o) => o.value);

export const createRecruitmentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, '제목을 입력해주세요.')
    .max(100, '제목은 100자를 넘을 수 없습니다.'),
  summary: z
    .string()
    .trim()
    .max(200, '한 줄 소개는 200자를 넘을 수 없습니다.')
    .optional(),
  content: z
    .string()
    .trim()
    .min(1, '내용을 입력해주세요.')
    .min(10, '내용은 최소 10글자 이상 작성해주세요.'),
  projectType: z
    .string()
    .refine(
      (v) => VALID_TYPES.includes(v as never),
      '모집종류를 선택해주세요.',
    ),
  roles: z
    .array(z.string().refine((v) => VALID_ROLES.includes(v as never)))
    .min(1, '모집대상을 1개 이상 선택해주세요.'),
  headcount: z
    .number()
    .int()
    .min(1, '모집인원은 최소 1명입니다.')
    .max(10, '모집인원은 최대 10명입니다.'),
  techStacks: z.array(z.string()).min(1, '기술스택을 1개 이상 선택해주세요.'),
  openChatUrl: z
    .url('올바른 URL 형식으로 입력해주세요.')
    .min(1, '카카오톡 오픈채팅 링크를 입력해주세요.')
    .refine(
      (v) => v.startsWith('https://open.kakao.com/'),
      '카카오톡 오픈채팅 링크만 입력 가능합니다. (https://open.kakao.com/...)',
    ),
});

export type CreateRecruitmentInput = z.infer<typeof createRecruitmentSchema>;
