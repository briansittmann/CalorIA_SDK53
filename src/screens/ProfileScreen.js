// src/screens/ProfileScreen.js
import React, { useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import CustomButton from '../components/CustomButton'
import { COLORS } from '../theme/color'
import { useAuth } from '../context/AuthContext'

export default function ProfileScreen() {
  const { signOut } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await signOut()
      // Cuando signOut borre el token, AppNavigator te redirigirá al flujo de Auth
    } catch (e) {
      // si quieres manejar errores, aquí
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      {/* Aquí mostrarías los datos del usuario, etc. */}
      <Text style={styles.title}>Mi Perfil</Text>
      
      {/* ... resto de tu UI de perfil ... */}

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primaryRed}
          style={styles.loader}
        />
      ) : (
        <CustomButton
          label="Cerrar sesión"
          colorType="red"
          onPress={handleLogout}
          style={styles.button}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: COLORS.background,
    padding:         20,
    justifyContent:  'center',
    alignItems:      'center',
  },
  title: {
    fontSize:     22,
    fontWeight:   'bold',
    color:        COLORS.text,
    marginBottom: 30,
  },
  button: {
    marginTop: 20,
  },
  loader: {
    marginTop: 20,
  },
})