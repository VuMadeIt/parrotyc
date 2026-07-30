import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Artboard } from '@/components/parrot/artboard';
import { ContinueButton } from '@/components/parrot/continue-button';
import { LevelOption } from '@/components/parrot/option-card';
import { ProgressHeader } from '@/components/parrot/progress-header';
import { TitleBlock } from '@/components/parrot/title-block';
import { OnboardingProgress, OnboardingProgressFrom } from '@/constants/onboarding';
import { ParrotArtboard, ParrotColors } from '@/constants/parrot-design';

const LEVELS = [
  { id: 'im_new_to_the_language', label: "I'm new to Spanish", activeBars: 0 },
  { id: 'i_know_some_common_words', label: 'I know some common words', activeBars: 1 },
  { id: 'i_can_have_basic_conversations', label: 'I can have basic conversations', activeBars: 2 },
  { id: 'i_can_talk_about_various_topics', label: 'I can talk about various topics', activeBars: 3 },
  { id: 'i_can_discuss_most_topics_in_detail', label: 'I can discuss most topics in detail', activeBars: 4 },
] as const;

const ROW_LEFT = 47;
const ROW_TOP = 560;
const ROW_WIDTH = 736;
const ROW_HEIGHT = 118;
const ROW_GAP = 22;

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default function SelectLevelScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scale = width / ParrotArtboard.width;
  const topOffset = useMemo(() => insets.top - 138 * scale, [insets.top, scale]);

  const params = useLocalSearchParams<{ language?: string }>();
  const language = firstParam(params.language) ?? 'es';

  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    void Haptics.selectionAsync();
    setSelected(id);
  };

  const handleContinue = () => {
    if (!selected) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/parrot/enable-notifications',
      params: { language, level: selected },
    });
  };

  return (
    <View style={styles.root}>
      <Artboard anchor="top" topOffset={topOffset}>
        <ProgressHeader
          progress={OnboardingProgress.level}
          from={OnboardingProgressFrom.level}
          onBack={() => router.back()}
        />
        <TitleBlock
          title="What is your Spanish level?"
          subtitle="We'll use this to tailor the experience to you."
          titleTop={280}
          subtitleTop={470}
        />

        {LEVELS.map((option, index) => (
          <LevelOption
            key={option.id}
            label={option.label}
            activeBars={option.activeBars}
            selected={selected === option.id}
            onPress={() => handleSelect(option.id)}
            left={ROW_LEFT}
            top={ROW_TOP + index * (ROW_HEIGHT + ROW_GAP)}
            width={ROW_WIDTH}
            height={ROW_HEIGHT}
          />
        ))}

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
