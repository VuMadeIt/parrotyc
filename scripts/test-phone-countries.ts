/**
 * Per-country mobile max lengths + invalid-label gating.
 * Run: npx tsx scripts/test-phone-countries.ts
 */
import { isValidPhoneNumber, validatePhoneNumberLength } from 'libphonenumber-js/min';

import { COUNTRIES } from '../constants/countries';
import { COUNTRY_PHONE_LENGTHS, phoneLengthFor } from '../constants/phone-lengths';
import {
  clampNationalDigits,
  dialCodeForCountry,
  exampleMobileDigits,
  extractDigits,
  isPhoneLengthComplete,
  isPhoneValid,
  maxNationalLength,
  sanitizePhoneInput,
  toE164,
} from '../utils/phone';

function synthesizeInvalidAtMax(iso2: (typeof COUNTRIES)[number]['iso2'], max: number): string | null {
  for (const digit of ['0', '1', '2', '9'] as const) {
    const candidate = clampNationalDigits(digit.repeat(max), iso2);
    if (candidate.length === max && !isValidPhoneNumber(candidate, iso2)) {
      return candidate;
    }
  }
  return null;
}

let failed = 0;

for (const country of COUNTRIES) {
  const issues: string[] = [];
  const { iso2, dialCode, flag, name } = country;

  if (!(iso2 in COUNTRY_PHONE_LENGTHS)) {
    issues.push('missing COUNTRY_PHONE_LENGTHS entry');
  }

  const { max } = phoneLengthFor(iso2);
  if (maxNationalLength(iso2) !== max) {
    issues.push(`maxNationalLength mismatch`);
  }

  // Sanity: no absurd special-service ceilings for mobile onboarding.
  if (max > 12) {
    issues.push(`mobile max ${max} looks like metadata ceiling, not mobile`);
  }

  if (dialCode !== dialCodeForCountry(iso2)) {
    issues.push(`dialCode ${dialCode} != ${dialCodeForCountry(iso2)}`);
  }

  const example = exampleMobileDigits(iso2) ?? '';
  if (!example || !isPhoneValid(example, iso2)) {
    issues.push(`example mobile invalid (${example || 'none'})`);
  }
  if (example && example.length !== max) {
    issues.push(`example len ${example.length} != mobile max ${max}`);
  }

  // Can't type past this country's mobile max.
  const overflow = clampNationalDigits(`${example}${'9'.repeat(20)}`, iso2);
  if (overflow.length > max) issues.push(`clamp ${overflow.length} > max ${max}`);
  if (validatePhoneNumberLength(overflow, iso2) === 'TOO_LONG') {
    issues.push('clamped value still TOO_LONG');
  }

  const sanitized = extractDigits(sanitizePhoneInput('5'.repeat(max + 10), iso2));
  if (sanitized.length > max) {
    issues.push(`sanitize allowed ${sanitized.length} > max ${max}`);
  }

  // Below max: never complete → never red.
  for (let length = 1; length < max; length += 1) {
    if (isPhoneLengthComplete('5'.repeat(length), iso2)) {
      issues.push(`length ${length}/${max} marked complete`);
      break;
    }
  }

  // Example at max: valid → blue Continue, complete for clamp purposes.
  if (example) {
    if (!isPhoneLengthComplete(example, iso2)) {
      issues.push('example not at complete/max length');
    }
    if (!isPhoneValid(example, iso2)) {
      issues.push('example not valid');
    }
  }

  // Invalid at max → red path.
  const invalid = synthesizeInvalidAtMax(iso2, max);
  if (!invalid) {
    issues.push('could not synthesize invalid max-length number');
  } else if (!isPhoneLengthComplete(invalid, iso2) || isPhoneValid(invalid, iso2)) {
    issues.push('invalid max-length gating failed');
  }

  const e164 = example ? toE164(example, iso2) : null;
  if (example && !e164?.startsWith(dialCode)) {
    issues.push(`E.164 ${e164 ?? 'null'} missing dial ${dialCode}`);
  }

  if (issues.length) {
    failed += 1;
    console.log(`FAIL ${flag} ${iso2} ${name} (max=${max})`);
    for (const issue of issues) console.log(`  - ${issue}`);
  } else {
    console.log(`PASS ${flag} ${iso2} ${dialCode} mobileMax=${max} eg=${example}`);
  }
}

console.log('---');
if (failed) {
  console.error(`FAILED ${failed}/${COUNTRIES.length} countries`);
  process.exit(1);
}
console.log(`PASSED ${COUNTRIES.length}/${COUNTRIES.length} countries`);
