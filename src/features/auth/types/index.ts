export type AuthActionState = {
  success: boolean;
  message?: string;
  field?: 'email' | 'password' | 'nickname' | 'passwordConfirm';
};
