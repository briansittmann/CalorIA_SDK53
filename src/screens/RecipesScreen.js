// src/screens/RecipesScreen.js
import React, { useState, useCallback } from 'react'
import {
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Text,
  Alert,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import RecipeCard   from '../components/RecipeCard'
import CustomButton from '../components/CustomButton'
import { COLORS }   from '../theme/color'
import { cargarRecetas, eliminarReceta } from '../services/recipeService'

export default function RecipesScreen({ navigation }) {
  const [loading, setLoading]     = useState(false)
  const [recetas, setRecetas]     = useState([])

  const loadMyRecipes = useCallback(() => {
    setLoading(true)
    cargarRecetas()
      .then(arr => {
        // invertimos para mostrar más recientes primero
        setRecetas([...arr].reverse())
      })
      .catch(() => Alert.alert('Error', 'No se pudieron cargar tus recetas'))
      .finally(() => setLoading(false))
  }, [])

  

  // Cada vez que la pantalla gana foco, recargamos
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
              .then(() => {
                // filtramos localmente para UX inmediato
                setRecetas(rs => rs.filter(r => r.id !== id))
              })
              .catch(() =>
                Alert.alert('Error', 'No se pudo eliminar la receta')
              )
          }
        }
      ]
    )
  }


  return (
    <View style={styles.container}>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primaryRed} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {recetas.length === 0 ? (
            <Text style={styles.emptyText}>No tienes recetas guardadas.</Text>
          ) : (
            recetas.map(rec => (
              <RecipeCard
                key={rec.id}
                receta={rec}
                onDelete={() => handleDelete(rec.id)}
              />
            ))
          )}
        </ScrollView>
      )}

      <View style={styles.footer}>
        <CustomButton
          label="Generar recetas"
          colorType="blue"
          onPress={() => navigation.navigate('GenerateRecipes')}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: COLORS.background,
    paddingHorizontal:         15,
    alignItems:      'center',
  },
  scrollContainer: {
    paddingLeft:  30,
    paddingTop:   10,
    paddingBottom: 200,
  },
  emptyText: {
    textAlign:    'center',
    color:        COLORS.text,
    fontStyle:    'italic',
    marginTop:    40,
  },
  footer: {
    paddingVertical: 16,
    alignItems:      'center',
  },
})