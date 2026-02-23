import z from 'zod';

export const signInSchema = z.object({
  email: z
    .email('올바른 이메일 형식이 아닙니다.')
    .min(1, '이메일을 입력해주세요.'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요.')
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
});

export const signUpSchema = z
  .object({
    email: z
      .email('올바른 이메일 형식이 아닙니다.')
      .min(1, '이메일을 입력해주세요.'),
    nickname: z
      .string()
      .min(1, '닉네임을 입력해주세요.')
      .min(2, '닉네임은 최소 2자 이상이어야 합니다.')
      .max(20, '닉네임은 최대 20자를 넘을 수 없습니다.'),
    password: z
      .string()
      .min(1, '비밀번호를 입력해주세요.')
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
    passwordConfirm: z
      .string()
      .min(1, '비밀번호 확인을 입력해주세요.')
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다.',
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
