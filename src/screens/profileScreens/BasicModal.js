// src/profileScreens/BasicModal.js
import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native'
import CustomButton from '../../components/CustomButton'
import { updateBasics } from '../../services/registerService'

export default function BasicModal({ navigation }) {
  const [nombre, setNombre] = useState('')
  const [edad, setEdad]     = useState('')
  const [sexo, setSexo]     = useState('')
  const [alturaCm, setAlturaCm] = useState('')
  const [pesoKg, setPesoKg]     = useState('')
  const [horaInicioDia, setHoraInicioDia] = useState('')

  const onSubmit = async () => {
    try {
      await updateBasics({
        nombre,
        edad: Number(edad),
        sexo,
        alturaCm: Number(alturaCm),
        pesoKg: Number(pesoKg),
        horaInicioDia,
      })
      navigation.replace('ActivityProfile')
    } catch (err) {
      Alert.alert('Error', err.message)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datos básicos</Text>

      <TextInput style={styles.input} placeholder="Nombre"   value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Edad"      value={edad} onChangeText={setEdad} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Sexo (M/F)"value={sexo} onChangeText={setSexo} />
      <TextInput style={styles.input} placeholder="Altura cm" value={alturaCm} onChangeText={setAlturaCm} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Peso kg"   value={pesoKg} onChangeText={setPesoKg} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Hora inicio (HH:mm)" value={horaInicioDia} onChangeText={setHoraInicioDia} />

      <CustomButton label="Siguiente" onPress={onSubmit} colorType="blue" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, justifyContent:'center', backgroundColor:'#fff' },
  title:     { fontSize:24, fontWeight:'bold', marginBottom:20, textAlign:'center' },
  input:     { borderWidth:1, borderColor:'#ccc', borderRadius:6, padding:10, marginBottom:12 }
})