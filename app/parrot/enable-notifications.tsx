import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Artboard } from '@/components/parrot/artboard';
import { ProgressHeader } from '@/components/parrot/progress-header';
import { TitleBlock } from '@/components/parrot/title-block';
import { OnboardingProgress, OnboardingProgressFrom } from '@/constants/onboarding';
import { ParrotArtboard, ParrotColors } from '@/constants/parrot-design';

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Shows the onboarding copy, then raises the *native* iOS/Android notification
 * permission dialog. There is no custom modal — both Allow and Don't Allow
 * advance to the phone-number step after we log the outcome.
 */
export default function EnableNotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scale = width / ParrotArtboard.width;
  const topOffset = useMemo(() => insets.top - 138 * scale, [insets.top, scale]);

  const params = useLocalSearchParams<{ language?: string; level?: string }>();
  const language = firstParam(params.language);
  const level = firstParam(params.level);

  const prompted = useRef(false);

  useEffect(() => {
    if (prompted.current) return;
    prompted.current = true;

    let active = true;

    const run = async () => {
      // Give the title a beat to paint before the system sheet covers it.
      await new Promise((resolve) => setTimeout(resolve, 600));
      if (!active) return;

      let status: Notifications.PermissionStatus =
        Notifications.PermissionStatus.UNDETERMINED;
      try {
        const existing = await Notifications.getPermissionsAsync();
        status = existing.status;

        // iOS only shows the system alert while status is undetermined (first
        // ask). After Allow/Don't Allow, the OS will not present it again —
        // reset via Settings → Expo Go → Notifications to retest.
        const shouldAsk =
          status === Notifications.PermissionStatus.UNDETERMINED ||
          (status !== Notifications.PermissionStatus.GRANTED && existing.canAskAgain);

        if (shouldAsk) {
          const result = await Notifications.requestPermissionsAsync({
            ios: {
              allowAlert: true,
              allowBadge: true,
              allowSound: true,
              allowDisplayInCarPlay: false,
            },
          });
          status = result.status;
        }
      } catch (error) {
        console.warn('Notification permission request failed', error);
        status = Notifications.PermissionStatus.DENIED;
      }

      if (!active) return;

      console.log('[onboarding] notification permission', {
        status,
        platform: Platform.OS,
        language,
        level,
      });

      if (status === Notifications.PermissionStatus.GRANTED) {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      router.push({
        pathname: '/parrot/input-phone-number',
        params: {
          language: language ?? '',
          level: level ?? '',
          notifications: status,
        },
      });
    };

    void run();

    return () => {
      active = false;
    };
  }, [language, level]);

  return (
    <View style={styles.root}>
      <Artboard anchor="top" topOffset={topOffset}>
        <ProgressHeader
          progress={OnboardingProgress.notifications}
          from={OnboardingProgressFrom.notifications}
          onBack={() => router.back()}
        />
        <TitleBlock
          title="Never miss a Spanish lesson again"
          subtitle="86% of users hit their goals with daily reminders"
          titleTop={280}
          subtitleTop={520}
        />
      </Artboard>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ParrotColors.background,
  },
});
