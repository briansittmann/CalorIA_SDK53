// src/profileScreens/ActivityModal.js
import React, { useState } from 'react'
import { View, Text, Picker, StyleSheet, Alert } from 'react-native'
import CustomButton from '../../components/CustomButton'
import { updateActivity } from '../../services/registerService'

export default function ActivityModal({ navigation }) {
  const [nivelActividad, setNivelActividad] = useState('')

  const onSubmit = async () => {
    if (!nivelActividad) return Alert.alert('Atención','Selecciona tu nivel de actividad')
    try {
      await updateActivity({ nivelActividad })
      navigation.replace('GoalProfile')
    } catch (err) {
      Alert.alert('Error', err.message)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nivel de actividad</Text>

      <Picker
        selectedValue={nivelActividad}
        onValueChange={setNivelActividad}
        style={styles.picker}
      >
        <Picker.Item label="-- elige uno --" value="" />
        <Picker.Item label="Muy baja" value="MUY_BAJA" />
        <Picker.Item label="Baja"      value="BAJA" />
        <Picker.Item label="Moderada"  value="MODERADA" />
        <Picker.Item label="Alta"      value="ALTA" />
        <Picker.Item label="Muy alta"  value="MUY_ALTA" />
        <Picker.Item label="Extrema"   value="EXTREMA" />
      </Picker>

      <CustomButton label="Siguiente" onPress={onSubmit} colorType="blue" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, justifyContent:'center', backgroundColor:'#fff' },
  title:     { fontSize:24, fontWeight:'bold', marginBottom:20, textAlign:'center' },
  picker:    { marginBottom:20 }
})