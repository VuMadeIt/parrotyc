import * as Haptics from 'expo-haptics';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COUNTRIES, type Country } from '@/constants/countries';
import { ParrotColors, ParrotFonts, lineHeightFor } from '@/constants/parrot-design';

type CountryPickerProps = {
  visible: boolean;
  selectedIso2: string;
  onClose: () => void;
  onSelect: (country: Country) => void;
};

export function CountryPicker({ visible, selectedIso2, onClose, onSelect }: CountryPickerProps) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.abbreviation.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.iso2.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSelect = (country: Country) => {
    void Haptics.selectionAsync();
    onSelect(country);
    setQuery('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      onRequestClose={onClose}>
      <View style={[styles.sheet, { paddingTop: Platform.OS === 'ios' ? 12 : insets.top + 12 }]}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={styles.title}>Select country</Text>
          <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button">
            <Text style={styles.done}>Done</Text>
          </Pressable>
        </View>

        <View style={styles.searchWrap}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search country or code"
            placeholderTextColor={ParrotColors.placeholder}
            style={styles.search}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
            returnKeyType="search"
          />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.iso2}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          renderItem={({ item }) => {
            const selected = item.iso2 === selectedIso2;
            return (
              <Pressable
                style={[styles.row, selected && styles.rowSelected]}
                onPress={() => handleSelect(item)}
                accessibilityRole="button"
                accessibilityState={{ selected }}>
                <Text style={styles.flag}>{item.flag}</Text>
                <Text style={styles.countryName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.dial}>{item.dialCode}</Text>
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.empty}>No countries match “{query.trim()}”</Text>
          }
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    backgroundColor: ParrotColors.background,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#c7c7cc',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: {
    fontFamily: ParrotFonts.semiBold,
    fontSize: 20,
    lineHeight: lineHeightFor(20),
    color: ParrotColors.title,
  },
  done: {
    fontFamily: ParrotFonts.semiBold,
    fontSize: 17,
    color: ParrotColors.primary,
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  search: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#efeff0',
    fontFamily: ParrotFonts.medium,
    fontSize: 16,
    color: ParrotColors.title,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5ea',
  },
  rowSelected: {
    backgroundColor: 'rgba(44,146,255,0.08)',
  },
  flag: {
    fontSize: 28,
    width: 40,
    textAlign: 'center',
  },
  countryName: {
    flex: 1,
    fontFamily: ParrotFonts.medium,
    fontSize: 17,
    color: ParrotColors.title,
  },
  dial: {
    fontFamily: ParrotFonts.medium,
    fontSize: 16,
    color: ParrotColors.subtitle,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontFamily: ParrotFonts.medium,
    fontSize: 16,
    color: ParrotColors.placeholder,
  },
});
