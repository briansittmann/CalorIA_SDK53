// src/navigation/ProfileWizardStack.js
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import BasicScreen        from '../screens/profileScreens/BasicScreen'
import ActivityScreen     from '../screens/profileScreens/ActivityScreen'
import GoalScreen         from '../screens/profileScreens/GoalScreen'
import PreferencesScreen  from '../screens/profileScreens/PreferencesScreen'

const Stack = createNativeStackNavigator()

export default function ProfileWizardStack () {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'modal'
      }}
    >
      <Stack.Screen name="Basic"     component={BasicScreen}/>
      <Stack.Screen name="Activity"  component={ActivityScreen}/>
      <Stack.Screen name="Goal"      component={GoalScreen}/>
      <Stack.Screen name="Preference" component={PreferencesScreen}/>
    </Stack.Navigator>
  )
}