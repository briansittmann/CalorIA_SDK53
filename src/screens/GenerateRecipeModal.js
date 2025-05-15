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
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import RecipeCard   from '../components/RecipeCard'
import CustomButton from '../components/CustomButton'
import { COLORS }   from '../theme/color'
import { generarRecetas, guardarRecetas } from '../services/recipeService'
import { useMacros } from '../context/MacrosContext'

export default function GenerateRecipeModal({ navigation }) {
  const { summary: macrosRest, refreshMacros } = useMacros()
  const [numComidas, setNumComidas] = useState(1)
  const [loading, setLoading]       = useState(false)
  const [recetas, setRecetas]       = useState([])

  // Al abrir/reabrir el modal refrescamos macros
  useFocusEffect(useCallback(() => {
    refreshMacros()
  }, [refreshMacros]))

  const handleGenerate = () => {
    if (!macrosRest) return Alert.alert('Espera', 'Cargando macros…')
    setLoading(true)
    generarRecetas(numComidas)
      .then(recetasArray => setRecetas(recetasArray))
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

  return (
    <View style={styles.container}>
      <Text style={styles.info}>
        Tienes{' '}
        <Text style={styles.highlight}>
          {macrosRest ? `${macrosRest.caloriasRestantes} kcal` : '…kcal'}
        </Text>{' '}
        pendientes. Elige (1–4) y pulsa «Generar».
      </Text>

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
        <ActivityIndicator size="large" color={COLORS.primaryRed} style={styles.loader}/>
      )}

      {!loading && recetas.length > 0 && (
        <>
          <FlatList
            data={recetas}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item, index }) =>
              <RecipeCard
                receta={item}
                onDelete={() => setRecetas(rs => rs.filter((_, i) => i !== index))}
              />
            }
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
  container:  { flex:1, backgroundColor: COLORS.background, padding:16 },
  info:       { fontSize:16, color:COLORS.text, textAlign:'center', marginBottom:20, marginTop:40},
  highlight:  { color:COLORS.primaryRed, fontWeight:'bold' },
  selector:   { flexDirection:'row', justifyContent:'center', marginBottom:20 },
  bola:       { width:40, height:40, borderRadius:20, borderWidth:1,
                borderColor:COLORS.primaryBlue, alignItems:'center',
                justifyContent:'center', marginHorizontal:8 },
  bolaActiva: { backgroundColor:COLORS.primaryBlue },
  bolaTexto:  { color:COLORS.primaryBlue, fontWeight:'bold' },
  bolaTextoActiva:{ color:COLORS.text },
  button:     { marginBottom:24, marginHorizontal:60, marginBottom:20 },
  loader:     { marginVertical:20 },
  list:       { paddingBottom:20, alignItems:'center'},
})