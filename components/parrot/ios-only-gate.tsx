import type { ReactNode } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { ParrotColors } from '@/constants/parrot-design';

/**
 * Parrot onboarding is laid out for iPhone + Expo Go only.
 * Block web/laptop (and other native platforms) with a clear redirect message.
 */
export function isIphoneClient() {
  return Platform.OS === 'ios';
}

export function IosOnlyGate({ children }: { children: ReactNode }) {
  if (isIphoneClient()) {
    return <>{children}</>;
  }

  const onWeb = Platform.OS === 'web';

  return (
    <View style={styles.root}>
      <Text style={styles.brand}>Parrot</Text>
      <Text style={styles.title}>iPhone only</Text>
      <Text style={styles.body}>
        This app isn’t optimized for laptop or browser. Open it on an iPhone with{' '}
        <Text style={styles.em}>Expo Go</Text>
        {onWeb ? ' — scan the QR from the terminal (exp://…exp.direct:80).' : '.'}
      </Text>
      {onWeb ? (
        <Text style={styles.hint}>
          Don’t use the web preview or “Open in browser.” Use Expo Go on iOS only.
        </Text>
      ) : (
        <Text style={styles.hint}>Android and tablets aren’t supported for this build.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: ParrotColors.background,
  },
  brand: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: ParrotColors.primary,
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: ParrotColors.title,
    marginBottom: 12,
  },
  body: {
    fontFamily: 'Inter_500Medium',
    fontSize: 17,
    lineHeight: 26,
    color: ParrotColors.subtitle,
  },
  em: {
    fontFamily: 'Inter_600SemiBold',
    color: ParrotColors.title,
  },
  hint: {
    marginTop: 20,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    lineHeight: 20,
    color: ParrotColors.mutedLabel,
  },
});
