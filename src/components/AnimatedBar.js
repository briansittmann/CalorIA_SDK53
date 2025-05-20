// components/AnimatedBar.js
import React, { useRef, useEffect, useState } from 'react';
import { Animated, StyleSheet, Easing } from 'react-native';
import * as Progress from 'react-native-progress';
import { COLORS } from '../theme/color';           // ← tu tema

export default function AnimatedBar({
  value = 0,              // 0‒1
  duration = 1000,        // ms (velocidad)
  animationKey = 0,       // reinicia animación
  width = 110,
  height = 18,
  radius = 25,
  barStyle,               // (opcional) override
  color        = COLORS.secondaryBlue, // relleno
  track        = COLORS.primaryBlue,   // fondo
}) {
  /* valor animado interno */
  const animated = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  /* reproduce de 0 → value en cada cambio */
  useEffect(() => {
    animated.setValue(0);
    const id = animated.addListener(({ value }) => setDisplay(value));

    Animated.timing(animated, {
      toValue: value,
      duration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false, // debe ser false para obtener el número JS
    }).start(() => animated.removeListener(id));

    return () => animated.removeListener(id);
  }, [value, duration, animationKey, animated]);

  return (
    <Progress.Bar
      progress={display}
      color={color}
      unfilledColor={track}
      width={width}
      height={height}
      borderRadius={radius}
      animated={false}
      style={[styles.bar, barStyle]}
    />
  );
}

const styles = StyleSheet.create({
  bar: { marginHorizontal: 2 },
});