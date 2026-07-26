import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ParrotColors } from '@/constants/parrot-design';

type OnboardingHeaderProps = {
  onBack?: () => void;
  /** Design-space → screen-space scale (830 artboard width). */
  scale?: (n: number) => number;
};

export function OnboardingHeader({ onBack, scale = (n) => n }: OnboardingHeaderProps) {
  const s = scale;

  return (
    <View style={[styles.row, { height: s(83), paddingHorizontal: s(20) }]}>
      <Pressable
        onPress={onBack}
        hitSlop={16}
        accessibilityLabel="Go back"
        style={[styles.back, { width: s(28), height: s(28) }]}>
        <Image
          source={require('@/assets/images/parrot/back-chevron.png')}
          style={{ width: s(12), height: s(24) }}
          contentFit="contain"
        />
      </Pressable>

      <View style={[styles.trackWrap, { height: s(14), marginHorizontal: s(12) }]}>
        <View style={[styles.track, { borderRadius: s(7) }]} />
        <View
          style={[
            styles.fill,
            {
              width: '73%',
              borderRadius: s(7),
            },
          ]}
        />
        <View
          style={[
            styles.highlight,
            {
              left: s(6),
              top: s(4),
              width: '68%',
              height: s(3),
              borderRadius: s(2),
            },
          ]}
        />
      </View>

      <Image
        source={require('@/assets/images/parrot/parrot-avatar.png')}
        style={{ width: s(52), height: s(66) }}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  back: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  track: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: ParrotColors.progressTrack,
    opacity: 0.5,
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
    right: undefined,
    backgroundColor: ParrotColors.progressFill,
    opacity: 0.85,
  },
  highlight: {
    position: 'absolute',
    backgroundColor: ParrotColors.progressHighlight,
  },
});
