/**
 * Tokens taken from the Parrot Figma file (830 x 1800 artboard).
 * Screens are laid out in raw artboard coordinates and scaled as a whole,
 * so every value here is in design pixels.
 */

export const ParrotArtboard = {
  width: 830,
  height: 1800,
} as const;

export const ParrotColors = {
  background: '#fafafa',
  title: '#000000',
  subtitle: '#353535',
  progressTrack: '#d9d9d9',
  progressFill: '#2c92ff',
  progressHighlight: '#7fd7ff',
  fieldBackground: '#ffffff',
  fieldBorder: '#e0e0e0',
  placeholder: '#50555c',
  primary: '#2C92FF',
  primaryLabel: '#FFFFFF',
  /** Figma disabled fill: rgba(225,225,225,0.9) on #FAFAFA */
  disabled: '#E1E1E1',
  disabledLabel: '#898A8D',
  focusBorder: '#2C92FF',
  /** Not in the Figma file — needed for verification failure messages. */
  error: '#D93025',
} as const;

export const ParrotFonts = {
  bold: 'Inter_700Bold',
  semiBold: 'Inter_600SemiBold',
  medium: 'Inter_500Medium',
} as const;

/** Figma renders `line-height: normal` for Inter at roughly 1.21x the font size. */
export const lineHeightFor = (fontSize: number) => Math.round(fontSize * 1.21);
