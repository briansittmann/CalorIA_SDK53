// src/screens/profileScreens/ActivityScreen.js
import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import Toast from 'react-native-toast-message'
import CustomButton from '../../components/CustomButton'
import { updateActivity, fetchFullProfile, recalcMetas } from '../../services/registerService'
import { useAuth } from '../../context/AuthContext'
import { COLORS } from '../../theme/color'
import caloriaEntrenando from '../../../assets/images/caloriaEntrenando.png'

const niveles = [
  { value: 'MUY_BAJA',  label: '🛌 Muy baja',   desc: 'Permaneces casi todo el día sentado o acostado; no realizas ejercicio.' },
  { value: 'BAJA',      label: '📚 Baja',       desc: 'Trabajo de oficina, pocas caminatas y ejercicio ligero ocasional.' },
  { value: 'MODERADA',  label: '🚶‍♂️ Moderada', desc: 'Te mueves con frecuencia y entrenas 3-4 veces por semana.' },
  { value: 'ALTA',      label: '🏃‍♀️ Alta',    desc: 'Trabajo activo o entrenas intensamente 5-6 veces por semana.' },
  { value: 'MUY_ALTA',  label: '💥 Muy alta',   desc: 'Entrenamiento diario intenso o labor física exigente.' },
  { value: 'EXTREMA',   label: '🔥 Extrema',    desc: 'Doble sesión diaria o atleta competitivo de alto rendimiento.' },
]

export default function ActivityScreen({ navigation, route }) {
  const { profileState, refreshProfileState } = useAuth()
  const { editMode = false } = route.params || {}

  const [level, setLevel] = useState('MUY_BAJA')

  // 1️⃣ Si estamos en editMode, precargamos el nivel actual
  useEffect(() => {
    if (editMode) {
      fetchFullProfile()
        .then(p => {
          if (p.nivelActividad) setLevel(p.nivelActividad)
        })
        .catch(err => console.warn('Error cargando actividad para editar:', err))
    }
  }, [editMode])

  // 2️⃣ Guard: en onboarding salta si ya completó
  useEffect(() => {
    if (!editMode && profileState?.actividadCompleta) {
      navigation.replace('Goal')
    }
  }, [editMode, profileState?.actividadCompleta, navigation])

  const onSubmit = async () => {
    try {
      await updateActivity({ nivelActividad: level })
      Toast.show({ type:'success', text1:'💪 Nivel guardado' })
      if (editMode) {
      // en edición: recalcular macros y cerrar modal
      await recalcMetas()
      navigation.goBack()
    } else {
      await refreshProfileState() }
      // y el useEffect anterior hará el replace si aplica
    } catch (err) {
      console.error('Error al guardar nivel de actividad:', err)
      Toast.show({ type:'error', text1:'Error al guardar actividad' })
    }
  }

  const currentDesc = niveles.find(n => n.value === level)?.desc ?? ''

  return (
    <View style={styles.container}>
      <Image source={caloriaEntrenando} style={styles.image} />

      <Text style={styles.title}>Nivel de actividad</Text>
      <Text style={styles.subtitle}>
        Selecciona la opción que mejor describa tu día a día:
      </Text>

      <Picker
        selectedValue={level}
        onValueChange={setLevel}
        style={styles.picker}
        dropdownIconColor={COLORS.text}
      >
        {niveles.map(n => (
          <Picker.Item
            key={n.value}
            label={n.label}
            value={n.value}
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
    width: 200,
    height: 200,
    opacity: 0.9,
    alignSelf: 'center',
    marginBottom: 24,
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