import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ParrotColors } from '@/constants/parrot-design';

export function ProgressHeader({ onBack }: { onBack?: () => void }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Pressable style={styles.back} hitSlop={40} onPress={onBack} accessibilityLabel="Go back">
        <Image
          source={require('@/assets/images/parrot/back-chevron.png')}
          style={styles.backIcon}
          contentFit="contain"
        />
      </Pressable>

      <View style={styles.track} />
      <View style={styles.fill} />
      <View style={styles.highlight} />

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
    width: 591,
    height: 29,
    borderRadius: 14.5,
    backgroundColor: ParrotColors.progressTrack,
    opacity: 0.5,
  },
  fill: {
    position: 'absolute',
    left: 98,
    top: 169,
    width: 434,
    height: 30,
    borderRadius: 14.5,
    backgroundColor: ParrotColors.progressFill,
    opacity: 0.8,
  },
  highlight: {
    position: 'absolute',
    left: 107,
    top: 175,
    width: 413,
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
