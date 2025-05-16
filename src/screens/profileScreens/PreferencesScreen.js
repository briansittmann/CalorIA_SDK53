// src/screens/profileScreens/PreferencesScreen.js
import React, { useState, useEffect, useRef } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  Alert
} from 'react-native'
import Toast from 'react-native-toast-message'
import { CommonActions } from '@react-navigation/native'

import TagInputCard from '../../components/TagInputCard'
import CustomButton from '../../components/CustomButton'
import {
  updatePreferences,
  fetchFullProfile,
  fetchProfileState,
  recalcMetas
} from '../../services/registerService'
import { useAuth } from '../../context/AuthContext'
import { COLORS } from '../../theme/color'
import preferenciasImg from '../../../assets/images/preferencias.png'

export default function PreferencesScreen({ navigation, route }) {
  const { profileState, refreshProfileState } = useAuth()
  const { editMode = false } = route.params || {}
  const [prefs, setPrefs]   = useState([])
  const [alergs, setAlergs] = useState([])

  // Para mostrar alerta solo la primera vez que completamos el perfil
  const firstTime = useRef(!profileState?.perfilCompleto)

  // 1️⃣ Precargar datos si estamos editando
  useEffect(() => {
    if (editMode) {
      fetchFullProfile()
        .then(p => {
          setPrefs(p.preferencias || [])
          setAlergs(p.alergias || [])
        })
        .catch(err => console.warn('No se pudo cargar preferencias para editar:', err))
    }
  }, [editMode])

  // 2️⃣ Si no es edición y ya completamos, salir al Main
  useEffect(() => {
    if (!editMode && profileState?.preferenciasCompletas) {
      const wizard = navigation.getParent()
      const root   = wizard?.getParent()
      root?.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: 'Main' }] })
      )
    }
  }, [editMode, profileState?.preferenciasCompletas, navigation])

  const onSubmit = async () => {
    try {
      // 3️⃣ Guardar en backend (acepta arrays vacíos)
      await updatePreferences({ preferencias: prefs, alergias: alergs })
      Toast.show({ type: 'success', text1: '✅ Preferencias guardadas' })

      if (editMode) {
        // 4️⃣ En edición: recalcular macros y cerrar modal
        await recalcMetas()
        navigation.getParent()?.goBack()
        return
      }

      // 5️⃣ Onboarding: refrescar y comprobar completitud
      await refreshProfileState()
      const newState = await fetchProfileState()

      if (newState.perfilCompleto) {
        if (firstTime.current) {
          Alert.alert(
            '🎉 ¡Perfil completo!',
            'Tu perfil se ha creado con éxito. Ahora verás un resumen de tus calorías y macros objetivo.',
            [{ text: '¡Genial!' }]
          )
          firstTime.current = false
        }
        // 6️⃣ Reset al Main
        const wizard = navigation.getParent()
        const root   = wizard?.getParent()
        root?.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: 'Main' }] })
        )
      } else {
        Toast.show({
          type: 'info',
          text1: 'Perfil no completo',
          text2: 'Faltan pasos en el wizard'
        })
      }
    } catch (err) {
      console.error('[Preferences] Error al guardar preferencias:', err)
      Toast.show({ type: 'error', text1: 'Error al guardar preferencias' })
    }
  }

  /* Componente para cada etiqueta */
  const Tag = ({ text, color, onRemove }) => (
    <TouchableOpacity style={[styles.tag, { backgroundColor: color }]} onPress={onRemove}>
      <Text style={styles.tagTxt}>{text} ✕</Text>
    </TouchableOpacity>
  )

  const TagList = ({ data, color, remover }) => (
    <View style={styles.tagWrap}>
      {data.map(t => (
        <Tag key={t} text={t} color={color} onRemove={() => remover(t)} />
      ))}
    </View>
  )

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({ ios: 60, android: 0 })}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={preferenciasImg} style={styles.image} />
        <Text style={styles.title}>🍽️ Preferencias & alergias</Text>
        <Text style={styles.subtitle}>
          Pulsa ➕ o “done” para añadir, toca una etiqueta para quitarla
        </Text>

        <TagInputCard
          title="🌱 Preferencias"
          tags={prefs}
          setTags={setPrefs}
          color={COLORS.primaryBlue}
          placeholder="Ej: sin gluten, vegetariano…"
          hideTags
        />
        <TagList
          data={prefs}
          color={COLORS.primaryBlue}
          remover={tag => setPrefs(prev => prev.filter(t => t !== tag))}
        />

        <TagInputCard
          title="⚠️ Alergias"
          tags={alergs}
          setTags={setAlergs}
          color={COLORS.primaryRed}
          placeholder="Ej: maní, mariscos, lactosa"
          hideTags
        />
        <TagList
          data={alergs}
          color={COLORS.primaryRed}
          remover={tag => setAlergs(prev => prev.filter(t => t !== tag))}
        />

        <CustomButton
          label="Finalizar"
          onPress={onSubmit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex:     { flex: 1 },
  scroll:   { padding: 24, paddingBottom: 48 },
  image:    { marginTop: 45, width: 150, height: 150, alignSelf: 'center' },
  title:    { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  subtitle: { textAlign: 'center', marginBottom: 24, color: '#666' },
  tagWrap:  { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 },
  tag:      { borderRadius: 16, paddingHorizontal: 12, paddingVertical: 4, marginRight: 8, marginTop: 8 },
  tagTxt:   { color: '#fff', fontWeight: '600' }
})