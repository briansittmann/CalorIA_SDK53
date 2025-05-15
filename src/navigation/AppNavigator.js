// src/navigation/AppNavigator.js
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import AuthNavigator from './AuthNavigator'
import MainNavigator from './MainNavigator'
import AddFoodModal from '../screens/AddFoodModal'
import BasicModal from '../screens/profileScreens/BasicModal'
import GoalModal from '../screens/profileScreens/GoalModal'
import ActivityModal from '../screens/profileScreens/ActivityModal'
import PreferencesModal from '../screens/profileScreens/PreferencesModal'
import GenerateRecipeModal from '../screens/GenerateRecipeModal'

const RootStack = createNativeStackNavigator()

export default function AppNavigator() {
  const { token, loading } = useAuth()

  // Mientras recuperamos el token de AsyncStorage mostramos el spinner
  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {token == null ? (
          // Usuario no autenticado
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          // Usuario autenticado
          <>
            <RootStack.Screen name="Main" component={MainNavigator} />
            <RootStack.Screen
              name="AddFoodModal"
              component={AddFoodModal}
              options={{
                presentation: 'modal',
                animation:    'slide_from_bottom',
              }}
            />
            <RootStack.Screen
              name="GenerateRecipes"
              component={GenerateRecipeModal}
              options={{
                presentation: 'modal',
                animation:    'slide_from_bottom',
              }}
            />
            <RootStack.Screen name="BasicProfile" component={BasicModal} options={{ presentation:'modal' ,animation:    'slide_from_bottom',}} />
            <RootStack.Screen name="ActivityProfile" component={ActivityModal} options={{ presentation:'modal',animation:    'slide_from_bottom', }} />
            <RootStack.Screen name="GoalProfile" component={GoalModal} options={{ presentation:'modal',animation:    'slide_from_bottom', }} />
            <RootStack.Screen name="PreferencesProfile" component={PreferencesModal} options={{ presentation:'modal',animation:    'slide_from_bottom', }} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  )
}