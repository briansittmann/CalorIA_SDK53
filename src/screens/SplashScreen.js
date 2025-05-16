import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../theme/color';

export default function SplashScreen({ navigation }) {
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('Welcome'); // Asegúrate de que 'Welcome' es la ruta correcta
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/images/logo.png')}
        style={[styles.logo, { transform: [{ scale }] }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  logo: { width: 350, height: 350,marginBottom: 30 },
});