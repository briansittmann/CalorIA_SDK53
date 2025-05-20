// src/screens/HomeScreen.js
import React, { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import {
  View,
  ScrollView, Image,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native'
import MacronutrientCard from '../components/MacronutrientCard'
import AddButton         from '../components/AddButton'
import { COLORS }        from '../theme/color'
import { useMacros }     from '../context/MacrosContext'

export default function HomeScreen({ navigation }) {
  const { summary, refreshMacros } = useMacros()
  const [animKey, setAnimKey]      = useState(1)
  const [waveKey, setWaveKey] = useState(1)


useFocusEffect(useCallback(() => {
  setAnimKey(k => k + 1)   // reinicia progreso vertical y barras
  setWaveKey(w => w + 1)   // 🔁 reinicia la animación lateral
  refreshMacros()
}, [refreshMacros]))


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
        <Image
                      source={require('../../assets/images/logo-icon.png')}
                      style={styles.icon}
         />
        <MacronutrientCard
          totalCalories={caloriasObjetivo}
          consumedCalories={caloriasConsumidas}
          carbsTarget={macrosObjetivo.carbohidratosG}
          proteinTarget={macrosObjetivo.proteinasG}
          fatsTarget={macrosObjetivo.grasasG}
          carbsConsumed={macrosConsumidos.carbohidratosG}
          proteinConsumed={macrosConsumidos.proteinasG}
          fatsConsumed={macrosConsumidos.grasasG}
          animationKey={animKey}
          lateralKey={waveKey} 
        />

        <AddButton
          onPress={() => navigation.navigate('AddFoodModal')}
          style={styles.addButton}
          size={85}
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
    alignItems:      'center',
  },
  icon:         { width: 140, height: 100, marginTop:-6, marginBottom: -5 },
  scrollContainer: {
    alignItems:    'center',
    paddingBottom: 10,
  },
  addButton: {
    marginTop:    25,
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