import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Artboard } from '@/components/parrot/artboard';
import { ContinueButton } from '@/components/parrot/continue-button';
import { LanguageCard } from '@/components/parrot/option-card';
import { ProgressHeader } from '@/components/parrot/progress-header';
import { TitleBlock } from '@/components/parrot/title-block';
import { OnboardingProgress, OnboardingProgressFrom } from '@/constants/onboarding';
import { ParrotArtboard, ParrotColors } from '@/constants/parrot-design';

type LanguageOption = {
  id: string;
  flag: string;
  name: string;
  detail: string;
  available: boolean;
};

const LANGUAGES: LanguageOption[] = [
  {
    id: 'es',
    flag: '🇪🇸',
    name: 'Spanish',
    detail: '24.2M learners worldwide',
    available: true,
  },
  {
    id: 'fr',
    flag: '🇫🇷',
    name: 'French',
    detail: 'Coming soon',
    available: false,
  },
  {
    id: 'it',
    flag: '🇮🇹',
    name: 'Italian',
    detail: 'Coming soon',
    available: false,
  },
  {
    id: 'en',
    flag: '🇬🇧',
    name: 'English',
    detail: 'Coming soon',
    available: false,
  },
];

const CARD_WIDTH = 340;
const CARD_HEIGHT = 300;
const CARD_GAP = 28;
const GRID_LEFT = 61;
const GRID_TOP = 620;

export default function SelectLanguageScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scale = width / ParrotArtboard.width;
  const topOffset = useMemo(() => insets.top - 138 * scale, [insets.top, scale]);

  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    void Haptics.selectionAsync();
    setSelected(id);
  };

  const handleContinue = () => {
    if (!selected) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/parrot/select-level',
      params: { language: selected },
    });
  };

  return (
    <View style={styles.root}>
      <Artboard anchor="top" topOffset={topOffset}>
        <ProgressHeader
          progress={OnboardingProgress.language}
          from={OnboardingProgressFrom.language}
          onBack={() => router.back()}
        />
        <TitleBlock
          title="What language do you want to learn?"
          subtitle="Join the millions of people learning languages around the world."
          titleTop={280}
          subtitleTop={500}
        />

        {LANGUAGES.map((language, index) => {
          const column = index % 2;
          const row = Math.floor(index / 2);
          return (
            <LanguageCard
              key={language.id}
              flag={language.flag}
              name={language.name}
              detail={language.detail}
              disabled={!language.available}
              selected={selected === language.id}
              onPress={
                language.available ? () => handleSelect(language.id) : undefined
              }
              left={GRID_LEFT + column * (CARD_WIDTH + CARD_GAP)}
              top={GRID_TOP + row * (CARD_HEIGHT + CARD_GAP)}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
            />
          );
        })}

        <ContinueButton
          left={32}
          top={1420}
          enabled={selected !== null}
          onPress={handleContinue}
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
