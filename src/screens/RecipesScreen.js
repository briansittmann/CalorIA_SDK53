// src/screens/RecipesScreen.js
import React, { useState, useCallback } from 'react'
import {
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Text,
  Alert,
  Image,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import RecipeCard   from '../components/RecipeCard'
import CustomButton from '../components/CustomButton'
import { COLORS }   from '../theme/color'
import { cargarRecetas, eliminarReceta } from '../services/recipeService'

// Ilustración local
const NOT_FOUND_IMG = require('../../assets/images/notFound.png')

export default function RecipesScreen({ navigation }) {
  const [loading, setLoading] = useState(false)
  const [recetas, setRecetas] = useState([])

  const loadMyRecipes = useCallback(() => {
    setLoading(true)
    cargarRecetas()
      .then(arr => setRecetas([...arr].reverse()))
      .catch(() => Alert.alert('Error', 'No se pudieron cargar tus recetas'))
      .finally(() => setLoading(false))
  }, [])

  useFocusEffect(loadMyRecipes)

  const handleDelete = id => {
    Alert.alert(
      '¿Eliminar?',
      '¿Deseas quitar esta receta de tu perfil?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            eliminarReceta(id)
              .then(() => setRecetas(rs => rs.filter(r => r.id !== id)))
              .catch(() => Alert.alert('Error', 'No se pudo eliminar la receta'))
          }
        }
      ]
    )
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primaryRed} />
      ) : recetas.length === 0 ? (
        /* Vista vacía */
        <View style={styles.emptyWrapper}>
          <Image source={NOT_FOUND_IMG} style={styles.emptyImage} resizeMode="contain" />
          <Text style={styles.emptyTitle}>Oops…</Text>
          <Text style={styles.emptySubtitle}>
            Parece que aún no tienes recetas, genera recetas para verlas aquí.
          </Text>
        </View>
      ) : (
        /* Vista con recetas */
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {recetas.map(rec => (
            <RecipeCard
              key={rec.id}
              receta={rec}
              onDelete={() => handleDelete(rec.id)}
            />
          ))}
        </ScrollView>
      )}

      {/* Botón fijo */}
      <View style={styles.footer}>
        <CustomButton
          label="Generar recetas"
          colorType="blue"
          onPress={() => navigation.navigate('GenerateRecipeModal')}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 15,
    alignItems: 'center',
  },

  /* ScrollView cuando sí hay recetas */
  scrollContainer: {
    paddingLeft: 30,
    paddingTop: 10,
    paddingBottom: 200,
  },

  /* Estado vacío */
  emptyWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: -500,
  },
  emptyImage: {
    width: '70%',
    height: undefined,
    aspectRatio: 1,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 8,
  },

  footer: {
    paddingBottom: 30,
    paddingVertical: 20,
    alignItems: 'center',
  },
})