// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import API from '../config/api'
import { fetchProfileState } from '../services/registerService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileState, setProfileState] = useState(null)





  // Al arrancar, recupera token y estado de perfil
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('userToken')
        if (stored) {
          setToken(stored)
          API.defaults.headers.common.Authorization = `Bearer ${stored}`
          const state = await fetchProfileState()
          setProfileState(state)
        }
      } catch (err) {
        console.warn('Error al cargar perfil:', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const signIn = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password })
    await AsyncStorage.setItem('userToken', data.token)
    API.defaults.headers.common.Authorization = `Bearer ${data.token}`
    setToken(data.token)
    const state = await fetchProfileState()
    setProfileState(state)
  }

  const signOut = async () => {
    await AsyncStorage.clear()
    delete API.defaults.headers.common.Authorization
    setToken(null)
    setProfileState(null)
  }

  const refreshProfileState = async () => {
    const state = await fetchProfileState()
    setProfileState(state)
  }

  return (
    <AuthContext.Provider value={{
      token,
      loading,
      profileState,
      signIn,
      signOut,
      refreshProfileState
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)