import React, { useState } from 'react'
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback,
  Keyboard, TouchableOpacity
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import Toast          from 'react-native-toast-message'

import CustomButton from '../../components/CustomButton'
import { updateBasics, fetchProfileState } from '../../services/registerService'
import { useAuth } from '../../context/AuthContext'
import { COLORS }  from '../../theme/color'

export default function BasicScreen ({ navigation }) {
  const { setState } = useAuth()

  const initHora = '07:00'
  const toDate   = h => new Date(`1970-01-01T${h}:00`)

  const [form, set] = useState({
    nombre:'', edad:'', sexo:'M',
    alturaCm:'', pesoKg:'', horaInicioDia:initHora
  })
  const [hora, setHora] = useState(toDate(initHora))

  /* ---------- helper de validación ---------- */
  const validate = () => {
    const faltan = []
    if (form.nombre.trim() === '')  faltan.push('nombre')
    if (Number(form.edad)      <=0) faltan.push('edad')
    if (Number(form.alturaCm)  <=0) faltan.push('altura')
    if (Number(form.pesoKg)    <=0) faltan.push('peso')
    return faltan
  }

  /* ---------- submit ---------- */
  const submit = async () => {
    const faltan = validate()
    if (faltan.length) {
      Toast.show({
        type :'error',
        text1:'❗ Completa los campos faltantes',
        text2: faltan.join(', ')
      })
      return
    }

    await updateBasics({
      ...form,
      edad:+form.edad, alturaCm:+form.alturaCm, pesoKg:+form.pesoKg
    })
    Toast.show({ type:'success', text1:'🎉 Datos básicos guardados' })
    setState(await fetchProfileState())
    navigation.replace('Activity')
  }

  /* ---------- cambio de hora ---------- */
  const onTimeChange = (_, d) => {
    if (!d) return
    setHora(d)
    const h = d.getHours().toString().padStart(2,'0')
    const m = d.getMinutes().toString().padStart(2,'0')
    set({ ...form, horaInicioDia:`${h}:${m}` })
  }

  /* ---------- UI ---------- */
  return (
    <KeyboardAvoidingView style={{flex:1}}
      behavior={Platform.OS==='ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>📝 Datos básicos</Text>
          <Text style={styles.subtitle}>¡Completemos tu perfil!</Text>

          {/* ---------- inputs ---------- */}
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor={COLORS.text}
            value={form.nombre}
            onChangeText={v=>set({...form,nombre:v})}
          />
          <TextInput
            style={styles.input}
            placeholder="Edad"
            placeholderTextColor={COLORS.text}
            keyboardType="numeric"
            value={form.edad}
            onChangeText={v=>set({...form,edad:v})}
          />

          {/* selector sexo */}
          <View style={styles.selector}>
            {['M','F'].map(g=>(
              <TouchableOpacity
                key={g}
                style={[styles.pill, form.sexo===g && styles.pillActive]}
                onPress={()=>set({...form,sexo:g})}>
                <Text style={[
                  styles.pillText,
                  form.sexo===g && styles.pillTextActive
                ]}>
                  {g==='M' ? 'Masculino ♂️' : 'Femenino ♀️'}
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
            onChangeText={v=>set({...form,alturaCm:v})}
          />
          <TextInput
            style={styles.input}
            placeholder="Peso (kg)"
            placeholderTextColor={COLORS.text}
            keyboardType="numeric"
            value={form.pesoKg}
            onChangeText={v=>set({...form,pesoKg:v})}
          />

          {/* hora */}
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

          <CustomButton label="Continuar" onPress={submit}/>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

/* ---------- estilos ---------- */
const styles = StyleSheet.create({
  scroll:{ padding:24, paddingBottom:48, flexGrow:1, justifyContent:'center' },
  title:{ fontSize:28, fontWeight:'bold', textAlign:'center', marginBottom:4 },
  subtitle:{ textAlign:'center', marginBottom:24, color:'#666' },

  input:{ borderWidth:1, borderColor:'#ccc', padding:10,
          borderRadius:8, marginBottom:12, color:COLORS.text },

  selector:{ flexDirection:'row', justifyContent:'center', marginBottom:20 },
  pill:{ borderWidth:1, borderColor:COLORS.secondaryBlue,
         borderRadius:20, paddingVertical:8, paddingHorizontal:20,
         marginHorizontal:8 },
  pillActive:{ backgroundColor:COLORS.secondaryBlue },
  pillText:{ fontSize:17, color:COLORS.secondaryBlue, lineHeight:20 },
  pillTextActive:{ color:'#fff' },

  timeWrapper:{ alignItems:'center', marginBottom:24 },
  timeQuestion:{ fontSize:18, fontWeight:'600', color:COLORS.text, marginBottom:8 },
  timeIOS:{ transform:[{ scale:0.85 }], alignSelf:'center' }
})