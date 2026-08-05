import {
  AsYouType,
  getCountryCallingCode,
  getExampleNumber,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
} from 'libphonenumber-js/min';
import type { CountryCode } from 'libphonenumber-js/min';
import examples from 'libphonenumber-js/mobile/examples';

import { phoneLengthFor } from '@/constants/phone-lengths';

/** Digits only — used when switching countries so formatting can be reapplied. */
export function extractDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** Hard national-digit ceiling for this country (unique per ISO country). */
export function maxNationalLength(country: CountryCode): number {
  return phoneLengthFor(country).max;
}

/**
 * Drop digits past this country's max national length. Never rely only on
 * TOO_LONG — some digit patterns return INVALID_COUNTRY and would not clamp.
 */
export function clampNationalDigits(digits: string, country: CountryCode): string {
  const max = maxNationalLength(country);
  let next = digits.length > max ? digits.slice(0, max) : digits;
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
 * enforcing that country's max length (extra keystrokes / pastes are dropped).
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

  const formatter = new AsYouType(country);
  formatter.input(digits);
  return formatter.isValid();
}

/**
 * True only when the user has typed this country's full mobile max
 * (see COUNTRY_PHONE_LENGTHS). Mid-entry must never count as complete.
 */
export function isPhoneLengthComplete(
  nationalOrFormatted: string,
  country: CountryCode
): boolean {
  const digits = extractDigits(nationalOrFormatted);
  if (!digits) return false;
  return digits.length >= maxNationalLength(country);
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

/** Dial code string like "+44" from libphonenumber — keeps COUNTRIES in sync. */
export function dialCodeForCountry(country: CountryCode): string {
  return `+${getCountryCallingCode(country)}`;
}

/** Example mobile national digits for tests / diagnostics. */
export function exampleMobileDigits(country: CountryCode): string | null {
  try {
    return getExampleNumber(country, examples)?.nationalNumber ?? null;
  } catch {
    return null;
  }
}
