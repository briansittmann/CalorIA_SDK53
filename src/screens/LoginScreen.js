// src/screens/LoginScreen.js
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomButton from '../components/CustomButton'
import { COLORS } from '../theme/color'
import Header from '../components/Header'
import { useAuth } from '../context/AuthContext'
import { useNavigation } from '@react-navigation/native'
import { useMacros } from '../context/MacrosContext'

export default function LoginScreen() {
  const navigation         = useNavigation()
  const { token, signIn }  = useAuth()
  const { refreshMacros }  = useMacros()

  const [email, setEmail]            = useState('')
  const [password, setPassword]      = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]        = useState(false)

  // Si ya tenemos token, saltamos al flujo principal
  useEffect(() => {
    if (token) {
      navigation.replace('Main')
    }
  }, [token])

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      return Alert.alert('Error', 'Introduce email y contraseña')
    }
    setLoading(true)
    try {
      await signIn(email.trim(), password)
      await refreshMacros()
      // useEffect se encarga de navegar a Main
    } catch (err) {
      Alert.alert('Error', err.message || 'Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <Header navigation={navigation} />

      <Image
        source={require('../../assets/images/logo-icon.png')}
        style={styles.icon}
      />

      <Text style={styles.title}>Iniciar sesión</Text>

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="rgba(255,255,255,0.7)"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Contraseña con ojo */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          placeholderTextColor="rgba(255,255,255,0.7)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
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

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primaryRed}
          style={{ marginVertical: 10 }}
        />
      ) : (
        <CustomButton
          label="Iniciar sesión"
          colorType="red"
          onPress={handleLogin}
        />
      )}

      <Text
        style={styles.registerText}
        onPress={() => navigation.navigate('Register')}
      >
        ¿No tienes una cuenta? Regístrate
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
  icon:         { width: 300, height: 170, marginTop: -20, marginBottom: 20 },
  title:        { fontSize: 24, color: COLORS.text, marginBottom: 20 },
  input:        {
    width: '80%',
    height: 50,
    backgroundColor: COLORS.primaryBlue,
    borderColor: COLORS.primaryBlue,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingLeft: 15,
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
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
  passwordInput:{ flex: 1, color: '#fff', fontSize: 16 },
  eyeButton:     { padding: 4 },
  registerText:  { marginTop: 16, color: COLORS.primary, textDecorationLine: 'underline' },
})