// src/context/MacrosContext.js
import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect
} from 'react'
import { getDailySummary } from '../services/macrosService'
import { checkProfileComplete } from '../services/registerService'
import { useAuth } from './AuthContext'

const MacrosContext = createContext()

export function MacrosProvider({ children }) {
  const { token, profileState } = useAuth()
  const [summary, setSummary] = useState(null)

  const refreshMacros = useCallback(async () => {
    try {
      const { data } = await getDailySummary()
      setSummary({
        caloriasObjetivo:   data.caloriasObjetivo,
        caloriasConsumidas: data.caloriasConsumidas,
        caloriasRestantes:  data.caloriasRestantes,
        macrosObjetivo:     data.macrosObjetivo,
        macrosConsumidos:   data.macrosConsumidos,
        macrosRestantes:    data.macrosRestantes,
      })
    } catch (err) {
      // Si no está autorizado (401), ignoramos silenciosamente
      if (err.response?.status !== 401) {
        console.error('Error fetching macros:', err)
      }
    }
  }, [])

  useEffect(() => {
    // 1️⃣ Si no hay token, no hacemos nada
    if (!token) return

    // 2️⃣ Si ya tenemos perfil completo, refrescamos una sola vez
    if (profileState?.perfilCompleto) {
      refreshMacros()
      return
    }

    // 3️⃣ Si no está completo, montamos el intervalo
    let intervalId

    const waitForComplete = async () => {
      try {
        const completo = await checkProfileComplete()
        if (completo) {
          clearInterval(intervalId)
          refreshMacros()
        }
      } catch (err) {
        // Ignoramos 401 de "no autenticado"
        if (err.response?.status !== 401) {
          console.error('Error checking profile completeness:', err)
        }
      }
    }

    // Lo lanzamos de inicio y luego cada 5s
    waitForComplete()
    intervalId = setInterval(waitForComplete, 5000)

    return () => clearInterval(intervalId)
  }, [token, profileState?.perfilCompleto, refreshMacros])

  return (
    <MacrosContext.Provider value={{ summary, refreshMacros }}>
      {children}
    </MacrosContext.Provider>
  )
}

export function useMacros() {
  return useContext(MacrosContext)
}