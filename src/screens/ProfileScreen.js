import React, { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  ActivityIndicator, TouchableOpacity
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { fetchFullProfile } from '../services/registerService'
import { useAuth } from '../context/AuthContext'
import CustomButton from '../components/CustomButton'
import { COLORS } from '../theme/color'

const niveles = [
  { value: 'MUY_BAJA',  label: '🛌 Muy baja' },
  { value: 'BAJA',      label: '📚 Baja' },
  { value: 'MODERADA',  label: '🚶‍♂️ Moderada' },
  { value: 'ALTA',      label: '🏃‍♀️ Alta' },
  { value: 'MUY_ALTA',  label: '💥 Muy alta' },
  { value: 'EXTREMA',   label: '🔥 Extrema' },
]
const objetivos = [
  { value: 'CUT_LIGERO',      label: '📉 Déficit suave' },
  { value: 'CUT_MEDIO',       label: '📉 Déficit moderado' },
  { value: 'CUT_AGRESIVO',    label: '⚠️ Déficit agresivo' },
  { value: 'MANTENER',        label: '⚖️ Mantener peso' },
  { value: 'BULK_CONSERVADOR',label: '🍚 Superávit ligero' },
  { value: 'BULK_ESTANDAR',   label: '💪 Superávit moderado' },
  { value: 'BULK_AGRESIVO',   label: '🔥 Superávit agresivo' },
]

function mapLabel(list, value) {
  return list.find(item => item.value === value)?.label || '—'
}

export default function ProfileScreen({ navigation }) {
  const { signOut } = useAuth()
  const [perfil, setPerfil] = useState(null)

  useFocusEffect(
    React.useCallback(() => {
      fetchFullProfile().then(setPerfil)
    }, [])
  )

  if (!perfil) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primaryRed} />
      </View>
    )
  }

  const orDash = v => (v ?? '') !== '' && v !== 0 ? v : '—'

  const openWizard = screenName => {
    navigation
      .getParent()
      ?.navigate('Wizard', { screen: screenName, params: { editMode: true } })
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      {/* Datos básicos */}
      <Section title="📝 Datos básicos" onEdit={() => openWizard('Basic')}>
        <Row label="Email"   value={orDash(perfil.email)} />
        <Row label="Nombre"  value={orDash(perfil.nombre)} />
        <Row label="Edad"    value={orDash(perfil.edad)} />
        <Row label="Sexo"    value={orDash(perfil.sexo)} />
        <Row label="Altura"  value={orDash(perfil.alturaCm) + ' cm'} />
        <Row label="Peso"    value={orDash(perfil.pesoKg) + ' kg'} />
        <Row label="Empiezas a las" value={orDash(perfil.horaInicioDia)} />
      </Section>

      {/* Actividad */}
      <Section title="🏃‍♂️ Actividad" onEdit={() => openWizard('Activity')}>
        <Row value={mapLabel(niveles, perfil.nivelActividad)} />
      </Section>

      {/* Objetivo */}
      <Section title="🎯 Objetivo" onEdit={() => openWizard('Goal')}>
        <Row label="Tipo"     value={mapLabel(objetivos, perfil.objetivo)} />
        <Row label="Calorías" value={orDash(perfil.caloriasObjetivo)} />
        {perfil.macrosObjetivo && (
          <>
            <Row label="Proteínas"     value={perfil.macrosObjetivo.proteinasG + ' g'} />
            <Row label="Carbohidratos" value={perfil.macrosObjetivo.carbohidratosG + ' g'} />
            <Row label="Grasas"        value={perfil.macrosObjetivo.grasasG + ' g'} />
          </>
        )}
      </Section>

      {/* Preferencias */}
      <Section title="🍽️ Preferencias" onEdit={() => openWizard('Preference')}>
        <Row label="Preferencias" value={perfil.preferencias?.join(', ') || '—'} />
        <Row label="Alergias"     value={perfil.alergias?.join(', ') || '—'} />
      </Section>

      {/* Cerrar sesión */}
      <View style={styles.logoutWrapper}>
        <CustomButton label="Cerrar sesión" colorType="red" onPress={signOut} />
      </View>
    </ScrollView>
  )
}

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

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 60,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  section: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.text,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    color: '#666',
    marginRight: 12,
  },
  value: {
    color: COLORS.text,
    fontWeight: '600',
  },
  logoutWrapper: {
    marginTop: 12,
    alignItems: 'center',
  },
})
