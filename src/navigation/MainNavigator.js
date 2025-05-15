// src/navigation/MainNavigator.js
import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Feather } from '@expo/vector-icons'

import HomeScreen      from '../screens/HomeScreen'
import DiaryScreen     from '../screens/DiaryScreen'
import RecipesScreen   from '../screens/RecipesScreen'
import ProfileScreen   from '../screens/ProfileScreen'

import { COLORS } from '../theme/color'

const Tab = createBottomTabNavigator()

export default function MainNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        headerShown: true,
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: COLORS.background },

        tabBarActiveTintColor: COLORS.text,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 70,
          backgroundColor: COLORS.primaryRed,
          borderTopWidth: 0,
        },
        // Ajustes para centrar verticalmente
        tabBarIconStyle: {
          marginTop: 8,        // desplaza el icono hacia abajo
        },
        tabBarLabelStyle: {
          marginBottom: 6,     // un poco de separación etiqueta-icono
        },
        tabBarItemStyle: {
          paddingVertical: 0,  // quita padding extra
        },

        tabBarIcon: ({ color, size }) => {
          let iconName
          if (route.name === 'Inicio') iconName = 'home'
          else if (route.name === 'Diario') iconName = 'book-open'
          else if (route.name === 'Recetas') iconName = 'book'
          else if (route.name === 'Perfil') iconName = 'user'
          else iconName = 'circle'

          return <Feather name={iconName} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          headerTitle: () => (
            <Image
              source={require('../../assets/images/logo-text.png')}
              style={styles.logo}
            />
          ),
        }}
      />
      <Tab.Screen name="Diario"   component={DiaryScreen}   />
      <Tab.Screen
          name="Recetas"
          component={RecipesScreen}
          options={{
            headerTitle: 'Mis recetas',
            headerTitleStyle: {
              color: COLORS.text,
              fontWeight: 'bold',
              fontSize: 20,
            },
          }}
/>
      <Tab.Screen name="Perfil"   component={ProfileScreen} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  logo: {
    width: 130,
    height: 40,
    resizeMode: 'contain',
  },
})