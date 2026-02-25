export const featureFlags = {
  emailAuth: process.env.NEXT_PUBLIC_FEATURE_EMAIL_AUTH === 'true',
} as const;
