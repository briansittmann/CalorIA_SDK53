// CircleFill.js
import React, { useRef, useEffect } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export default function CircleFill({
  progress = 0,          // 0-1
  size = 160,
  baseColor,
  fillColor,
  style,
  children,
}) {
  // altura que queda SIN llenar (baja cuando progress sube)
  const translate = useRef(new Animated.Value(size)).current;

  useEffect(() => {
    Animated.timing(translate, {
      toValue: size * (1 - progress),
      duration: 500,
      useNativeDriver: false,      // height/translateY no soporta driver nativo
    }).start();
  }, [progress, size, translate]);

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: baseColor },
        style,
      ]}
    >
      {/* capa que "sube" */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: fillColor, transform: [{ translateY: translate }] },
        ]}
      />
      {/* texto centrado */}
      <View style={styles.centered}>{children}</View>
    </View>
  );
}

CircleFill.propTypes = {
  progress: PropTypes.number,
  size: PropTypes.number,
  baseColor: PropTypes.string.isRequired,
  fillColor: PropTypes.string.isRequired,
  style: PropTypes.any,
  children: PropTypes.node,
};

const styles = StyleSheet.create({
  container: { overflow: 'hidden' },
  centered: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});