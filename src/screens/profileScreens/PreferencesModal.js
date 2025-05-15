// src/profileScreens/PreferencesModal.js
import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native'
import CustomButton from '../../components/CustomButton'
import { updatePreferences } from '../../services/registerService'

export default function PreferencesModal({ navigation }) {
  const [preferencias, setPreferencias] = useState('')
  const [alergias, setAlergias]         = useState('')

  const onSubmit = async () => {
    try {
      // convertimos strings separados por comas en arrays
      const prefs = preferencias.split(',').map(s=>s.trim()).filter(Boolean)
      const alerg = alergias.split(',').map(s=>s.trim()).filter(Boolean)
      await updatePreferences({ preferencias: prefs, alergias: alerg })
      // fin del onboarding: volvemos al main
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] })
    } catch (err) {
      Alert.alert('Error', err.message)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferencias y alergias</Text>

      <TextInput
        style={styles.input}
        placeholder="Preferencias (p.ej. pollo, quinoa)"
        value={preferencias}
        onChangeText={setPreferencias}
      />
      <TextInput
        style={styles.input}
        placeholder="Alergias (p.ej. maní, gluten)"
        value={alergias}
        onChangeText={setAlergias}
      />

      <CustomButton label="Finalizar" onPress={onSubmit} colorType="blue" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, justifyContent:'center', backgroundColor:'#fff' },
  title:     { fontSize:24, fontWeight:'bold', marginBottom:20, textAlign:'center' },
  input:     { borderWidth:1, borderColor:'#ccc', borderRadius:6, padding:10, marginBottom:12 }
})