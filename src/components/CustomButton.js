import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/color';

const COLOR_MAP = { red: COLORS.primaryRed, blue: COLORS.primaryBlue };

export default function CustomButton({ label, colorType='blue', onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor: COLOR_MAP[colorType] }]}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { borderRadius:30, paddingVertical:14, paddingHorizontal: 70, alignItems:'center' },
  label:  { fontSize:16, color:'#333' },
});