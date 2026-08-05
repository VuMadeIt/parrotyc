import type { CountryCode } from 'libphonenumber-js/min';

/**
 * Per-country **mobile** national lengths for onboarding / iMessage signup.
 *
 * `max` is the typical mobile length from libphonenumber mobile examples
 * (not the inflated metadata ceiling that includes pagers / special services —
 * e.g. JP metadata goes to 17, but Japanese mobiles are 10).
 *
 * - Clamp input to `max` — you can't type past it.
 * - Continue turns blue as soon as the number is valid (usually at `max`).
 * - Red “valid phone number” label only when digit count === `max` and invalid.
 * - Countries that need more than ~10 (DE/BR/CN/AR = 11) keep that higher max.
 */
export const COUNTRY_PHONE_LENGTHS = {
  US: { min: 10, max: 10 },
  CA: { min: 10, max: 10 },
  GB: { min: 10, max: 10 },
  AU: { min: 9, max: 9 },
  JP: { min: 10, max: 10 },
  DE: { min: 11, max: 11 },
  FR: { min: 9, max: 9 },
  IN: { min: 10, max: 10 },
  BR: { min: 11, max: 11 },
  MX: { min: 10, max: 10 },
  KR: { min: 10, max: 10 },
  CN: { min: 11, max: 11 },
  IT: { min: 10, max: 10 },
  ES: { min: 9, max: 9 },
  NL: { min: 9, max: 9 },
  SE: { min: 9, max: 9 },
  NO: { min: 8, max: 8 },
  DK: { min: 8, max: 8 },
  FI: { min: 9, max: 9 },
  IE: { min: 9, max: 9 },
  NZ: { min: 9, max: 9 },
  SG: { min: 8, max: 8 },
  HK: { min: 8, max: 8 },
  TW: { min: 9, max: 9 },
  PH: { min: 10, max: 10 },
  TH: { min: 9, max: 9 },
  VN: { min: 9, max: 9 },
  ID: { min: 9, max: 9 },
  MY: { min: 9, max: 9 },
  AE: { min: 9, max: 9 },
  SA: { min: 9, max: 9 },
  IL: { min: 9, max: 9 },
  TR: { min: 10, max: 10 },
  PL: { min: 9, max: 9 },
  PT: { min: 9, max: 9 },
  CH: { min: 9, max: 9 },
  AT: { min: 9, max: 9 },
  BE: { min: 9, max: 9 },
  AR: { min: 11, max: 11 },
  CL: { min: 9, max: 9 },
  CO: { min: 10, max: 10 },
  ZA: { min: 9, max: 9 },
  NG: { min: 10, max: 10 },
  EG: { min: 10, max: 10 },
  PK: { min: 10, max: 10 },
  BD: { min: 10, max: 10 },
  RU: { min: 10, max: 10 },
  UA: { min: 9, max: 9 },
} as const satisfies Record<string, { min: number; max: number }>;

export type PhoneLengthCountry = keyof typeof COUNTRY_PHONE_LENGTHS;

const DEFAULT_MAX = 10;

export function phoneLengthFor(country: CountryCode): { min: number; max: number } {
  const entry = COUNTRY_PHONE_LENGTHS[country as PhoneLengthCountry];
  if (entry) return entry;
  return { min: 1, max: DEFAULT_MAX };
}
