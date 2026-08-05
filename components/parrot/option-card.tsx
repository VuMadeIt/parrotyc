import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { lineHeightFor, ParrotColors, ParrotFonts } from '@/constants/parrot-design';

/** Matches the Continue button's enabled/disabled transition. */
const TRANSITION = { duration: 260, easing: Easing.out(Easing.cubic) };

const CARD_RADIUS = 35;

/**
 * Shared surface for the onboarding option cards. Unselected cards are plain
 * white — the blue outline and tint appear only while `selected` is true.
 */
function useSelectionStyles(selected: boolean, disabled: boolean) {
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, TRANSITION);
  }, [selected, progress]);

  const surfaceStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [ParrotColors.cardBackground, ParrotColors.selectedBackground]
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      ['rgba(0,0,0,0)', ParrotColors.primary]
    ),
  }));

  return { surfaceStyle, interactive: !disabled };
}

type LanguageCardProps = {
  flag: string;
  name: string;
  /** Learner count for available languages, replaced by "Coming soon" when locked. */
  detail: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  left: number;
  top: number;
  width: number;
  height: number;
};

export function LanguageCard({
  flag,
  name,
  detail,
  selected = false,
  disabled = false,
  onPress,
  left,
  top,
  width,
  height,
}: LanguageCardProps) {
  const { surfaceStyle } = useSelectionStyles(selected, disabled);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      accessibilityLabel={`${name}. ${detail}`}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.cardHit,
        { left, top, width, height },
        pressed && !disabled ? styles.pressed : null,
      ]}>
      <Animated.View style={[styles.cardSurface, surfaceStyle]} />
      <Text style={[styles.flag, disabled ? styles.dimmed : null]}>{flag}</Text>
      <Text style={[styles.languageName, disabled ? styles.mutedText : null]}>{name}</Text>
      <Text style={[styles.languageDetail, disabled ? styles.mutedText : null]}>{detail}</Text>
    </Pressable>
  );
}

type LevelOptionProps = {
  label: string;
  /** How many of the 4 signal bars are filled (0–4), matching the live app. */
  activeBars: number;
  selected?: boolean;
  onPress?: () => void;
  left: number;
  top: number;
  width: number;
  height: number;
};

export function LevelOption({
  label,
  activeBars,
  selected = false,
  onPress,
  left,
  top,
  width,
  height,
}: LevelOptionProps) {
  const { surfaceStyle } = useSelectionStyles(selected, false);

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.rowHit,
        { left, top, width, height },
        pressed ? styles.pressed : null,
      ]}>
      <Animated.View style={[styles.cardSurface, surfaceStyle]} />
      <LevelMeter activeBars={activeBars} />
      <Text style={styles.levelLabel} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * Mirrors the live Parrot SignalBars control:
 * four ascending bars at 25/50/75/100% height; `activeBars` fills the first N.
 * Source: app.parrotapp.com OnboardingPage (`ee` / `We=[.25,.5,.75,1]`).
 */
const BAR_HEIGHTS = [0.25, 0.5, 0.75, 1] as const;
const METER_SIZE = 52;

function LevelMeter({ activeBars }: { activeBars: number }) {
  const barWidth = Math.max(1, Math.round((METER_SIZE - 3 * 4) / 4));
  const gap = Math.max(2, Math.round((METER_SIZE - barWidth * 4) / 3));

  return (
    <View
      accessible
      accessibilityLabel={`Level ${activeBars} of 4`}
      style={[styles.meter, { width: METER_SIZE, height: METER_SIZE }]}>
      {BAR_HEIGHTS.map((fraction, index) => {
        const filled = index < activeBars;
        return (
          <View
            key={fraction}
            style={[
              styles.meterColumn,
              {
                width: barWidth,
                height: METER_SIZE,
                marginRight: index < BAR_HEIGHTS.length - 1 ? gap : 0,
              },
            ]}>
            <View
              style={[
                styles.meterBar,
                {
                  width: barWidth,
                  height: Math.max(2, Math.round(METER_SIZE * fraction)),
                  borderRadius: barWidth / 2,
                  backgroundColor: filled
                    ? ParrotColors.primary
                    : ParrotColors.meterTrack,
                },
              ]}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  cardHit: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 5,
  },
  rowHit: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 42,
    zIndex: 5,
  },
  cardSurface: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: CARD_RADIUS,
    borderWidth: 3,
    shadowColor: ParrotColors.cardShadow,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  pressed: {
    opacity: 0.75,
  },
  flag: {
    marginTop: 52,
    fontSize: 54,
    lineHeight: lineHeightFor(54),
  },
  dimmed: {
    opacity: 0.45,
  },
  languageName: {
    marginTop: 26,
    fontFamily: ParrotFonts.bold,
    fontSize: 32,
    lineHeight: lineHeightFor(32),
    letterSpacing: -1.024,
    color: ParrotColors.title,
  },
  languageDetail: {
    marginTop: 10,
    paddingHorizontal: 24,
    fontFamily: ParrotFonts.medium,
    fontSize: 24,
    lineHeight: lineHeightFor(24),
    letterSpacing: -0.768,
    color: ParrotColors.subtitle,
    textAlign: 'center',
  },
  mutedText: {
    color: ParrotColors.mutedLabel,
  },
  meter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meterColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  meterBar: {},
  levelLabel: {
    marginLeft: 32,
    flexShrink: 1,
    fontFamily: ParrotFonts.semiBold,
    fontSize: 32,
    lineHeight: lineHeightFor(32),
    letterSpacing: -1.024,
    color: ParrotColors.title,
  },
});
