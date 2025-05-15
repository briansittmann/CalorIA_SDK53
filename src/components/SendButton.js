import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { COLORS } from '../theme/color';

export default function SendButton({
  size            = 60,
  backgroundColor = COLORS.primaryRed,
  iconColor       = COLORS.text,
  onPress,
  style,
}) {
  const shadow = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    android: { elevation: 4 },
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          alignItems: 'center',
          justifyContent: 'center',
        },
        shadow,
        style,
      ]}
    >
      {/* Aquí cambiamos "send" por "save" */}
      <Feather
        name="send"
        size={size * 0.45}
        color={iconColor}
        style={{ marginTop: 5 }}
      />
    </TouchableOpacity>
  );
}

SendButton.propTypes = {
  size:            PropTypes.number,
  backgroundColor: PropTypes.string,
  iconColor:       PropTypes.string,
  onPress:         PropTypes.func,
  style:           PropTypes.any,
};