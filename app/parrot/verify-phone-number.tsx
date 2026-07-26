import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
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

import { Artboard } from '@/components/parrot/artboard';
import { ContinueButton } from '@/components/parrot/continue-button';
import { ProgressHeader } from '@/components/parrot/progress-header';
import { TitleBlock } from '@/components/parrot/title-block';
import {
  CodeResentNotice,
  ResendCodeLink,
  VerificationCodeInput,
} from '@/components/parrot/verification-code';
import { ParrotArtboard, ParrotColors } from '@/constants/parrot-design';

function formatSubtitlePhone(display?: string | string[], phone?: string | string[]) {
  const value =
    (Array.isArray(display) ? display[0] : display) ||
    (Array.isArray(phone) ? phone[0] : phone);
  if (!value) return 'your phone number';
  return value;
}

export default function VerifyPhoneNumberScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scale = width / ParrotArtboard.width;
  const topOffset = useMemo(() => insets.top - 138 * scale, [insets.top, scale]);

  const params = useLocalSearchParams<{ phone?: string; display?: string; country?: string }>();
  const phoneLabel = formatSubtitlePhone(params.display, params.phone);
  const inputRef = useRef<TextInput>(null);
  const wasCompleteRef = useRef(false);

  const [code, setCode] = useState('');
  const [focused, setFocused] = useState(false);
  const [resent, setResent] = useState(false);
  const complete = code.length === 6;

  useEffect(() => {
    if (complete && !wasCompleteRef.current) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    wasCompleteRef.current = complete;
  }, [complete]);

  const handleResend = () => {
    // TODO: wire up resend code API call
    void Haptics.selectionAsync();
    setResent(true);
    inputRef.current?.focus();
  };

  const handleContinue = () => {
    if (!complete) return;
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
          <ProgressHeader onBack={() => router.back()} />
          <TitleBlock
            title="Integrate Polly into your iMessages "
            subtitle={`Enter the verification code sent to you at \n${phoneLabel}.`}
            titleTop={270}
            subtitleTop={451}
          />
          {resent ? <CodeResentNotice /> : null}
          <VerificationCodeInput
            ref={inputRef}
            code={code}
            focused={focused}
            onChangeCode={setCode}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <ResendCodeLink onPress={handleResend} />
          <ContinueButton
            left={33}
            top={967}
            enabled={complete}
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
