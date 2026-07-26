import { postJson } from '@/utils/api';

export type SendCodeResult = {
  phone: string;
  delivered: boolean;
  expires_in: number;
  resend_available_in: number;
};

export type VerifyCodeResult = {
  phone: string;
  verified: boolean;
  reason?: string | null;
  attempts_remaining?: number | null;
};

export function sendVerificationCode(phone: string) {
  return postJson<SendCodeResult>('/verification/send', { phone });
}

export function resendVerificationCode(phone: string) {
  return postJson<SendCodeResult>('/verification/resend', { phone });
}

export function verifyPhoneCode(phone: string, code: string) {
  return postJson<VerifyCodeResult>('/verification/verify', { phone, code });
}

/** Copy for the failure reasons the verify endpoint can return. */
export function describeVerifyFailure(result: VerifyCodeResult): string {
  switch (result.reason) {
    case 'expired':
      return 'That code expired. Tap “Didn’t receive a code?” for a new one.';
    case 'too_many_attempts':
      return 'Too many incorrect attempts. Request a new code.';
    case 'no_code':
      return 'No active code for this number. Request a new one.';
    case 'invalid_code':
      return typeof result.attempts_remaining === 'number' && result.attempts_remaining > 0
        ? `Incorrect code. ${result.attempts_remaining} ${
            result.attempts_remaining === 1 ? 'attempt' : 'attempts'
          } left.`
        : 'Incorrect code.';
    default:
      return 'We couldn’t verify that code.';
  }
}
