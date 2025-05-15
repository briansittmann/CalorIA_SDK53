import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../theme/color'; // Si usas colores personalizados
import { Icon } from 'react-native-elements'; // Si usas iconos de react-native-elements

export default function Header({ navigation }) {
  return (
    <View style={styles.headerContainer}>
      {/* Botón de retroceso */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" type="ionicon" size={24} color="black" />
      </TouchableOpacity>

      {/* Logo centrado */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/images/logo-text.png')} 
          style={styles.logo} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 30,
    position: 'absolute', // Esto asegura que el header esté fijo en la parte superior
    top: 0, // Fijarlo en la parte superior
    left: 0, // Asegura que esté alineado a la izquierda
    right: 0, // Asegura que cubra todo el ancho
    height: 80, // Ajusta la altura del header
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingTop: 20, 
    paddingHorizontal: 20,
    zIndex: 100, // Asegura que el header esté encima de otros elementos
  },
  backButton: {
    marginTop: 15,
    position: 'absolute', // Posicionar el botón de vuelta a la izquierda
    left: 20, // Asegúrate de que esté alejado del borde izquierdo
    top: 20, // Puedes ajustar la posición vertical
  },
  logoContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  logo: {
    width: 200, // Ajusta el tamaño según lo necesites
    height: 50, // Ajusta el tamaño según lo necesites
  },
});