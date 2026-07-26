import {
  AsYouType,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
} from 'libphonenumber-js/min';
import type { CountryCode } from 'libphonenumber-js/min';

/** Digits only — used when switching countries so formatting can be reapplied. */
export function extractDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Drop trailing digits until libphonenumber no longer reports TOO_LONG for this
 * country. Used both while typing and when pasting oversized numbers.
 */
export function clampNationalDigits(digits: string, country: CountryCode): string {
  let next = digits;
  while (next.length > 0 && validatePhoneNumberLength(next, country) === 'TOO_LONG') {
    next = next.slice(0, -1);
  }
  return next;
}

export function formatNationalNumber(digits: string, country: CountryCode): string {
  const clamped = clampNationalDigits(digits, country);
  if (!clamped) return '';
  const formatter = new AsYouType(country);
  return formatter.input(clamped);
}

/**
 * Normalize raw TextInput text into a national formatted string for `country`,
 * enforcing per-country max length (extra keystrokes / oversized pastes are dropped).
 */
export function sanitizePhoneInput(text: string, country: CountryCode): string {
  return formatNationalNumber(extractDigits(text), country);
}

export function isPhoneValid(nationalOrFormatted: string, country: CountryCode): boolean {
  if (!nationalOrFormatted?.trim()) return false;

  const parsed = parsePhoneNumberFromString(nationalOrFormatted, country);
  if (parsed?.isValid()) return true;

  const digits = extractDigits(nationalOrFormatted);
  if (!digits) return false;

  if (isValidPhoneNumber(digits, country)) return true;
  if (isValidPhoneNumber(nationalOrFormatted, country)) return true;

  // AsYouType.isValid() mirrors what the user currently sees formatted.
  const formatter = new AsYouType(country);
  formatter.input(digits);
  return formatter.isValid();
}

export function toE164(nationalOrFormatted: string, country: CountryCode): string | null {
  const parsed = parsePhoneNumberFromString(nationalOrFormatted, country);
  if (!parsed || !parsed.isValid()) return null;
  return parsed.format('E.164');
}

export function formatForDisplay(nationalOrFormatted: string, country: CountryCode): string {
  const parsed = parsePhoneNumberFromString(nationalOrFormatted, country);
  if (parsed?.isValid()) return parsed.formatNational();
  return formatNationalNumber(extractDigits(nationalOrFormatted), country);
}
