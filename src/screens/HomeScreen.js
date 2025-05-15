// src/screens/HomeScreen.js
import React, { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import {
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native'
import MacronutrientCard from '../components/MacronutrientCard'
import AddButton         from '../components/AddButton'
import { COLORS }        from '../theme/color'
import { useMacros }     from '../context/MacrosContext'

export default function HomeScreen({ navigation }) {
  // ① extraemos summary en vez de macrosRestantes
  const { summary, refreshMacros } = useMacros()
  const [animKey, setAnimKey]      = useState(1)

  useFocusEffect(useCallback(() => {
    setAnimKey(k => k + 1)
    refreshMacros()
  }, [navigation,refreshMacros]))

  // ② mostramos loader mientras summary sea null
  if (!summary) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primaryRed} />
      </View>
    )
  }

  // ③ extraemos del summary los valores que necesitas
  const {
    caloriasObjetivo,
    caloriasConsumidas,
    macrosObjetivo,
    macrosConsumidos
  } = summary

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <MacronutrientCard
          totalCalories={caloriasObjetivo}
          consumedCalories={caloriasConsumidas}
          carbsTarget={macrosObjetivo.carbohidratosG}
          proteinTarget={macrosObjetivo.proteinasG}
          fatsTarget={macrosObjetivo.grasasG}
          carbsConsumed={macrosConsumidos.carbohidratosG}
          proteinConsumed={macrosConsumidos.proteinasG}
          fatsConsumed={macrosConsumidos.grasasG}
        />

        <AddButton
          onPress={() => navigation.navigate('AddFood')}
          style={styles.addButton}
          size={90}
          backgroundColor={COLORS.primaryRed}
          iconColor={COLORS.text}
        />
        <Text style={styles.addFoodText}>Añadir alimento</Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: COLORS.background,
    paddingTop:      20,
    alignItems:      'center',
  },
  scrollContainer: {
    alignItems:    'center',
    paddingBottom: 60,
  },
  addButton: {
    marginTop:    30,
    marginBottom: 10,
  },
  addFoodText: {
    fontSize:     18,
    fontWeight:   'bold',
    color:        COLORS.text,
    marginBottom: 20,
  },
  loaderContainer: {
    flex:            1,
    justifyContent:  'center',
    alignItems:      'center',
    backgroundColor: COLORS.background,
  },
})