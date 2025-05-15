import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';
import { COLORS } from '../theme/color';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <Text style={styles.welcome}>Bienvenido a</Text>
      <Image source={require('../../assets/images/logo-text.png')} style={styles.textLogo} />
      <Image source={require('../../assets/images/logo-icon.png')} style={styles.icon} />

      <View style={styles.buttons}>
        <CustomButton
          label="Crear Cuenta"
          colorType="blue"
          onPress={() => navigation.navigate('Register')}
        />
        <CustomButton
          label="Iniciar sesión"
          colorType="red"
          onPress={() => navigation.navigate('Login')} // Redirige a la nueva LoginScreen
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  icon: { width: 250, height: 140, marginBottom: 16 },
  welcome: { fontSize: 24, color: COLORS.text, marginBottom: 8 },
  textLogo: { width: 250, height: 40, marginBottom: 32 },
  buttons: { width: '80%', rowGap: 16 },
});