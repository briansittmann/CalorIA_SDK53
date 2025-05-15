// src/context/MacrosContext.js
import React, {
    createContext,
    useState,
    useContext,
    useCallback,
    useEffect
  } from 'react'
  import { getDailySummary } from '../services/macrosService'
  
  const MacrosContext = createContext()
  
  export function MacrosProvider({ children }) {
    const [summary, setSummary] = useState(null)
  
    const refreshMacros = useCallback(async () => {
      try {
        const { data } = await getDailySummary()
        // data es tu ResumenDiaDTO
        setSummary({
          caloriasObjetivo:   data.caloriasObjetivo,
          caloriasConsumidas: data.caloriasConsumidas,
          caloriasRestantes:  data.caloriasRestantes,
          macrosObjetivo:     data.macrosObjetivo,
          macrosConsumidos:   data.macrosConsumidos,
          macrosRestantes:    data.macrosRestantes,
        })
      } catch (err) {
        console.error('Error fetching macros:', err)
      }
    }, [])
  
    // Al montar el provider, traemos una vez el resumen
    useEffect(() => {
      refreshMacros()
    }, [refreshMacros])
  
    return (
      <MacrosContext.Provider value={{ summary, refreshMacros }}>
        {children}
      </MacrosContext.Provider>
    )
  }
  
  export function useMacros() {
    return useContext(MacrosContext)
  }