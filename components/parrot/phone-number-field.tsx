import { forwardRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { Country } from '@/constants/countries';
import { lineHeightFor, ParrotColors, ParrotFonts } from '@/constants/parrot-design';

type PhoneNumberFieldProps = {
  country: Country;
  value: string;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onChangeText: (text: string) => void;
  onPressCountry: () => void;
  /** Replaces the field label — used for “enter a valid number” feedback. */
  errorMessage?: string;
};

/**
 * Interactive phone field laid out in raw Figma coordinates from node 14:373
 * (label @ 62,660 · field @ 62,710 · 706×125 · radius 10).
 */
export const PhoneNumberField = forwardRef<TextInput, PhoneNumberFieldProps>(
  function PhoneNumberField(
    {
      country,
      value,
      focused,
      onFocus,
      onBlur,
      onChangeText,
      onPressCountry,
      errorMessage,
    },
    ref
  ) {
    const showError = Boolean(errorMessage);

    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <Text style={[styles.label, showError ? styles.labelError : null]}>
          {errorMessage ?? 'What\u2019s your phone number?'}
        </Text>

        <View
          style={[
            styles.field,
            {
              borderColor: showError
                ? ParrotColors.error
                : focused
                  ? ParrotColors.primary
                  : ParrotColors.fieldBorder,
              borderWidth: focused || showError ? 2 : 1,
            },
          ]}>
          <Pressable
            style={styles.countryHit}
            onPress={onPressCountry}
            accessibilityRole="button"
            accessibilityLabel={`Country ${country.name}, ${country.dialCode}. Tap to change.`}>
            <Text style={styles.flagEmoji}>{country.flag}</Text>
            <Text style={styles.countryCode} numberOfLines={1}>
              {country.abbreviation} {country.dialCode}
            </Text>
          </Pressable>

          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder="Mobile Number"
            placeholderTextColor={ParrotColors.placeholder}
            keyboardType="number-pad"
            inputMode="numeric"
            textContentType="telephoneNumber"
            autoComplete="tel"
            importantForAutofill="yes"
            style={styles.input}
            accessibilityLabel="Mobile number"
          />
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  label: {
    position: 'absolute',
    left: 62,
    top: 660,
    width: 685,
    fontFamily: ParrotFonts.semiBold,
    fontSize: 24,
    lineHeight: lineHeightFor(24),
    letterSpacing: -0.768,
    color: ParrotColors.title,
  },
  labelError: {
    color: ParrotColors.error,
  },
  field: {
    position: 'absolute',
    left: 62,
    top: 710,
    width: 706,
    height: 125,
    borderRadius: 10,
    backgroundColor: ParrotColors.fieldBackground,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 16,
  },
  countryHit: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    maxWidth: '46%',
    gap: 8,
    paddingRight: 12,
  },
  flagEmoji: {
    fontSize: 48,
    width: 64,
    textAlign: 'center',
  },
  countryCode: {
    fontFamily: ParrotFonts.medium,
    fontSize: 32,
    lineHeight: lineHeightFor(32),
    letterSpacing: -1.024,
    color: ParrotColors.title,
    flexShrink: 1,
  },
  input: {
    flex: 1,
    fontFamily: ParrotFonts.medium,
    fontSize: 32,
    lineHeight: lineHeightFor(32),
    letterSpacing: -1.024,
    color: ParrotColors.title,
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
