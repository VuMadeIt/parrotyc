import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { parsePhoneNumberFromString } from 'libphonenumber-js/min';

import { Artboard } from '@/components/parrot/artboard';
import { ContinueButton } from '@/components/parrot/continue-button';
import { CountryPicker } from '@/components/parrot/country-picker';
import { PhoneNumberField } from '@/components/parrot/phone-number-field';
import { ProgressHeader } from '@/components/parrot/progress-header';
import { TitleBlock } from '@/components/parrot/title-block';
import { DEFAULT_COUNTRY, findCountry, type Country } from '@/constants/countries';
import { OnboardingProgress, OnboardingProgressFrom } from '@/constants/onboarding';
import { ParrotArtboard, ParrotColors } from '@/constants/parrot-design';
import {
  clampNationalDigits,
  extractDigits,
  formatNationalNumber,
  isPhoneLengthComplete,
  isPhoneValid,
  sanitizePhoneInput,
  toE164,
} from '@/utils/phone';

export default function InputPhoneNumberScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scale = width / ParrotArtboard.width;
  const topOffset = useMemo(() => insets.top - 138 * scale, [insets.top, scale]);

  const inputRef = useRef<TextInput>(null);
  const wasValidRef = useRef(false);

  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState('');
  const [focused, setFocused] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const isValid = useMemo(() => isPhoneValid(phone, country.iso2), [phone, country.iso2]);
  // Red label ONLY at this country's max digit count (never mid-entry).
  const isAtMaxLength = useMemo(
    () => isPhoneLengthComplete(phone, country.iso2),
    [phone, country.iso2]
  );
  const showInvalidMessage = isAtMaxLength && !isValid;

  useEffect(() => {
    if (isValid && !wasValidRef.current) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    wasValidRef.current = isValid;
  }, [isValid]);

  const handleChangeText = (text: string) => {
    if (text.trim().startsWith('+')) {
      const parsed = parsePhoneNumberFromString(text.trim());
      if (parsed?.country) {
        const matched = findCountry(parsed.country);
        const nationalDigits = clampNationalDigits(
          extractDigits(String(parsed.nationalNumber)),
          matched.iso2
        );
        setCountry(matched);
        setPhone(formatNationalNumber(nationalDigits, matched.iso2));
        return;
      }
    }

    const currentDigits = extractDigits(phone);
    let nextDigits = extractDigits(text);

    // Native TextInput deletes formatting characters before digits. When that
    // happens, remove the preceding digit too so backspace never gets stuck on
    // "(", ")", spaces, or dashes.
    if (text.length < phone.length && nextDigits.length === currentDigits.length) {
      nextDigits = currentDigits.slice(0, -1);
    }

    setPhone(sanitizePhoneInput(nextDigits, country.iso2));
  };

  const handleSelectCountry = (next: Country) => {
    const digits = clampNationalDigits(extractDigits(phone), next.iso2);
    setCountry(next);
    setPhone(formatNationalNumber(digits, next.iso2));
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleContinue = () => {
    if (!isValid) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const e164 = toE164(phone, country.iso2) ?? phone;
    Keyboard.dismiss();
    router.push({
      pathname: '/parrot/verify-phone-number',
      params: {
        phone: e164,
        display: phone,
        country: country.iso2,
      },
    });
  };

  const handleDisabledContinue = () => {
    // Only surface the invalid label once they've hit this country's max length.
    if (isAtMaxLength && !isValid) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      void Haptics.selectionAsync();
    }
  };

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Artboard anchor="top" topOffset={topOffset}>
          {/* Behind content — dismisses keyboard without intercepting field/button presses */}
          <Pressable style={StyleSheet.absoluteFill} onPress={Keyboard.dismiss} />

          <ProgressHeader
            progress={OnboardingProgress.phone}
            from={OnboardingProgressFrom.phone}
            onBack={() => router.back()}
          />
          <TitleBlock
            title="Integrate Polly into your iMessages "
            subtitle="Enter your phone number for personalized conversations via iMessage!"
            titleTop={277}
            subtitleTop={458}
          />
          <PhoneNumberField
            ref={inputRef}
            country={country}
            value={phone}
            focused={focused}
            errorMessage={
              showInvalidMessage ? 'Please enter a valid phone number' : undefined
            }
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChangeText={handleChangeText}
            onPressCountry={() => {
              Keyboard.dismiss();
              setPickerOpen(true);
            }}
          />
          <ContinueButton
            left={32}
            top={959}
            enabled={isValid}
            onPress={handleContinue}
            onDisabledPress={handleDisabledContinue}
          />
        </Artboard>
      </KeyboardAvoidingView>

      <CountryPicker
        visible={pickerOpen}
        selectedIso2={country.iso2}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelectCountry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ParrotColors.background,
  },
  flex: {
    flex: 1,
  },
});
