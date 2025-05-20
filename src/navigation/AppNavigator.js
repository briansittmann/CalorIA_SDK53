// src/navigation/AppNavigator.js
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

import AuthNavigator      from './AuthNavigator'
import ProfileWizardStack from './ProfileWizardStack'
import MainStack          from './MainStack'

const RootStack = createNativeStackNavigator()

export default function AppNavigator() {
  const { token, loading, profileState } = useAuth()

  useEffect(() => {
    console.log(
      '[AppNavigator] loading=', loading,
      ' token=', token,
      ' profileState=', profileState
    )
  }, [loading, token, profileState])

  if (loading) {
    console.log('[AppNavigator] Mostrando LoadingSpinner…')
    return <LoadingSpinner />
  }

  const needsWizard = !!token && profileState !== null && !profileState.perfilCompleto

  // Loguear a dónde va a ir
  if (!token) {
    console.log('[AppNavigator] Sin token → Auth flow (Splash)')
  } else if (needsWizard) {
    console.log('[AppNavigator] Token válido pero perfil incompleto → Wizard')
  } else {
    console.log('[AppNavigator] Token válido y perfil completo → MainStack')
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!token && (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
        {token && needsWizard && (
          <RootStack.Screen name="Wizard" component={ProfileWizardStack} />
        )}
        {token && !needsWizard && (
          <RootStack.Screen name="Main" component={MainStack} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  )
}