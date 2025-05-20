// components/CircleFillWave.js
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useIsFocused } from '@react-navigation/native';
import { line, curveCatmullRom } from 'd3-shape';

export default function CircleFillWave({
  progress = 0,
  duration = 700,
  waveSpeed = 8000,
  size = 160,
  amp = 15,
  freq = 2,
  roundness = 0.1,
  edgeFade = 0.5,
  baseColor,
  fillColor,
  style,
  children,
  verticalAnimationKey,
  lateralAnimationKey,
}) {
  const coverY = useRef(new Animated.Value(size)).current;
  const shiftX = useRef(new Animated.Value(0)).current;
  const loopRef = useRef(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    // Reset values and stop any existing loop
    coverY.setValue(size);
    shiftX.setValue(0);
    if (loopRef.current) {
      loopRef.current.stop();
      loopRef.current = null;
    }

    // 1) Vertical fill animation
    const verticalAnim = Animated.timing(coverY, {
      toValue: size * (1 - progress),
      duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });

    // 2) Looping horizontal wave animation
    const waveLoop = Animated.loop(
      Animated.timing(shiftX, {
        toValue: -size,
        duration: waveSpeed,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loopRef.current = waveLoop;

    // Sequence them: fill first, then wave
    Animated.sequence([verticalAnim, waveLoop]).start();

    // Cleanup on unmount or deps change
    return () => {
      if (loopRef.current) {
        loopRef.current.stop();
        loopRef.current = null;
      }
    };
  }, [
    progress,
    size,
    duration,
    waveSpeed,
    verticalAnimationKey,
    lateralAnimationKey,
    isFocused,
  ]);

  // Precompute the SVG path for one wave period
  const wavePath = (() => {
    const STEPS = size * 8;
    const offsetY = amp * 0.6;
    const fade = (t) =>
      t < edgeFade ? t / edgeFade : t > 1 - edgeFade ? (1 - t) / edgeFade : 1;

    const pts = Array.from({ length: STEPS }).map((_, i) => {
      const t = i / (STEPS - 1);
      const x = t * size * 2 - size;
      const y =
        Math.sin(t * Math.PI * freq * 2) * amp * 0.7 * fade(t) + offsetY;
      return [x, y];
    });

    const d = line().curve(curveCatmullRom.alpha(roundness))(pts);
    return `${d} V ${size} H ${-size} Z`;
  })();

  const AnimatedSvg = Animated.createAnimatedComponent(Svg);
  const radius = size / 2;

  return (
    <View
      style={[
        styles.wrapper,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: baseColor,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { transform: [{ translateY: coverY }] },
          styles.overflow,
        ]}
      >
        <AnimatedSvg
          width={size * 2}
          height={size}
          style={{ transform: [{ translateX: shiftX }] }}
        >
          <Path d={wavePath} fill={fillColor} />
          <Path d={wavePath} fill={fillColor} x={size} />
        </AnimatedSvg>
      </Animated.View>

      <View style={styles.centered}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
  overflow: {
    overflow: 'hidden',
  },
  centered: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
});