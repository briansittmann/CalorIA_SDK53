// src/navigation/AppNavigator.js
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { useAuth }    from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

import AuthNavigator      from './AuthNavigator'
import MainNavigator      from './MainNavigator'
import ProfileWizardStack from './ProfileWizardStack'

const RootStack = createNativeStackNavigator()

export default function AppNavigator() {
  const { token, loading, profileState } = useAuth()

  // 1️⃣ Mientras carga token + perfil
  useEffect(() => {
    console.log('[AppNavigator] loading=', loading,
                ' token=', token,
                ' profileState=', profileState)
  }, [loading, token, profileState])

  if (loading) return <LoadingSpinner />

  // 2️⃣ ¿Necesita wizard?
  const needsWizard = token && !profileState?.perfilCompleto
  console.log('[AppNavigator] needsWizard=', needsWizard)

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>

        {!token && <RootStack.Screen name="Auth" component={AuthNavigator} />}
        {token && needsWizard && <RootStack.Screen name="Wizard" component={ProfileWizardStack} />}
        {token && !needsWizard && <RootStack.Screen name="Main" component={MainNavigator} />}

      </RootStack.Navigator>
    </NavigationContainer>
  )
}