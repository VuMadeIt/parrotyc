import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

import { Artboard } from '@/components/parrot/artboard';
import { ContinueButton } from '@/components/parrot/continue-button';
import { ProgressHeader } from '@/components/parrot/progress-header';
import { TitleBlock } from '@/components/parrot/title-block';
import {
  CodeStatusNotice,
  ResendCodeLink,
  VerificationCodeInput,
} from '@/components/parrot/verification-code';
import { OnboardingProgress, OnboardingProgressFrom } from '@/constants/onboarding';
import { ParrotArtboard, ParrotColors } from '@/constants/parrot-design';
import {
  describeVerifyFailure,
  resendVerificationCode,
  sendVerificationCode,
  verifyPhoneCode,
} from '@/services/verification';
import { ApiError } from '@/utils/api';

const CODE_LENGTH = 6;

type Notice = { message: string; tone: 'success' | 'error' };

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function formatSubtitlePhone(display?: string | string[], phone?: string | string[]) {
  return firstParam(display) || firstParam(phone) || 'your phone number';
}

function describeSendError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 429) {
      return 'Too many requests. Please wait a moment.';
    }
    if (error.status === 0) {
      return 'No connection to the verification server. Check that parrot-backend is running and tunneled, then try again.';
    }
    if (error.status === 422) return 'That phone number looks invalid.';
    if (error.status === 502) return 'We couldn’t deliver the code over iMessage. Please try again.';
    return error.message || 'We couldn’t send a code right now. Please try again.';
  }
  return 'We couldn’t send a code right now. Please try again.';
}

function cooldownMessage(seconds: number) {
  return `Please wait ${seconds}s before requesting another code.`;
}

export default function VerifyPhoneNumberScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scale = width / ParrotArtboard.width;
  const topOffset = useMemo(() => insets.top - 138 * scale, [insets.top, scale]);

  const params = useLocalSearchParams<{ phone?: string; display?: string; country?: string }>();
  const phone = firstParam(params.phone);
  const phoneLabel = formatSubtitlePhone(params.display, params.phone);
  const inputRef = useRef<TextInput>(null);

  const [code, setCode] = useState('');
  const [focused, setFocused] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  // Guards a duplicate send when the screen re-renders or params change identity.
  const sendRequestedFor = useRef<string | null>(null);
  // Avoids re-submitting the same six digits after a failed attempt.
  const lastAttempt = useRef<string | null>(null);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const id = setTimeout(() => setCooldownSeconds((seconds) => seconds - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldownSeconds]);

  const startCooldown = useCallback((seconds?: number | null) => {
    if (typeof seconds === 'number' && seconds > 0) {
      setCooldownSeconds(seconds);
    }
  }, []);

  useEffect(() => {
    if (!phone) {
      setNotice({ message: 'Missing phone number. Go back and re-enter it.', tone: 'error' });
      return;
    }
    if (sendRequestedFor.current === phone) return;
    sendRequestedFor.current = phone;

    let active = true;
    sendVerificationCode(phone)
      .then((result) => {
        if (!active) return;
        startCooldown(result.resend_available_in);
        if (!result.delivered) {
          setNotice({
            message: 'Code generated but not delivered — check backend logs.',
            tone: 'error',
          });
        }
      })
      .catch((error) => {
        if (!active) return;
        // A cooldown here means a code was just sent (e.g. the user navigated
        // back and forward), so the one they already have is still valid.
        if (error instanceof ApiError && error.status === 429) {
          startCooldown(error.retryAfter ?? 30);
          return;
        }
        setNotice({ message: describeSendError(error), tone: 'error' });
      });

    return () => {
      active = false;
    };
  }, [phone, startCooldown]);

  const submitCode = useCallback(
    async (value: string) => {
      if (!phone) return;
      setVerifying(true);
      try {
        const result = await verifyPhoneCode(phone, value);
        if (result.verified) {
          setVerified(true);
          setNotice(null);
          Keyboard.dismiss();
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          return;
        }
        setNotice({ message: describeVerifyFailure(result), tone: 'error' });
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setCode('');
        lastAttempt.current = null;
        inputRef.current?.focus();
      } catch (error) {
        setNotice({ message: describeSendError(error), tone: 'error' });
        lastAttempt.current = null;
      } finally {
        setVerifying(false);
      }
    },
    [phone]
  );

  const handleChangeCode = (next: string) => {
    if (verified) return;
    setCode(next);
    if (next.length < CODE_LENGTH) {
      lastAttempt.current = null;
      return;
    }
    if (lastAttempt.current === next || verifying) return;
    lastAttempt.current = next;
    void submitCode(next);
  };

  const handleResend = async () => {
    if (!phone || resending || verifying) return;
    if (cooldownSeconds > 0) {
      // Force the live wait message to show even if another notice is up.
      setNotice({ message: cooldownMessage(cooldownSeconds), tone: 'error' });
      void Haptics.selectionAsync();
      return;
    }
    void Haptics.selectionAsync();
    setResending(true);
    setNotice({ message: 'Sending a new code…', tone: 'success' });
    try {
      const result = await resendVerificationCode(phone);
      setNotice({ message: 'A new code has been sent to you. ', tone: 'success' });
      startCooldown(result.resend_available_in);
      setCode('');
      setVerified(false);
      lastAttempt.current = null;
      inputRef.current?.focus();
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        startCooldown(error.retryAfter ?? 30);
        setNotice({
          message: cooldownMessage(error.retryAfter ?? 30),
          tone: 'error',
        });
      } else {
        setNotice({ message: describeSendError(error), tone: 'error' });
      }
    } finally {
      setResending(false);
    }
  };

  const displayedNotice: Notice | null =
    notice ??
    (cooldownSeconds > 0
      ? { message: cooldownMessage(cooldownSeconds), tone: 'error' }
      : null);

  const handleContinue = () => {
    if (!verified) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Keyboard.dismiss();
    router.dismissAll();
  };

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Artboard anchor="top" topOffset={topOffset}>
          <Pressable style={StyleSheet.absoluteFill} onPress={Keyboard.dismiss} />
          <ProgressHeader
            progress={OnboardingProgress.verify}
            from={OnboardingProgressFrom.verify}
            onBack={() => router.back()}
          />
          <TitleBlock
            title="Integrate Polly into your iMessages "
            subtitle={`Enter the verification code sent to you at \n${phoneLabel}.`}
            titleTop={270}
            subtitleTop={451}
          />
          {displayedNotice ? (
            <CodeStatusNotice message={displayedNotice.message} tone={displayedNotice.tone} />
          ) : null}
          <VerificationCodeInput
            ref={inputRef}
            code={code}
            focused={focused}
            onChangeCode={handleChangeCode}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <ResendCodeLink onPress={handleResend} />
          <ContinueButton
            left={33}
            top={967}
            enabled={verified}
            onPress={handleContinue}
          />
        </Artboard>
      </KeyboardAvoidingView>
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
