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
    return <LoadingSpinner />
  }

  const needsWizard = !!token && !profileState?.perfilCompleto

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>

        {/* 1️⃣ Si NO hay token → registro/login */}
        {!token && (
          <RootStack.Screen
            name="Auth"
            component={AuthNavigator}
          />
        )}

        {/* 2️⃣ Si hay token pero NO perfil completo → onboarding */}
        {token && needsWizard && (
          <RootStack.Screen
            name="Wizard"
            component={ProfileWizardStack}
          />
        )}

        {/* 3️⃣ Si hay token Y perfil completo → app principal */}
        {token && !needsWizard && (
          <RootStack.Screen
            name="Main"
            component={MainStack}
          />
        )}

      </RootStack.Navigator>
    </NavigationContainer>
  )
}