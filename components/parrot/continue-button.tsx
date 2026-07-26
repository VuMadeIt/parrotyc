import { useEffect } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { lineHeightFor, ParrotColors, ParrotFonts } from '@/constants/parrot-design';

type ContinueButtonProps = {
  enabled?: boolean;
  onPress?: () => void;
  /** Absolute Figma artboard positioning (14:299 / 14:420). */
  left?: number;
  top?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Figma Continue control:
 * - Frame 14:299 disabled → #E1E1E1 / label #898A8D
 * - Frame 14:420 enabled  → #2C92FF / label #FFFFFF
 * - Size 766×122, radius 61, Inter SemiBold 35 / tracking -1.12
 */
export function ContinueButton({
  enabled = false,
  onPress,
  left,
  top,
  style,
}: ContinueButtonProps) {
  const progress = useSharedValue(enabled ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(enabled ? 1 : 0, {
      duration: 260,
      easing: Easing.out(Easing.cubic),
    });
  }, [enabled, progress]);

  const fillStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [ParrotColors.disabled, ParrotColors.primary]
    ),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [ParrotColors.disabledLabel, ParrotColors.primaryLabel]
    ),
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !enabled }}
      disabled={!enabled}
      onPress={enabled ? onPress : undefined}
      style={[
        styles.hit,
        left !== undefined && top !== undefined ? { position: 'absolute', left, top } : null,
        style,
      ]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.fill,
          // Static fallback matches Figma enabled/disabled fills if the worklet lags.
          { backgroundColor: enabled ? ParrotColors.primary : ParrotColors.disabled },
          fillStyle,
        ]}
      />
      <Animated.Text style={[styles.label, labelStyle]}>Continue</Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    width: 766,
    height: 122,
    borderRadius: 61,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 20,
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 61,
  },
  label: {
    fontFamily: ParrotFonts.semiBold,
    fontSize: 35,
    lineHeight: lineHeightFor(35),
    letterSpacing: -1.12,
    zIndex: 1,
  },
});
