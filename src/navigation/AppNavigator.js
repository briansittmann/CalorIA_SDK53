import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

import AuthNavigator from './AuthNavigator'
import MainNavigator from './MainNavigator'
import ProfileWizardStack from './ProfileWizardStack'

/* Modales globales */
import AddFoodModal from '../screens/AddFoodModal'
import GenerateRecipeModal from '../screens/GenerateRecipeModal'

const RootStack = createNativeStackNavigator()

export default function AppNavigator() {
  const { token, loading, profileComplete } = useAuth()

  // Mientras carga el token / estado de perfil...
  if (loading) {
    return <LoadingSpinner />
  }

  // Si hay token pero el perfil NO está completo
  const needsWizard = token && !profileComplete

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>

        {/* 1️⃣ No hay token → Auth */}
        {!token && (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}

        {/* 2️⃣ Hay token pero falta completar perfil → Wizard */}
        {token && needsWizard && (
          <RootStack.Screen name="Wizard" component={ProfileWizardStack} />
        )}

        {/* 3️⃣ Token + perfil completo → App principal + modales */}
        {token && !needsWizard && (
          <>
            <RootStack.Screen name="Main" component={MainNavigator} />

            <RootStack.Screen
              name="AddFoodModal"
              component={AddFoodModal}
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />

            <RootStack.Screen
              name="GenerateRecipes"
              component={GenerateRecipeModal}
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />

            {/* Puedes reutilizar el wizard como modal de edición */}
            <RootStack.Screen
              name="ProfileWizard"
              component={ProfileWizardStack}
              options={{ presentation: 'modal', animation: 'slide_from_right' }}
            />
          </>
        )}

      </RootStack.Navigator>
    </NavigationContainer>
  )
}