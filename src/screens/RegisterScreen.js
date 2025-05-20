// src/screens/RegisterScreen.js
import React, { useState } from 'react'
import {
  View,
  TextInput,
  Text,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { CommonActions } from '@react-navigation/native'
import { COLORS } from '../theme/color'
import Header from '../components/Header'
import CustomButton from '../components/CustomButton'
import { useAuth } from '../context/AuthContext'
import { registerUser } from '../services/authService'

export default function RegisterScreen({ navigation }) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

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
      await registerUser({ email: email.trim(), password })
      await signIn(email.trim(), password)
    } catch (err) {
      setErrorMessage(err.message || 'Error al registrar')
      setLoading(false)
      return
    }
    setLoading(false)

    Alert.alert('¡Éxito!', 'Cuenta creada correctamente', [
      {
        text: 'OK',
        onPress: () => {
          const authStack = navigation.getParent()
          const rootStack = authStack?.getParent()
          rootStack?.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            })
          )
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />

      <Image
        source={require('../../assets/images/logo-icon.png')}
        style={styles.icon}
      />

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

      {/* Password */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          placeholderTextColor="rgba(255,255,255,0.7)"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(v => !v)}
          style={styles.eyeButton}
        >
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color="rgba(255,255,255,0.7)"
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Repetir Contraseña"
          placeholderTextColor="rgba(255,255,255,0.7)"
          secureTextEntry={!showConfirm}
          value={confirmPassword}
          onChangeText={setConfirm}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setShowConfirm(v => !v)}
          style={styles.eyeButton}
        >
          <Ionicons
            name={showConfirm ? 'eye-off' : 'eye'}
            size={24}
            color="rgba(255,255,255,0.7)"
          />
        </TouchableOpacity>
      </View>

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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  icon: {
    width: 300,
    height: 170,
    marginTop: -20,
    marginBottom: 0,
  },
  title: {
    fontSize: 24,
    color: COLORS.text,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: COLORS.primaryBlue,
    borderColor: COLORS.primaryBlue,
    borderWidth: 1.5,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 15,
    color: '#fff',
    fontSize: 16,
  },
  inputWrapper: {
    width: '80%',
    height: 50,
    backgroundColor: COLORS.primaryBlue,
    borderColor: COLORS.primaryBlue,
    borderWidth: 1.5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  eyeButton: {
    padding: 4,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
  loginText: {
    marginTop: 16,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
})