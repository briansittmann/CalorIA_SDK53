// src/screens/profileScreens/BasicScreen.js
import React, { useState, useEffect } from 'react'
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback,
  Keyboard, TouchableOpacity
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import Toast from 'react-native-toast-message'

import CustomButton from '../../components/CustomButton'
import { updateBasics } from '../../services/registerService'
import { useAuth } from '../../context/AuthContext'
import { COLORS } from '../../theme/color'

export default function BasicScreen({ navigation }) {
  const { profileState, refreshProfileState } = useAuth()

  const initHora = '07:00'
  const toDate  = h => new Date(`1970-01-01T${h}:00`)

  const [form, setForm] = useState({
    nombre: '', edad: '', sexo: 'M',
    alturaCm: '', pesoKg: '', horaInicioDia: initHora
  })
  const [hora, setHora] = useState(toDate(initHora))

  // 1️⃣ Guard: si ya completó los básicos, saltar al siguiente paso
  useEffect(() => {
    console.log('[BasicScreen] basicosCompletos=', profileState?.basicosCompletos)
    if (profileState?.basicosCompletos) {
      console.log('[BasicScreen] saltando a Activity')
      navigation.replace('Activity')
    }
  }, [profileState?.basicosCompletos, navigation])

  const validate = () => {
    const faltan = []
    if (!form.nombre.trim())           faltan.push('nombre')
    if (Number(form.edad)   <= 0)      faltan.push('edad')
    if (Number(form.alturaCm) <= 0)    faltan.push('altura')
    if (Number(form.pesoKg)   <= 0)    faltan.push('peso')
    return faltan
  }

  const submit = async () => {
    const faltan = validate()
    if (faltan.length) {
      Toast.show({
        type: 'error',
        text1: '❗ Completa los campos faltantes',
        text2: faltan.join(', ')
      })
      return
    }

    try {
      await updateBasics({
        nombre:        form.nombre,
        edad:          Number(form.edad),
        sexo:          form.sexo,
        alturaCm:      Number(form.alturaCm),
        pesoKg:        Number(form.pesoKg),
        horaInicioDia: form.horaInicioDia
      })
      Toast.show({ type: 'success', text1: '🎉 Datos básicos guardados' })

      // 2️⃣ Refrescar el contexto global
      await refreshProfileState()
      // 3️⃣ El `useEffect` de más arriba detectará basicosCompletos y hará replace
    } catch (err) {
      console.error('Error al guardar datos básicos:', err)
      Toast.show({ type: 'error', text1: 'Error al guardar datos básicos' })
    }
  }

  const onTimeChange = (_, date) => {
    if (!date) return
    setHora(date)
    const h = String(date.getHours()).padStart(2, '0')
    const m = String(date.getMinutes()).padStart(2, '0')
    setForm({ ...form, horaInicioDia: `${h}:${m}` })
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>📝 Datos básicos</Text>
          <Text style={styles.subtitle}>¡Completemos tu perfil!</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor={COLORS.text}
            value={form.nombre}
            onChangeText={v => setForm({ ...form, nombre: v })}
          />
          <TextInput
            style={styles.input}
            placeholder="Edad"
            placeholderTextColor={COLORS.text}
            keyboardType="numeric"
            value={form.edad}
            onChangeText={v => setForm({ ...form, edad: v })}
          />

          <View style={styles.selector}>
            {['M','F'].map(g => (
              <TouchableOpacity
                key={g}
                style={[styles.pill, form.sexo === g && styles.pillActive]}
                onPress={() => setForm({ ...form, sexo: g })}
              >
                <Text style={[
                  styles.pillText,
                  form.sexo === g && styles.pillTextActive
                ]}>
                  {g === 'M' ? 'Masculino ♂️' : 'Femenino ♀️'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Altura (cm)"
            placeholderTextColor={COLORS.text}
            keyboardType="numeric"
            value={form.alturaCm}
            onChangeText={v =>  {const soloDigitos = v.replace(/\D/g, '')
              setForm({ ...form, alturaCm: soloDigitos })}}
          />
          <TextInput
            style={styles.input}
            placeholder="Peso (kg)"
            placeholderTextColor={COLORS.text}
            keyboardType="numeric"
            value={form.pesoKg}
            onChangeText={v => setForm({ ...form, pesoKg: v })}
          />

          <View style={styles.timeWrapper}>
            <Text style={styles.timeQuestion}>¿A qué hora empiezas tu día? ⏰</Text>
            <DateTimePicker
              mode="time"
              value={hora}
              display={Platform.OS==='ios' ? 'spinner' : 'default'}
              onChange={onTimeChange}
              style={Platform.OS==='ios' && styles.timeIOS}
            />
          </View>

          <CustomButton label="Continuar" onPress={submit} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  scroll:      { padding:24, paddingBottom:48, flexGrow:1, justifyContent:'center' },
  title:       { fontSize:28, fontWeight:'bold', textAlign:'center', marginBottom:4 },
  subtitle:    { textAlign:'center', marginBottom:24, color:'#666' },
  input:       { borderWidth:1, borderColor:'#ccc', padding:10, borderRadius:8, marginBottom:12, color:COLORS.text },
  selector:    { flexDirection:'row', justifyContent:'center', marginBottom:20 },
  pill:        { borderWidth:1, borderColor:COLORS.secondaryBlue, borderRadius:20, paddingVertical:8, paddingHorizontal:20, marginHorizontal:8 },
  pillActive:  { backgroundColor:COLORS.secondaryBlue },
  pillText:    { fontSize:17, color:COLORS.secondaryBlue, lineHeight:20 },
  pillTextActive:{ color:'#fff' },
  timeWrapper: { alignItems:'center', marginBottom:24 },
  timeQuestion:{ fontSize:18, fontWeight:'600', color:COLORS.text, marginBottom:8 },
  timeIOS:     { transform:[{ scale:0.85 }], alignSelf:'center' }
})