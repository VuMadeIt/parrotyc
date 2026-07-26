import { StyleSheet, Text, View } from 'react-native';

import { lineHeightFor, ParrotColors, ParrotFonts } from '@/constants/parrot-design';

type TitleBlockProps = {
  title: string;
  subtitle: string;
  titleTop: number;
  subtitleTop: number;
};

export function TitleBlock({ title, subtitle, titleTop, subtitleTop }: TitleBlockProps) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Text style={[styles.title, { top: titleTop }]}>{title}</Text>
      <Text style={[styles.subtitle, { top: subtitleTop }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    position: 'absolute',
    left: 47,
    width: 642,
    fontFamily: ParrotFonts.bold,
    fontSize: 65,
    lineHeight: lineHeightFor(65),
    letterSpacing: -3.575,
    color: ParrotColors.title,
  },
  subtitle: {
    position: 'absolute',
    left: 47,
    width: 749,
    fontFamily: ParrotFonts.semiBold,
    fontSize: 35,
    lineHeight: lineHeightFor(35),
    letterSpacing: -2.1,
    color: ParrotColors.subtitle,
  },
});
