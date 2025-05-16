import React, { useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import Toast from 'react-native-toast-message'

import CustomButton from '../../components/CustomButton'
import { updateActivity, fetchProfileState } from '../../services/registerService'
import { useAuth } from '../../context/AuthContext'
import { COLORS } from '../../theme/color'

// Import de la imagen
import caloriaEntrenando from '../../../assets/images/caloriaEntrenando.png'

/* Opciones ⇢ etiqueta breve y descripción larga */
const niveles = [
  {
    value: 'MUY_BAJA',
    label: '🛌 Muy baja',
    desc: 'Permaneces casi todo el día sentado o acostado; no realizas ejercicio.',
  },
  {
    value: 'BAJA',
    label: '📚 Baja',
    desc: 'Trabajo de oficina, pocas caminatas y ejercicio ligero ocasional.',
  },
  {
    value: 'MODERADA',
    label: '🚶‍♂️ Moderada',
    desc: 'Te mueves con frecuencia y entrenas 3-4 veces por semana.',
  },
  {
    value: 'ALTA',
    label: '🏃‍♀️ Alta',
    desc: 'Trabajo activo o entrenas intensamente 5-6 veces por semana.',
  },
  {
    value: 'MUY_ALTA',
    label: '💥 Muy alta',
    desc: 'Entrenamiento diario intenso o labor física exigente.',
  },
  {
    value: 'EXTREMA',
    label: '🔥 Extrema',
    desc: 'Doble sesión diaria o atleta competitivo de alto rendimiento.',
  },
]

export default function ActivityScreen({ navigation }) {
  const { setState } = useAuth()
  const [level, setLevel] = useState('MUY_BAJA')

  const onSubmit = async () => {
    try {
      await updateActivity({ nivelActividad: level })
      Toast.show({ type: 'success', text1: '💪 Nivel de actividad guardado' })
      const perfilActualizado = await fetchProfileState()
      setState(perfilActualizado)
      navigation.replace('Goal')
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error al guardar nivel de actividad' })
      console.error(error)
    }
  }

  /* descripción actual según la opción seleccionada */
  const currentDesc = niveles.find(n => n.value === level)?.desc ?? ''

  return (
    <View style={styles.container}>
      {/* Imagen arriba del título */}
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
          <Picker.Item key={n.value} label={n.label} value={n.value} />
        ))}
      </Picker>

      {/* descripción dinámica */}
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
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  picker: {
    marginBottom: 12,
    color: COLORS.text,
  },
  desc: {
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
})