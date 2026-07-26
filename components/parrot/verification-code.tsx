import { Image } from 'expo-image';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { lineHeightFor, ParrotColors, ParrotFonts } from '@/constants/parrot-design';

const BOX_LEFTS = [52, 177, 302, 427, 552, 677];

type VerificationCodeInputProps = {
  code: string;
  focused: boolean;
  onChangeCode: (code: string) => void;
  onFocus: () => void;
  onBlur: () => void;
};

/**
 * A single native TextInput drives six visual boxes. This keeps iOS one-time
 * code autofill and native deletion semantics while presenting the split OTP UI.
 */
export const VerificationCodeInput = forwardRef<TextInput, VerificationCodeInputProps>(
  function VerificationCodeInput(
    { code, focused, onChangeCode, onFocus, onBlur },
    ref
  ) {
    const inputRef = useRef<TextInput>(null);
    useImperativeHandle(ref, () => inputRef.current as TextInput);

    const activeIndex = Math.min(code.length, 5);

    const focusInput = () => {
      inputRef.current?.focus();
    };

    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {BOX_LEFTS.map((left, index) => (
          <Pressable
            key={left}
            style={[
              styles.box,
              { left },
              focused && index === activeIndex ? styles.boxFocused : null,
            ]}
            onPress={focusInput}
            accessibilityRole="button"
            accessibilityLabel={`Verification digit ${index + 1}`}>
            <Text style={styles.digit}>{code[index] ?? ''}</Text>
          </Pressable>
        ))}

        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={(value) => onChangeCode(value.replace(/\D/g, '').slice(0, 6))}
          onFocus={onFocus}
          onBlur={onBlur}
          keyboardType="number-pad"
          inputMode="numeric"
          maxLength={6}
          textContentType="oneTimeCode"
          autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
          caretHidden
          contextMenuHidden={false}
          selectTextOnFocus={false}
          style={styles.nativeInput}
          accessibilityLabel="Six digit verification code"
        />
      </View>
    );
  }
);

export function ResendCodeLink({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable style={styles.resend} hitSlop={20} onPress={onPress}>
      <Text style={styles.resendLabel}>Didn&rsquo;t receive a code?</Text>
    </Pressable>
  );
}

export function CodeResentNotice() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Image
        source={require('@/assets/images/parrot/success-check.png')}
        style={styles.successIcon}
        contentFit="contain"
      />
      <Text style={styles.successLabel}>A new code has been sent to you. </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    top: 710,
    width: 100,
    height: 125,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ParrotColors.fieldBorder,
    backgroundColor: ParrotColors.fieldBackground,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  boxFocused: {
    borderWidth: 2,
    borderColor: ParrotColors.focusBorder,
  },
  digit: {
    fontFamily: ParrotFonts.semiBold,
    fontSize: 48,
    lineHeight: lineHeightFor(48),
    color: ParrotColors.title,
  },
  nativeInput: {
    position: 'absolute',
    left: 52,
    top: 710,
    width: 725,
    height: 125,
    opacity: 0.02,
    color: 'transparent',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  resend: {
    position: 'absolute',
    left: 301,
    top: 853,
    width: 228,
    zIndex: 3,
  },
  resendLabel: {
    fontFamily: ParrotFonts.semiBold,
    fontSize: 24,
    lineHeight: lineHeightFor(24),
    letterSpacing: -1.44,
    color: ParrotColors.subtitle,
    textDecorationLine: 'underline',
  },
  successIcon: {
    position: 'absolute',
    left: 55,
    top: 668,
    width: 20,
    height: 20,
  },
  successLabel: {
    position: 'absolute',
    left: 79,
    top: 663,
    width: 376,
    fontFamily: ParrotFonts.semiBold,
    fontSize: 24,
    lineHeight: lineHeightFor(24),
    letterSpacing: -0.768,
    color: ParrotColors.title,
  },
});
