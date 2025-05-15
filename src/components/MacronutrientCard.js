// components/MacronutrientCard.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AnimatedBar      from './AnimatedBar';
import CircleFillWave   from './CircleFillWave';
import { COLORS }       from '../theme/color';

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
}) {
  /* progresos (0-1) */
  const progressCarbs   = carbsConsumed   / carbsTarget;
  const progressProtein = proteinConsumed / proteinTarget;
  const progressFats    = fatsConsumed    / fatsTarget;
  const progressTotal   = consumedCalories / totalCalories;

  /* si cambian las kcal actualizamos el círculo */
  const [progress, setProgress] = useState(progressTotal);
  useEffect(() => setProgress(progressTotal), [progressTotal]);

  return (
    <View style={styles.cardContainer}>
      {/* cabecera */}
      <View style={styles.progressContainer}>
        <Text style={styles.caloriasText}>{consumedCalories}</Text>
        <Text style={styles.consumidasText}>Consumidas</Text>
      </View>

      /* círculo con agua (key = animationKey reinicia cuando vuelves al tab) */
      <View style={styles.circleProgressContainer}>
        <CircleFillWave
          key={animationKey}
          progress={progress}
          size={200}
          baseColor={COLORS.primaryBlue}
          fillColor={COLORS.secondaryBlue}
          waveSpeed={8000}
        >
          <Text style={styles.centerNumber}>
            {totalCalories - consumedCalories}
          </Text>
          <Text style={styles.centerLabel}>restantes</Text>
        </CircleFillWave>
      </View>

      {/* barras de macronutrientes */}
      <View style={styles.macronutrientsContainer}>
        <View style={styles.macronutrientRow}>
          <Text style={styles.macronutrientText}>Carbohidratos</Text>
          <Text style={styles.macronutrientText}>Proteínas</Text>
          <Text style={styles.macronutrientText}>Grasas</Text>
        </View>

        <View style={styles.progressBarRow}>
          <AnimatedBar value={progressCarbs}   animationKey={animationKey} />
          <AnimatedBar value={progressProtein} animationKey={animationKey} />
          <AnimatedBar value={progressFats}    animationKey={animationKey} />
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

/* ───────── estilos ───────── */
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.cardBackground,
    padding: 10,
    paddingTop: 40,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: 372,
    // height: 361,        // ⇠ quítalo si prefieres que se ajuste al contenido
    margin: 5,
  },
  progressContainer: { marginBottom: 20, alignItems: 'center' },
  caloriasText:      { fontSize: 25, fontWeight: 'bold', color: COLORS.text },
  consumidasText:    { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  circleProgressContainer: { alignItems: 'center', marginBottom: 20 },
  centerNumber:      { fontSize: 32, fontWeight: 'bold', color: COLORS.text },
  centerLabel:       { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  macronutrientsContainer: { marginBottom: 20 },
  macronutrientRow:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  macronutrientText: { fontSize: 15, fontWeight: 'bold', color: COLORS.text, width: '30%', textAlign: 'center' },
  macronutrientValue:{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, width: '30%', textAlign: 'center' },
  progressBarRow:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
});