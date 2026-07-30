import { Image } from 'expo-image';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ParrotColors } from '@/constants/parrot-design';

const TRACK_WIDTH = 591;
/** Figma 14:299 — the fill sits 1px above the track and runs 9px wider inset. */
const HIGHLIGHT_INSET = 9;

type ProgressHeaderProps = {
  onBack?: () => void;
  /** 0–1 completion for the current onboarding step. */
  progress?: number;
  /**
   * Where the fill should start before animating to `progress`.
   * Pass the previous step's value so the bar visibly grows on each screen.
   */
  from?: number;
};

export function ProgressHeader({
  onBack,
  progress = 0.1,
  from,
}: ProgressHeaderProps) {
  const clamped = Math.min(Math.max(progress, 0), 1);
  const start = Math.min(Math.max(from ?? Math.max(clamped - 0.12, 0), 0), clamped);
  const value = useSharedValue(start);

  useEffect(() => {
    value.value = start;
    value.value = withTiming(clamped, {
      duration: 520,
      easing: Easing.out(Easing.cubic),
    });
  }, [clamped, start, value]);

  const fillStyle = useAnimatedStyle(() => ({
    width: Math.max(TRACK_WIDTH * value.value, 0),
  }));

  const highlightStyle = useAnimatedStyle(() => ({
    width: Math.max(TRACK_WIDTH * value.value - HIGHLIGHT_INSET * 2, 0),
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {onBack ? (
        <Pressable style={styles.back} hitSlop={40} onPress={onBack} accessibilityLabel="Go back">
          <Image
            source={require('@/assets/images/parrot/back-chevron.png')}
            style={styles.backIcon}
            contentFit="contain"
          />
        </Pressable>
      ) : null}

      <View style={styles.track} />
      <Animated.View style={[styles.fill, fillStyle]} />
      <Animated.View style={[styles.highlight, highlightStyle]} />

      <Image
        source={require('@/assets/images/parrot/parrot-avatar.png')}
        style={styles.avatar}
        contentFit="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  back: {
    position: 'absolute',
    left: 47,
    top: 172.5,
    width: 12,
    height: 24.5,
  },
  backIcon: {
    width: '100%',
    height: '100%',
  },
  track: {
    position: 'absolute',
    left: 98,
    top: 170,
    width: TRACK_WIDTH,
    height: 29,
    borderRadius: 14.5,
    backgroundColor: ParrotColors.progressTrack,
    opacity: 0.5,
  },
  fill: {
    position: 'absolute',
    left: 98,
    top: 169,
    height: 30,
    borderRadius: 14.5,
    backgroundColor: ParrotColors.progressFill,
    opacity: 0.8,
  },
  highlight: {
    position: 'absolute',
    left: 98 + HIGHLIGHT_INSET,
    top: 175,
    height: 6,
    borderRadius: 3,
    backgroundColor: ParrotColors.progressHighlight,
  },
  avatar: {
    position: 'absolute',
    left: 731,
    top: 138,
    width: 65,
    height: 83,
  },
});
