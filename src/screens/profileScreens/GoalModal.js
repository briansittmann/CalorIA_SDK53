// src/profileScreens/GoalModal.js
import React, { useState } from 'react'
import { View, Text, Picker, StyleSheet, Alert } from 'react-native'
import CustomButton from '../../components/CustomButton'
import { updateGoal } from '../../services/registerService'

export default function GoalModal({ navigation }) {
  const [objetivo, setObjetivo] = useState('')

  const onSubmit = async () => {
    if (!objetivo) return Alert.alert('Atención','Selecciona un objetivo')
    try {
      await updateGoal({ objetivo })
      navigation.replace('PreferencesProfile')
    } catch (err) {
      Alert.alert('Error', err.message)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Objetivo nutricional</Text>

      <Picker
        selectedValue={objetivo}
        onValueChange={setObjetivo}
        style={styles.picker}
      >
        <Picker.Item label="-- elige uno --" value="" />
        <Picker.Item label="Cut ligero"       value="CUT_LIGERO" />
        <Picker.Item label="Cut medio"         value="CUT_MEDIO" />
        <Picker.Item label="Cut agresivo"      value="CUT_AGRESIVO" />
        <Picker.Item label="Bulk conservador"  value="BULK_CONSERVADOR" />
        <Picker.Item label="Bulk estándar"     value="BULK_ESTANDAR" />
        <Picker.Item label="Bulk agresivo"     value="BULK_AGRESIVO" />
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