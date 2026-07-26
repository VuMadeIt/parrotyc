import { StyleSheet, useWindowDimensions, View, type StyleProp, type ViewStyle } from 'react-native';

import { ParrotArtboard, ParrotColors } from '@/constants/parrot-design';

type ArtboardProps = {
  children: React.ReactNode;
  /**
   * `bottom` — pin canvas to the screen bottom (verify screens / fake keyboard).
   * `top` — pin canvas using `topOffset` (interactive screens + safe area).
   */
  anchor?: 'top' | 'bottom';
  /** Extra Y offset when `anchor="top"` (typically safe-area compensated). */
  topOffset?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Renders children in raw Figma coordinates (830 × 1800). The canvas is scaled
 * to the device width so every absolute x/y/width/height matches the design file.
 */
export function Artboard({
  children,
  anchor = 'bottom',
  topOffset = 0,
  style,
}: ArtboardProps) {
  const { width, height } = useWindowDimensions();
  const scale = width / ParrotArtboard.width;
  const top = anchor === 'bottom' ? height - ParrotArtboard.height * scale : topOffset;

  return (
    <View style={[styles.root, style]}>
      <View style={[styles.canvas, { transform: [{ scale }], top }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: ParrotColors.background,
  },
  canvas: {
    position: 'absolute',
    left: 0,
    width: ParrotArtboard.width,
    height: ParrotArtboard.height,
    backgroundColor: ParrotColors.background,
    transformOrigin: 'top left',
  },
});
