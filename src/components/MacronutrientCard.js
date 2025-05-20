// components/MacronutrientCard.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AnimatedBar from './AnimatedBar';
import CircleFillWave from './CircleFillWave';
import { COLORS } from '../theme/color';

export default function MacronutrientCard({
  totalCalories,
  consumedCalories,
  carbsTarget,
  proteinTarget,
  fatsTarget,
  carbsConsumed,
  proteinConsumed,
  fatsConsumed,
  animationKey = 1,
  lateralKey = 1
}) {
  const progressCarbs = carbsConsumed / carbsTarget;
  const progressProtein = proteinConsumed / proteinTarget;
  const progressFats = fatsConsumed / fatsTarget;
  const progressTotal = consumedCalories / totalCalories;

  const [progress, setProgress] = useState(progressTotal);

  // Claves independientes para animaciones separadas
  const [waveKey, setWaveKey] = useState(0);
  const [barsKey, setBarsKey] = useState(0);

useEffect(() => {
  setProgress(progressTotal);
}, [progressTotal]);

useEffect(() => {
  setProgress(progressTotal);
}, [progressTotal]);

useEffect(() => {
  setBarsKey(animationKey);      // se reinicia siempre con la pantalla
  setWaveKey(animationKey);      // 🔥 también se reinicia con animKey
}, [animationKey]);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.progressContainer}>
        <Text style={styles.caloriasText}>{consumedCalories}</Text>
        <Text style={styles.consumidasText}>Consumidas</Text>
      </View>

      <View style={styles.circleProgressContainer}>
        <CircleFillWave
          verticalAnimationKey={animationKey} // para subida de agua
          lateralAnimationKey={lateralKey}
          progress={progress}
          size={200}
          baseColor={COLORS.primaryBlue}
          fillColor={COLORS.secondaryBlue}
          waveSpeed={7000}
        >
          <Text style={styles.centerNumber}>{totalCalories - consumedCalories}</Text>
          <Text style={styles.centerLabel}>restantes</Text>
        </CircleFillWave>
      </View>

      <View style={styles.macronutrientsContainer}>
        <View style={styles.macronutrientRow}>
          <Text style={styles.macronutrientText}>Carbohidratos</Text>
          <Text style={styles.macronutrientText}>Proteínas</Text>
          <Text style={styles.macronutrientText}>Grasas</Text>
        </View>

        <View style={styles.progressBarRow}>
          <AnimatedBar value={progressCarbs} animationKey={barsKey} />
          <AnimatedBar value={progressProtein} animationKey={barsKey} />
          <AnimatedBar value={progressFats} animationKey={barsKey} />
        </View>

        <View style={styles.macronutrientRow}>
          <Text style={styles.macronutrientValue}>{carbsConsumed}/{carbsTarget}g</Text>
          <Text style={styles.macronutrientValue}>{proteinConsumed}/{proteinTarget}g</Text>
          <Text style={styles.macronutrientValue}>{fatsConsumed}/{fatsTarget}g</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 7,
    paddingTop:15,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: 372,
  },
  progressContainer: { marginBottom: 20, alignItems: 'center' },
  caloriasText: { fontSize: 25, fontWeight: 'bold', color: COLORS.text },
  consumidasText: { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  circleProgressContainer: { alignItems: 'center', marginBottom: 20 },
  centerNumber: { fontSize: 32, fontWeight: 'bold', color: COLORS.text },
  centerLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  macronutrientsContainer: { marginBottom: 20 },
  macronutrientRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  macronutrientText: { fontSize: 15, fontWeight: 'bold', color: COLORS.text, width: '30%', textAlign: 'center' },
  macronutrientValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, width: '30%', textAlign: 'center' },
  progressBarRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
});
