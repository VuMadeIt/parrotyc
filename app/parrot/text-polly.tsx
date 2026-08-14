import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Artboard } from '@/components/parrot/artboard';
import { ContinueButton } from '@/components/parrot/continue-button';
import { ProgressHeader } from '@/components/parrot/progress-header';
import { TitleBlock } from '@/components/parrot/title-block';
import { OnboardingProgress, OnboardingProgressFrom } from '@/constants/onboarding';
import { lineHeightFor, ParrotArtboard, ParrotColors, ParrotFonts } from '@/constants/parrot-design';

const POLLY_NUMBER = '+17724539101';
const POLLY_NUMBER_DISPLAY = '+1 (772) 453-9101';
const SAMPLE_MESSAGE = 'Hi Polly — this is me. Activate my iMessage.';

function imessageComposeUrl(e164: string, body: string) {
  return `sms:${e164}&body=${encodeURIComponent(body)}`;
}

/** Figma 37:8 — Text Polly — Open iMessage. */
export default function TextPollyScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scale = width / ParrotArtboard.width;
  const topOffset = useMemo(() => insets.top - 138 * scale, [insets.top, scale]);
  const [error, setError] = useState<string | null>(null);

  const handleOpenIMessage = async () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);
    const url = imessageComposeUrl(POLLY_NUMBER, SAMPLE_MESSAGE);
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        setError('Messages isn’t available on this device.');
        return;
      }
      await Linking.openURL(url);
    } catch {
      setError(`Couldn’t open Messages. Text Polly at ${POLLY_NUMBER_DISPLAY}.`);
    }
  };

  const handleLater = () => {
    void Haptics.selectionAsync();
    router.dismissAll();
  };

  return (
    <View style={styles.root}>
      <Artboard anchor="top" topOffset={topOffset}>
        <ProgressHeader
          progress={OnboardingProgress.imessage}
          from={OnboardingProgressFrom.imessage}
          onBack={() => router.back()}
        />
        <TitleBlock
          title={'Text this number\nto activate Polly'}
          subtitle="Send a first iMessage to Polly’s number to speak"
          titleTop={270}
          subtitleTop={451}
        />

        <View style={styles.card}>
          <Text style={styles.cardLabel}>POLLY NUMBER</Text>
          <Text style={styles.number}>{POLLY_NUMBER_DISPLAY}</Text>

          <View style={styles.thoughtBubble}>
            <Text style={styles.thoughtText}>
              Would you like to learn how to order a coffee in Spanish?
            </Text>
          </View>
          <View style={styles.thoughtDotNear} />
          <View style={styles.thoughtDotFar} />
          <Image
            source={require('@/assets/images/parrot/polly-mascot.png')}
            style={styles.mascot}
            contentFit="contain"
          />
        </View>

        <ContinueButton
          left={33}
          top={1478}
          enabled
          label="Open iMessage"
          onPress={() => void handleOpenIMessage()}
        />
        <Pressable
          style={styles.skip}
          onPress={handleLater}
          accessibilityRole="link"
          accessibilityLabel="I’ll do this later">
          <Text style={styles.skipLabel}>I’ll do this later</Text>
        </Pressable>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </Artboard>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ParrotColors.background,
  },
  card: {
    position: 'absolute',
    left: 47,
    top: 562,
    width: 736,
    height: 676,
    borderRadius: 32,
    backgroundColor: ParrotColors.cardBackground,
    borderWidth: 1,
    borderColor: ParrotColors.fieldBorder,
  },
  cardLabel: {
    position: 'absolute',
    left: 36,
    top: 36,
    width: 664,
    fontFamily: ParrotFonts.semiBold,
    fontSize: 22,
    lineHeight: lineHeightFor(22),
    letterSpacing: -0.88,
    color: ParrotColors.disabledLabel,
  },
  number: {
    position: 'absolute',
    left: 36,
    top: 85,
    width: 664,
    fontFamily: ParrotFonts.bold,
    fontSize: 40,
    lineHeight: lineHeightFor(40),
    letterSpacing: -2,
    color: ParrotColors.title,
  },
  thoughtBubble: {
    position: 'absolute',
    left: 274,
    top: 155,
    width: 409,
    height: 115,
    borderRadius: 20,
    backgroundColor: ParrotColors.cardBackground,
    borderWidth: 1,
    borderColor: ParrotColors.fieldBorder,
    paddingLeft: 38,
    paddingRight: 50,
    paddingTop: 29,
  },
  thoughtText: {
    fontFamily: ParrotFonts.semiBold,
    fontSize: 24,
    lineHeight: lineHeightFor(24),
    letterSpacing: -0.768,
    color: ParrotColors.title,
  },
  thoughtDotNear: {
    position: 'absolute',
    left: 260,
    top: 282,
    width: 30,
    height: 29,
    borderRadius: 10,
    backgroundColor: ParrotColors.cardBackground,
    borderWidth: 1,
    borderColor: ParrotColors.fieldBorder,
  },
  thoughtDotFar: {
    position: 'absolute',
    left: 244,
    top: 322,
    width: 30,
    height: 29,
    borderRadius: 10,
    backgroundColor: ParrotColors.cardBackground,
    borderWidth: 1,
    borderColor: ParrotColors.fieldBorder,
  },
  mascot: {
    position: 'absolute',
    left: 36,
    top: 349,
    width: 217,
    height: 278,
  },
  skip: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 1622,
    alignItems: 'center',
    zIndex: 21,
  },
  skipLabel: {
    fontFamily: ParrotFonts.semiBold,
    fontSize: 24,
    lineHeight: lineHeightFor(24),
    letterSpacing: -1.44,
    color: ParrotColors.subtitle,
    textDecorationLine: 'underline',
  },
  error: {
    position: 'absolute',
    left: 47,
    top: 1680,
    width: 736,
    fontFamily: ParrotFonts.semiBold,
    fontSize: 22,
    lineHeight: lineHeightFor(22),
    color: ParrotColors.error,
    textAlign: 'center',
  },
});
