import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Artboard } from '@/components/parrot/artboard';
import { ContinueButton } from '@/components/parrot/continue-button';
import { ProgressHeader } from '@/components/parrot/progress-header';
import { TitleBlock } from '@/components/parrot/title-block';
import { OnboardingProgress, OnboardingProgressFrom } from '@/constants/onboarding';
import { lineHeightFor, ParrotArtboard, ParrotColors, ParrotFonts } from '@/constants/parrot-design';

/** Figma 37:8 — Text Polly — Open iMessage. Visual only. */
export default function TextPollyScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scale = width / ParrotArtboard.width;
  const topOffset = useMemo(() => insets.top - 138 * scale, [insets.top, scale]);

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
          subtitle="Send a first iMessage to Polly’s number so your texts map to you — not a shared test profile."
          titleTop={270}
          subtitleTop={451}
        />

        <View style={styles.card}>
          <Text style={styles.cardLabel}>POLLY NUMBER</Text>
          <Text style={styles.number}>+1 (772) 453-9101</Text>
          <Text style={[styles.cardLabel, styles.sampleLabel]}>SAMPLE FIRST MESSAGE</Text>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>Hi Polly — this is me. Activate my iMessage.</Text>
          </View>
          <Text style={styles.hint}>Opens Messages with this text already filled in.</Text>
        </View>

        <ContinueButton left={33} top={1478} enabled label="Open iMessage" />
        <Text style={styles.skipLabel}>I’ll do this later</Text>
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
    top: 620,
    width: 736,
    borderRadius: 32,
    backgroundColor: ParrotColors.sampleCard,
    paddingHorizontal: 36,
    paddingVertical: 36,
  },
  cardLabel: {
    fontFamily: ParrotFonts.semiBold,
    fontSize: 22,
    lineHeight: lineHeightFor(22),
    letterSpacing: -0.88,
    color: ParrotColors.disabledLabel,
  },
  number: {
    marginTop: 8,
    fontFamily: ParrotFonts.bold,
    fontSize: 40,
    lineHeight: lineHeightFor(40),
    letterSpacing: -2,
    color: ParrotColors.title,
  },
  sampleLabel: {
    marginTop: 22,
  },
  bubble: {
    marginTop: 14,
    alignSelf: 'flex-start',
    maxWidth: 620,
    backgroundColor: ParrotColors.primary,
    borderRadius: 28,
    borderBottomRightRadius: 8,
    paddingHorizontal: 28,
    paddingVertical: 22,
  },
  bubbleText: {
    fontFamily: ParrotFonts.semiBold,
    fontSize: 28,
    lineHeight: lineHeightFor(28),
    letterSpacing: -0.84,
    color: ParrotColors.primaryLabel,
  },
  hint: {
    marginTop: 18,
    fontFamily: ParrotFonts.semiBold,
    fontSize: 24,
    lineHeight: lineHeightFor(24),
    letterSpacing: -0.96,
    color: ParrotColors.subtitle,
  },
  skipLabel: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 1622,
    textAlign: 'center',
    fontFamily: ParrotFonts.semiBold,
    fontSize: 24,
    lineHeight: lineHeightFor(24),
    letterSpacing: -1.44,
    color: ParrotColors.subtitle,
    textDecorationLine: 'underline',
  },
});
