import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

export function IosKeyboard() {
  return (
    <Image
      source={require('@/assets/images/parrot/keyboard.png')}
      style={styles.keyboard}
      contentFit="fill"
    />
  );
}

const styles = StyleSheet.create({
  keyboard: {
    position: 'absolute',
    left: 0,
    top: 1197,
    width: 830,
    height: 603,
  },
});
