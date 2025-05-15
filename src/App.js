// src/App.js
import React from 'react'
import { LogBox } from 'react-native'
import { AuthProvider } from './context/AuthContext'
import { MacrosProvider } from './context/MacrosContext'
import AppNavigator     from './navigation/AppNavigator'

LogBox.ignoreLogs([
  'Text strings must be rendered within a <Text> component'
])

export default function App() {
  return (
    <AuthProvider>
      <MacrosProvider>
        <AppNavigator />
      </MacrosProvider>
    </AuthProvider>
  )
}