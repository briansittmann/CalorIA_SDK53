// src/screens/profileScreens/GoalScreen.js
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import Toast from 'react-native-toast-message'

import CustomButton from '../../components/CustomButton'
import { updateGoal, recalcMetas } from '../../services/registerService'
import { useAuth } from '../../context/AuthContext'
import { COLORS } from '../../theme/color'

/* Opciones del enum ObjetivoNutricional */
const objetivos = [
  { value: 'CUT_LIGERO',    label: '📉 Déficit suave',    desc: '-10 % menos calorías para bajar grasa lentamente.' },
  { value: 'CUT_MEDIO',     label: '📉 Déficit moderado',  desc: '-20 % menos. Ritmo medio de pérdida de grasa.' },
  { value: 'CUT_AGRESIVO',  label: '⚠️ Déficit agresivo', desc: '-25 % menos. Pérdida rápida; solo a corto plazo.' },
  { value: 'MANTENER',      label: '⚖️ Mantener peso',    desc: 'Calorías iguales a tu gasto diario para sostener tu peso.' },
  { value: 'BULK_CONSERVADOR', label: '🍚 Superávit ligero', desc: '+5 % calorías. Ganancia muscular lenta con poca grasa.' },
  { value: 'BULK_ESTANDAR',  label: '💪 Superávit moderado', desc: '+10 %. Crecimiento clásico; algo más de grasa.' },
  { value: 'BULK_AGRESIVO', label: '🔥 Superávit agresivo', desc: '+15 %. Máximo crecimiento muscular; más grasa.' }
]

export default function GoalScreen({ navigation, route }) {
  const { editMode = false } = route.params || {}
  const { profileState, refreshProfileState } = useAuth()
  // Inicializamos con lo ya guardado, si existe
  const [goal, setGoal] = useState(profileState?.objetivo || 'MANTENER')

  // En onboarding, si ya estaba completo, saltar al siguiente paso
  useEffect(() => {
    if (!editMode && profileState?.objetivoCompleto) {
      navigation.replace('Preference')
    }
  }, [editMode, profileState?.objetivoCompleto])

 const onSubmit = async () => {
  try {
    // 1️⃣ Guardar en backend
    await updateGoal({ objetivo: goal })
    Toast.show({ type: 'success', text1: '🎯 Objetivo guardado' })

    if (editMode) {
      // edición: recalcular macros y refrescar estado
      await recalcMetas()
      await refreshProfileState()

      // cerrar la modal: subimos un nivel (ProfileWizardStack → MainStack)
      navigation.getParent()?.goBack()
      return
    }

    // 2️⃣ Flujo normal: refrescar estado
    await refreshProfileState()
    // el useEffect de más arriba hará navigation.replace('Preference') si aplica

  } catch (err) {
    console.error('Error en GoalScreen onSubmit:', err)
    Toast.show({ type: 'error', text1: 'Error al guardar objetivo' })
  }
}
  const currentDesc = objetivos.find(o => o.value === goal)?.desc ?? ''

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/objetivo.png')}
        style={styles.image}
      />
      <Text style={styles.title}>Objetivo nutricional</Text>
      <Text style={styles.subtitle}>
        Elige la opción que mejor se ajuste a tu meta:
      </Text>

      <Picker
        selectedValue={goal}
        onValueChange={setGoal}
        style={styles.picker}
        dropdownIconColor={COLORS.text}
      >
        {objetivos.map(o => (
          <Picker.Item
            key={o.value}
            label={o.label}
            value={o.value}
            color={COLORS.text}
          />
        ))}
      </Picker>

      <Text style={styles.desc}>{currentDesc}</Text>

      <CustomButton label="Continuar" onPress={onSubmit} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: COLORS.background
  },
  image: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    marginBottom: 16,
    resizeMode: 'contain'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    color: COLORS.text
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666'
  },
  picker: {
    marginBottom: 12,
    color: COLORS.text
  },
  desc: {
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 32,
    textAlign: 'center'
  }
})