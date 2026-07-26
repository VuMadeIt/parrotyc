import type { CountryCode } from 'libphonenumber-js/min';

export type Country = {
  iso2: CountryCode;
  name: string;
  abbreviation: string;
  dialCode: string;
  flag: string;
};

/** Common countries first, then alphabetical — enough coverage for onboarding. */
export const COUNTRIES: Country[] = [
  { iso2: 'US', name: 'United States', abbreviation: 'USA', dialCode: '+1', flag: '🇺🇸' },
  { iso2: 'CA', name: 'Canada', abbreviation: 'CAN', dialCode: '+1', flag: '🇨🇦' },
  { iso2: 'GB', name: 'United Kingdom', abbreviation: 'GBR', dialCode: '+44', flag: '🇬🇧' },
  { iso2: 'AU', name: 'Australia', abbreviation: 'AUS', dialCode: '+61', flag: '🇦🇺' },
  { iso2: 'JP', name: 'Japan', abbreviation: 'JPN', dialCode: '+81', flag: '🇯🇵' },
  { iso2: 'DE', name: 'Germany', abbreviation: 'DEU', dialCode: '+49', flag: '🇩🇪' },
  { iso2: 'FR', name: 'France', abbreviation: 'FRA', dialCode: '+33', flag: '🇫🇷' },
  { iso2: 'IN', name: 'India', abbreviation: 'IND', dialCode: '+91', flag: '🇮🇳' },
  { iso2: 'BR', name: 'Brazil', abbreviation: 'BRA', dialCode: '+55', flag: '🇧🇷' },
  { iso2: 'MX', name: 'Mexico', abbreviation: 'MEX', dialCode: '+52', flag: '🇲🇽' },
  { iso2: 'KR', name: 'South Korea', abbreviation: 'KOR', dialCode: '+82', flag: '🇰🇷' },
  { iso2: 'CN', name: 'China', abbreviation: 'CHN', dialCode: '+86', flag: '🇨🇳' },
  { iso2: 'IT', name: 'Italy', abbreviation: 'ITA', dialCode: '+39', flag: '🇮🇹' },
  { iso2: 'ES', name: 'Spain', abbreviation: 'ESP', dialCode: '+34', flag: '🇪🇸' },
  { iso2: 'NL', name: 'Netherlands', abbreviation: 'NLD', dialCode: '+31', flag: '🇳🇱' },
  { iso2: 'SE', name: 'Sweden', abbreviation: 'SWE', dialCode: '+46', flag: '🇸🇪' },
  { iso2: 'NO', name: 'Norway', abbreviation: 'NOR', dialCode: '+47', flag: '🇳🇴' },
  { iso2: 'DK', name: 'Denmark', abbreviation: 'DNK', dialCode: '+45', flag: '🇩🇰' },
  { iso2: 'FI', name: 'Finland', abbreviation: 'FIN', dialCode: '+358', flag: '🇫🇮' },
  { iso2: 'IE', name: 'Ireland', abbreviation: 'IRL', dialCode: '+353', flag: '🇮🇪' },
  { iso2: 'NZ', name: 'New Zealand', abbreviation: 'NZL', dialCode: '+64', flag: '🇳🇿' },
  { iso2: 'SG', name: 'Singapore', abbreviation: 'SGP', dialCode: '+65', flag: '🇸🇬' },
  { iso2: 'HK', name: 'Hong Kong', abbreviation: 'HKG', dialCode: '+852', flag: '🇭🇰' },
  { iso2: 'TW', name: 'Taiwan', abbreviation: 'TWN', dialCode: '+886', flag: '🇹🇼' },
  { iso2: 'PH', name: 'Philippines', abbreviation: 'PHL', dialCode: '+63', flag: '🇵🇭' },
  { iso2: 'TH', name: 'Thailand', abbreviation: 'THA', dialCode: '+66', flag: '🇹🇭' },
  { iso2: 'VN', name: 'Vietnam', abbreviation: 'VNM', dialCode: '+84', flag: '🇻🇳' },
  { iso2: 'ID', name: 'Indonesia', abbreviation: 'IDN', dialCode: '+62', flag: '🇮🇩' },
  { iso2: 'MY', name: 'Malaysia', abbreviation: 'MYS', dialCode: '+60', flag: '🇲🇾' },
  { iso2: 'AE', name: 'United Arab Emirates', abbreviation: 'ARE', dialCode: '+971', flag: '🇦🇪' },
  { iso2: 'SA', name: 'Saudi Arabia', abbreviation: 'SAU', dialCode: '+966', flag: '🇸🇦' },
  { iso2: 'IL', name: 'Israel', abbreviation: 'ISR', dialCode: '+972', flag: '🇮🇱' },
  { iso2: 'TR', name: 'Turkey', abbreviation: 'TUR', dialCode: '+90', flag: '🇹🇷' },
  { iso2: 'PL', name: 'Poland', abbreviation: 'POL', dialCode: '+48', flag: '🇵🇱' },
  { iso2: 'PT', name: 'Portugal', abbreviation: 'PRT', dialCode: '+351', flag: '🇵🇹' },
  { iso2: 'CH', name: 'Switzerland', abbreviation: 'CHE', dialCode: '+41', flag: '🇨🇭' },
  { iso2: 'AT', name: 'Austria', abbreviation: 'AUT', dialCode: '+43', flag: '🇦🇹' },
  { iso2: 'BE', name: 'Belgium', abbreviation: 'BEL', dialCode: '+32', flag: '🇧🇪' },
  { iso2: 'AR', name: 'Argentina', abbreviation: 'ARG', dialCode: '+54', flag: '🇦🇷' },
  { iso2: 'CL', name: 'Chile', abbreviation: 'CHL', dialCode: '+56', flag: '🇨🇱' },
  { iso2: 'CO', name: 'Colombia', abbreviation: 'COL', dialCode: '+57', flag: '🇨🇴' },
  { iso2: 'ZA', name: 'South Africa', abbreviation: 'ZAF', dialCode: '+27', flag: '🇿🇦' },
  { iso2: 'NG', name: 'Nigeria', abbreviation: 'NGA', dialCode: '+234', flag: '🇳🇬' },
  { iso2: 'EG', name: 'Egypt', abbreviation: 'EGY', dialCode: '+20', flag: '🇪🇬' },
  { iso2: 'PK', name: 'Pakistan', abbreviation: 'PAK', dialCode: '+92', flag: '🇵🇰' },
  { iso2: 'BD', name: 'Bangladesh', abbreviation: 'BGD', dialCode: '+880', flag: '🇧🇩' },
  { iso2: 'RU', name: 'Russia', abbreviation: 'RUS', dialCode: '+7', flag: '🇷🇺' },
  { iso2: 'UA', name: 'Ukraine', abbreviation: 'UKR', dialCode: '+380', flag: '🇺🇦' },
];

export const DEFAULT_COUNTRY = COUNTRIES[0];

export function findCountry(iso2: CountryCode): Country {
  return COUNTRIES.find((c) => c.iso2 === iso2) ?? DEFAULT_COUNTRY;
}
