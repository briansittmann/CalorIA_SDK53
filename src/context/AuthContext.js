// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import API from '../config/api'
import { checkProfileComplete } from '../services/registerService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken]               = useState(null)
  const [loading, setLoading]           = useState(true)
  const [profileComplete, setProfileComplete] = useState(false)

  // Al arrancar: recuperar token y comprobar perfil
  useEffect(() => {
    AsyncStorage.getItem('userToken')
      .then(async stored => {
        if (stored) {
          setToken(stored)
          API.defaults.headers.common['Authorization'] = `Bearer ${stored}`
          const completo = await checkProfileComplete()
          setProfileComplete(completo)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const signIn = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password })
    await AsyncStorage.setItem('userToken', data.token)
    API.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setToken(data.token)
    // Al iniciar sesión, comprobamos el perfil
    const completo = await checkProfileComplete()
    setProfileComplete(completo)
  }

  const signOut = async () => {
    await AsyncStorage.removeItem('userToken')
    delete API.defaults.headers.common['Authorization']
    setToken(null)
    setProfileComplete(false)
  }

  return (
    <AuthContext.Provider value={{
      token,
      loading,
      profileComplete,
      signIn,
      signOut,
      setProfileComplete
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}