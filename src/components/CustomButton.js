import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { COLORS } from '../theme/color';

const COLOR_MAP = {
  red: COLORS.primaryRed,
  blue: COLORS.primaryBlue,
  blueSecondary: COLORS.secondaryBlue
};

export default function CustomButton({ label, colorType = 'blue', onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: COLOR_MAP[colorType] },
        styles.shadow
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 70,
    alignItems: 'center'
  },
  label: {
    fontSize: 16,
    color: '#333'
  },
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 4
    },
    android: {
      elevation: 4
    }
  })
});