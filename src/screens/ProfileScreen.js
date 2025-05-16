import React, { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  ActivityIndicator, TouchableOpacity
} from 'react-native'

import { fetchFullProfile } from '../services/registerService'
import { useAuth }          from '../context/AuthContext'
import CustomButton         from '../components/CustomButton'   // ⬅️ nuevo
import { COLORS }           from '../theme/color'

export default function ProfileScreen ({ navigation }) {

  const { signOut } = useAuth()
  const [perfil, setPerfil] = useState(null)

  /* cargar perfil una sola vez */
  useEffect(() => { fetchFullProfile().then(setPerfil) }, [])

  if (!perfil) {
    return <ActivityIndicator style={{ flex:1, justifyContent:'center' }}/>
  }

  const orDash = v => (v ?? '') !== '' && v !== 0 ? v : '—'

  return (
    <ScrollView contentContainerStyle={styles.scroll}>

      {/* ────────── DATOS ────────── */}
      <Section title="📝 Datos básicos"
        onEdit={() => navigation.navigate('ProfileWizard', { screen:'Basic' })}>
        <Row label="Nombre"          value={orDash(perfil.nombre)}/>
        <Row label="Edad"            value={orDash(perfil.edad)}/>
        <Row label="Sexo"            value={orDash(perfil.sexo)}/>
        <Row label="Altura"          value={orDash(perfil.alturaCm)+' cm'}/>
        <Row label="Peso"            value={orDash(perfil.pesoKg)+' kg'}/>
        <Row label="Empiezas a las"  value={orDash(perfil.horaInicioDia)}/>
      </Section>

      <Section title="🏃‍♂️ Actividad"
        onEdit={() => navigation.navigate('ProfileWizard', { screen:'Activity' })}>
        <Row value={orDash(perfil.nivelActividad)}/>
      </Section>

      <Section title="🎯 Objetivo"
        onEdit={() => navigation.navigate('ProfileWizard', { screen:'Goal' })}>
        <Row label="Tipo"      value={orDash(perfil.objetivo)}/>
        <Row label="Calorías"  value={orDash(perfil.caloriasObjetivo)}/>
        {perfil.macrosObjetivo && (
          <>
            <Row label="Proteínas"      value={perfil.macrosObjetivo.proteinasG+' g'}/>
            <Row label="Carbohidratos"  value={perfil.macrosObjetivo.carbohidratosG+' g'}/>
            <Row label="Grasas"         value={perfil.macrosObjetivo.grasasG+' g'}/>
          </>
        )}
      </Section>

      <Section title="🍽️ Preferencias"
        onEdit={() => navigation.navigate('ProfileWizard', { screen:'Preference' })}>
        <Row label="Preferencias" value={perfil.preferencias?.join(', ') || '—'}/>
        <Row label="Alergias"     value={perfil.alergias?.join(', ') || '—'}/>
      </Section>

      {/* ────────── BOTÓN CERRAR SESIÓN ────────── */}
      <View style={styles.logoutWrapper}>
        <CustomButton
          label="Cerrar sesión"
          colorType="red"
          onPress={signOut}
        />
      </View>

    </ScrollView>
  )
}

/* helpers visuales */
const Section = ({ title, children, onEdit }) => (
  <TouchableOpacity style={styles.section} onPress={onEdit}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </TouchableOpacity>
)

const Row = ({ label, value }) => (
  <View style={styles.row}>
    {label && <Text style={styles.label}>{label}</Text>}
    <Text style={styles.value}>{value}</Text>
  </View>
)

/* estilos */
const styles = StyleSheet.create({
  scroll:{ padding:20, paddingBottom:60 },

  section:{
    backgroundColor:COLORS.cardBackground,
    borderRadius:12, padding:16, marginBottom:16,
    shadowColor:'#000', shadowOpacity:0.05, shadowRadius:5, elevation:2
  },
  sectionTitle:{ fontSize:18, fontWeight:'bold', marginBottom:8, color:COLORS.text },

  row:{ flexDirection:'row', justifyContent:'space-between', marginBottom:6 },
  label:{ color:'#666', marginRight:12 },
  value:{ color:COLORS.text, fontWeight:'600' },

  logoutWrapper:{ marginTop:12, alignItems:'center' }
})