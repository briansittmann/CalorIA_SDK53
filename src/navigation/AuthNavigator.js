// src/navigation/AuthNavigator.js
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import SplashScreen   from '../screens/SplashScreen'
import WelcomeScreen  from '../screens/WelcomeScreen'
import LoginScreen    from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'

const Stack = createNativeStackNavigator()

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"      // arranca en el splash
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash"   component={SplashScreen} />
      <Stack.Screen name="Welcome"  component={WelcomeScreen} />
      <Stack.Screen name="Login"    component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  )
}