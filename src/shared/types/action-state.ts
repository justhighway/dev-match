export interface ActionState {
  success: boolean;
  message?: string | null;
  errors?: Record<string, string[] | undefined>;
}
