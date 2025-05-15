// src/screens/RegisterScreen.js
import React, { useState } from 'react'
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { COLORS } from '../theme/color'
import Header from '../components/Header'
import CustomButton from '../components/CustomButton'
import { useAuth } from '../context/AuthContext'
import { registerUser } from '../services/authService' // asumimos aquí tu authService

export default function RegisterScreen({ navigation }) {
  const { signIn } = useAuth()        // para guardar token en contexto
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [confirmPassword, setConfirm] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading]         = useState(false)

  const handleRegister = async () => {
    if (!email.trim() || !password) {
      return setErrorMessage('Email y contraseña son obligatorios')
    }
    if (password !== confirmPassword) {
      return setErrorMessage('Las contraseñas no coinciden')
    }

    setErrorMessage('')
    setLoading(true)
    try {
      // registerUser devuelve token JWT
      const token = await registerUser({ email: email.trim(), password })
      await signIn(email.trim(), password) // reutiliza tu signIn para persistir token
      // navegamos al Main (o donde dirija tu useEffect en LoginScreen)
    } catch (err) {
      setErrorMessage(err.message || 'Error al registrar')
      setLoading(false)
      return
    }
    setLoading(false)
    Alert.alert('¡Éxito!', 'Cuenta creada correctamente', [
      { text: 'OK', onPress: () => navigation.replace('Main') }
    ])
  }

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />

      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="rgba(255,255,255,0.7)"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="rgba(255,255,255,0.7)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Repetir Contraseña"
        placeholderTextColor="rgba(255,255,255,0.7)"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirm}
      />

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primaryRed}
          style={{ marginVertical: 10 }}
        />
      ) : (
        <CustomButton
          label="Registrar"
          colorType="red"
          onPress={handleRegister}
        />
      )}

      <Text
        style={styles.loginText}
        onPress={() => navigation.navigate('Login')}
      >
        ¿Ya tienes una cuenta? Inicia sesión
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center',
    alignItems: 'center', padding: 20,
    backgroundColor: COLORS.background,
  },
  title: { fontSize: 24, color: COLORS.text, marginBottom: 20 },
  input: {
    width: '80%', height: 50,
    backgroundColor: COLORS.primaryBlue,
    borderColor: COLORS.primaryBlue, borderWidth: 1.5,
    borderRadius: 10, marginBottom: 20,
    paddingLeft: 15, color: '#fff', fontSize: 16,
  },
  errorText: { color: 'red', marginBottom: 12 },
  loginText: {
    marginTop: 16, color: COLORS.primary,
    textDecorationLine: 'underline',
  },
})