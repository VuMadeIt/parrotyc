import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Artboard } from '@/components/parrot/artboard';
import { ContinueButton } from '@/components/parrot/continue-button';
import { lineHeightFor, ParrotArtboard, ParrotColors, ParrotFonts } from '@/constants/parrot-design';

/**
 * Landing screen — bird + wordmark from the live Parrot assets, rating badge,
 * and the two CTAs. No decorative cloud layer.
 */
export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scale = width / ParrotArtboard.width;
  const topOffset = useMemo(() => insets.top - 40 * scale, [insets.top, scale]);

  const handleGetStarted = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/parrot/select-language');
  };

  const handleExistingAccount = () => {
    void Haptics.selectionAsync();
    // Login currently reuses the phone verification flow.
    router.push('/parrot/input-phone-number');
  };

  return (
    <View style={styles.root}>
      <Artboard
        anchor="top"
        topOffset={topOffset}
        backgroundColor={ParrotColors.welcomeBackground}>
        <Image
          source={require('@/assets/images/parrot/parrot-bird.png')}
          style={styles.mascot}
          contentFit="contain"
        />
        <Image
          source={require('@/assets/images/parrot/parrot-wordmark.png')}
          style={styles.wordmark}
          contentFit="contain"
        />

        <Text style={styles.headline}>
          Done with Duolingo?{'\n'}Start speaking real Español.
        </Text>

        <View style={styles.ratingBadgeWrap}>
          <View style={styles.ratingBadge}>
            <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
            <Text style={styles.ratingScore}>4.9</Text>
            <Text style={styles.ratingDot}>•</Text>
            <Text style={styles.ratingLabel}>App Store Rating</Text>
          </View>
        </View>

        <ContinueButton
          left={32}
          top={1420}
          enabled
          label="Get started"
          onPress={handleGetStarted}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="I already have an account"
          hitSlop={24}
          onPress={handleExistingAccount}
          style={({ pressed }) => [
            styles.secondaryHit,
            pressed ? styles.secondaryPressed : null,
          ]}>
          <Text style={styles.secondaryLabel}>I already have an account</Text>
        </Pressable>
      </Artboard>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ParrotColors.welcomeBackground,
  },
  mascot: {
    position: 'absolute',
    left: 265,
    top: 220,
    width: 300,
    height: 300,
  },
  wordmark: {
    position: 'absolute',
    left: 145,
    top: 530,
    width: 540,
    height: 155,
  },
  headline: {
    position: 'absolute',
    left: 80,
    top: 740,
    width: 670,
    textAlign: 'center',
    fontFamily: ParrotFonts.semiBold,
    fontSize: 42,
    lineHeight: lineHeightFor(42),
    letterSpacing: -1.4,
    color: ParrotColors.title,
  },
  ratingBadgeWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 920,
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: 'rgba(236, 246, 255, 0.85)',
  },
  stars: {
    fontSize: 22,
    letterSpacing: -2,
  },
  ratingScore: {
    marginLeft: 4,
    fontFamily: ParrotFonts.semiBold,
    fontSize: 26,
    lineHeight: lineHeightFor(26),
    color: ParrotColors.primary,
  },
  ratingDot: {
    fontFamily: ParrotFonts.semiBold,
    fontSize: 26,
    lineHeight: lineHeightFor(26),
    color: 'rgba(44, 146, 255, 0.7)',
  },
  ratingLabel: {
    fontFamily: ParrotFonts.semiBold,
    fontSize: 26,
    lineHeight: lineHeightFor(26),
    color: 'rgba(44, 146, 255, 0.7)',
  },
  secondaryHit: {
    position: 'absolute',
    left: 140,
    top: 1580,
    width: 550,
    alignItems: 'center',
    zIndex: 20,
  },
  secondaryPressed: {
    opacity: 0.55,
  },
  secondaryLabel: {
    fontFamily: ParrotFonts.semiBold,
    fontSize: 32,
    lineHeight: lineHeightFor(32),
    letterSpacing: -0.8,
    color: ParrotColors.title,
  },
});
