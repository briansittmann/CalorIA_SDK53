// src/navigation/MainStack.js
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import MainNavigator      from './MainNavigator'      // tus BottomTabs
import AddFoodModal       from '../screens/AddFoodModal'
import GenerateRecipeModal from '../screens/GenerateRecipeModal'
import ProfileWizardStack from './ProfileWizardStack' // editable desde “Perfil”

const Stack = createNativeStackNavigator()

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Tus pestañas */}
      <Stack.Screen name="Tabs" component={MainNavigator} />

      {/* Modal para añadir comida (fondo opaco, ocupa mitad) */}
      <Stack.Screen
        name="AddFoodModal"
        component={AddFoodModal}
        options={{ presentation: 'modal' }}
      />

      {/* Modal para el wizard */}
      <Stack.Screen
        name="Wizard"
        component={ProfileWizardStack}
        options={{ presentation: 'modal' }}
      />

        <Stack.Screen
        name="GenerateRecipeModal"
        component={GenerateRecipeModal}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  )
}