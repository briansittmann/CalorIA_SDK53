// src/screens/profileScreens/PreferencesScreen.js
import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import Toast from 'react-native-toast-message'

import TagInputCard   from '../../components/TagInputCard'
import CustomButton   from '../../components/CustomButton'
import { updatePreferences, fetchProfileState } from '../../services/registerService'
import { useAuth }    from '../../context/AuthContext'
import { COLORS }     from '../../theme/color'

// Import de la imagen de preferencias
import preferenciasImg from '../../../assets/images/preferencias.png'

export default function PreferencesScreen ({ navigation }) {
  const { setState } = useAuth()
  const [prefs,  setPrefs]  = useState([])
  const [alergs, setAlergs] = useState([])

  const disabled = prefs.length === 0 && alergs.length === 0

  /* guardar */
  const onSubmit = async () => {
    try {
      await updatePreferences({ preferencias: prefs, alergias: alergs })
      Toast.show({ type: 'success', text1: '✅ Preferencias guardadas' })
      const perfilActualizado = await fetchProfileState()
      setState(perfilActualizado)
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] })
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error al guardar preferencias' })
      console.error(error)
    }
  }

  /* tag visual individual */
  const Tag = ({ text, color, onRemove }) => (
    <TouchableOpacity style={[styles.tag, { backgroundColor: color }]} onPress={onRemove}>
      <Text style={styles.tagTxt}>{text} ✕</Text>
    </TouchableOpacity>
  )

  /* lista flexible */
  const TagList = ({ data, color, remover }) => (
    <View style={styles.tagWrap}>
      {data.map(t => (
        <Tag key={t} text={t} color={color} onRemove={() => remover(t)} />
      ))}
    </View>
  )

  return (
    <ScrollView contentContainerStyle={styles.scroll}>

      {/* Imagen arriba del título */}
      <Image source={preferenciasImg} style={styles.image} />

      <Text style={styles.title}>🍽️ Preferencias & alergias</Text>
      <Text style={styles.subtitle}>
        Pulsa ➕ o “done” para añadir, toca una etiqueta para quitarla
      </Text>

      {/* Preferencias */}
      <TagInputCard
        title="🌱 Preferencias"
        tags={prefs}
        setTags={setPrefs}
        color={COLORS.primaryBlue}
        placeholder="Ej: sin gluten, vegetariano, bajo en carbohidratos"
        hideTags
      />
      <TagList
        data={prefs}
        color={COLORS.primaryBlue}
        remover={tag => setPrefs(prefs.filter(t => t !== tag))}
      />

      {/* Alergias */}
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
        remover={tag => setAlergs(alergs.filter(t => t !== tag))}
      />

      <CustomButton
        label="Finalizar"
        disabled={disabled}
        onPress={onSubmit}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: {
    padding: 24,
    paddingBottom: 48,
  },
  image: {
    width: 150,
    height: 150,
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
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  tag: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginTop: 8,
  },
  tagTxt: {
    color: '#fff',
    fontWeight: '600',
  },
})