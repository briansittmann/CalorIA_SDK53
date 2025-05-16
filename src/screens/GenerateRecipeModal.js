// src/screens/GenerateRecipeModal.js
import React, { useState, useCallback } from 'react'
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import RecipeCard   from '../components/RecipeCard'
import CustomButton from '../components/CustomButton'
import { COLORS }   from '../theme/color'
import { generarRecetas, guardarRecetas } from '../services/recipeService'
import { useMacros } from '../context/MacrosContext'

// Ilustración “chef”
const CHEF_IMG = require('../../assets/images/chefCaloria.png')

export default function GenerateRecipeModal({ navigation }) {
  const { summary: macrosRest, refreshMacros } = useMacros()
  const [numComidas, setNumComidas] = useState(1)
  const [loading, setLoading]       = useState(false)
  const [recetas, setRecetas]       = useState([])

  /* ————————— hooks ————————— */
  useFocusEffect(useCallback(() => { refreshMacros() }, [refreshMacros]))

  /* ————————— handlers ————————— */
  const handleGenerate = () => {
    if (!macrosRest) return Alert.alert('Espera', 'Cargando macros…')
    setLoading(true)
    generarRecetas(numComidas)
      .then(arr => setRecetas(arr))
      .catch(() => Alert.alert('Error', 'No se pudieron cargar las recetas'))
      .finally(() => setLoading(false))
  }

  const handleSave = () => {
    guardarRecetas(recetas)
      .then(() => {
        Alert.alert('¡Listo!', 'Recetas guardadas en tu perfil.')
        navigation.goBack()
      })
      .catch(() => Alert.alert('Error', 'No se pudieron guardar las recetas'))
  }

  /* ————————— render ————————— */
  return (
    <View style={styles.container}>
      <Text style={styles.info}>
        Tienes{' '}
        <Text style={styles.highlight}>
          {macrosRest ? `${macrosRest.caloriasRestantes} kcal` : '…kcal'}
        </Text>{' '}
        pendientes. Elige (1–4) y pulsa «Generar».
      </Text>

      {/* selector 1-4 */}
      <View style={styles.selector}>
        {[1,2,3,4].map(n => (
          <TouchableOpacity
            key={n}
            style={[styles.bola, numComidas===n && styles.bolaActiva]}
            onPress={() => setNumComidas(n)}
          >
            <Text style={[styles.bolaTexto, numComidas===n && styles.bolaTextoActiva]}>
              {n}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <CustomButton
        label="Generar"
        colorType="blue"
        onPress={handleGenerate}
        style={styles.button}
      />

      {loading && (
        <ActivityIndicator
          size="large"
          color={COLORS.primaryRed}
          style={styles.loader}
        />
      )}

      {/* estado vacío */}
      {!loading && recetas.length === 0 && (
        <View style={styles.emptyWrapper}>
          <Image source={CHEF_IMG} style={styles.emptyImage} resizeMode="contain" />
        </View>
      )}

      {/* lista de recetas */}
      {!loading && recetas.length > 0 && (
        <>
          <FlatList
            data={recetas}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item, index }) => (
              <RecipeCard
                receta={item}
                onDelete={() => setRecetas(rs => rs.filter((_, i) => i !== index))}
              />
            )}
            contentContainerStyle={styles.list}
          />
          <CustomButton
            label="Guardar recetas"
            colorType="blue"
            onPress={handleSave}
            style={styles.button}
          />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container:  { flex:1, backgroundColor:COLORS.background, padding:16 },
  info:       { fontSize:16, color:COLORS.text, textAlign:'center',
                marginBottom:20, marginTop:40 },
  highlight:  { color:COLORS.primaryRed, fontWeight:'bold' },

  /* selector 1-4 */
  selector:   { flexDirection:'row', justifyContent:'center', marginBottom:20 },
  bola:       { width:40, height:40, borderRadius:20, borderWidth:1,
                borderColor:COLORS.primaryBlue, alignItems:'center',
                justifyContent:'center', marginHorizontal:8 },
  bolaActiva: { backgroundColor:COLORS.primaryBlue },
  bolaTexto:  { color:COLORS.primaryBlue, fontWeight:'bold' },
  bolaTextoActiva:{ color:COLORS.text },

  button:     { marginHorizontal:60, marginBottom:24 },
  loader:     { marginVertical:20 },

  /* —— estado vacío —— */
  emptyWrapper:{
    flex:1,            // ocupa todo el espacio
  },
  emptyImage:{
    alignSelf: 'flex-start',
    bottom:-100,
    left:-150,
    width:500,         // tamaño exacto (doble de la versión anterior)
    height:400,
    opacity:0.8,
  },

  /* lista */
  list:       { paddingBottom:20, alignItems:'center' },
})