/**
 * Shared progress fractions for the Polly onboarding stack.
 * Values drive ProgressHeader fill width (0–1). Tuned to match the
 * reference screens: language starts as a short stub, then grows.
 */
export const OnboardingProgress = {
  language: 0.1,
  level: 0.38,
  notifications: 0.58,
  phone: 0.78,
  verify: 0.94,
  imessage: 0.99,
} as const;

/** Previous step's fill — ProgressHeader animates from here on mount. */
export const OnboardingProgressFrom: Record<keyof typeof OnboardingProgress, number> = {
  language: 0,
  level: OnboardingProgress.language,
  notifications: OnboardingProgress.level,
  phone: OnboardingProgress.notifications,
  verify: OnboardingProgress.phone,
  imessage: OnboardingProgress.verify,
};
