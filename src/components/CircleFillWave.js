import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';
import { line, curveCatmullRom } from 'd3-shape';

export default function CircleFillWave({
  /* ── comportamiento ── */
  progress   = 0,      // 0‒1
  duration   = 600,    // ms llenado vertical
  waveSpeed  = 4000,   // ms por ciclo lateral

  /* ── geometría ── */
  size       = 160,    // diámetro px
  amp        = 15,     // altura cresta (px). ↑ = ola más grande
  freq       = 2,      // nº de crestas visibles
  roundness  = 0.1,   // Catmull-Rom α  (0 = muy blando)
  edgeFade   = 0.5,   // % lateral sin ola (evita corte recto)

  /* ── colores & estilo ── */
  baseColor,
  fillColor,
  style,
  children,
}) {
  /* tapa que baja destapando el agua */
  const coverY = useRef(new Animated.Value(size)).current;
  /* desplazamiento horizontal infinito */
  const shiftX = useRef(new Animated.Value(0)).current;

  /* animar nivel vertical */
  useEffect(() => {
    coverY.setValue(size);
    Animated.timing(coverY, {
      toValue: size * (1 - progress),
      duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [progress, size, duration]);

  /* animar ola lateral */
  useEffect(() => {
    shiftX.setValue(0);
    Animated.loop(
      Animated.timing(shiftX, {
        toValue: -size,
        duration: waveSpeed,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [shiftX, size, waveSpeed]);

  /* ── path suave y “profundo” ── */
  const wavePath = (() => {
    const STEPS   = size * 8;             // alta resolución
    const offsetY = amp * 0.6;            // hunde la ola
    const fade = (t) => {                 // atenuar en bordes
      if (t < edgeFade)         return t / edgeFade;
      if (t > 1 - edgeFade)     return (1 - t) / edgeFade;
      return 1;
    };

    const pts = Array.from({ length: STEPS }).map((_, i) => {
      const t = i / (STEPS - 1);                           // 0 … 1
      const x = t * size * 2 - size;                       // -size … +size
      const y = Math.sin(t * Math.PI * freq * 2)           // seno
                * amp * 0.7                                // cresta alta
                * fade(t)                                  // bordes suaves
                + offsetY;                                 // desplaza ↓
      return [x, y];
    });

    const d = line()
      .curve(curveCatmullRom.alpha(roundness))(pts);

    return `${d} V ${size} H ${-size} Z`;
  })();

  const AnimatedSvg = Animated.createAnimatedComponent(Svg);
  const radius      = size / 2;

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
      {/* capa con agua */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
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
          {/* segunda copia para cubrir hueco al desplazar */}
          <Path d={wavePath} fill={fillColor} x={size}  />
        </AnimatedSvg>
      </Animated.View>

      {/* contenido centrado */}
      <View style={styles.centered}>{children}</View>
    </View>
  );
}

CircleFillWave.propTypes = {
  progress:   PropTypes.number,
  duration:   PropTypes.number,
  waveSpeed:  PropTypes.number,
  size:       PropTypes.number,
  amp:        PropTypes.number,
  freq:       PropTypes.number,
  roundness:  PropTypes.number,
  edgeFade:   PropTypes.number,
  baseColor:  PropTypes.string.isRequired,
  fillColor:  PropTypes.string.isRequired,
  style:      PropTypes.any,
  children:   PropTypes.node,
};

const styles = StyleSheet.create({
  wrapper:  { overflow: 'hidden' },
  overflow: { overflow: 'hidden' },
  centered: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});