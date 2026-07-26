import { Stack } from 'expo-router';

import { ParrotColors } from '@/constants/parrot-design';

export default function ParrotLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: ParrotColors.background },
      }}
    />
  );
}
