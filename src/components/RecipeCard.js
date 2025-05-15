// src/components/RecipeCard.js
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { COLORS } from '../theme/color'

/**
 * Props:
 *  - receta: objeto con { titulo, calorias, macroNutrientes, ingredientes, instrucciones }
 *  - onDelete?: función que se llama al pulsar el botón de borrar
 */
export default function RecipeCard({ receta, onDelete }) {
  const [showDelete, setShowDelete] = useState(false)

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onLongPress={() => setShowDelete(true)}
      onPress={() => showDelete && setShowDelete(false)}
    >
      <View style={styles.card}>
        {/* Título y calorías */}
        <View style={styles.header}>
          <Text style={styles.title}>{receta.titulo}</Text>
          <Text style={styles.calories}>{receta.calorias} kcal</Text>
        </View>

        {/* Macronutrientes totales */}
        <Text style={styles.macroSummary}>
          P{receta.macroNutrientes.proteinas} g ·{' '}
          C{receta.macroNutrientes.carbohidratos} g ·{' '}
          G{receta.macroNutrientes.grasas} g
        </Text>

        {/* Lista de ingredientes con gramos */}
        <Text style={styles.section}>Ingredientes:</Text>
        {receta.ingredientes.map((ing, i) => (
          <Text key={i} style={styles.ingredient}>
            • {ing.nombre}: {ing.gramos} g
          </Text>
        ))}

        {/* Instrucciones */}
        <Text style={styles.section}>Instrucciones:</Text>
        <Text style={styles.instructions}>{receta.instrucciones}</Text>

        {/* Botón de borrar */}
        {showDelete && onDelete && (
          <TouchableOpacity
            style={styles.deleteCircle}
            onPress={onDelete}
          >
            <Text style={styles.deleteX}>×</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    position: 'relative', // para posicionar el deleteCircle
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    flex: 1,
    flexWrap: 'wrap',
  },
  calories: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primaryRed,
    marginLeft: 8,
  },
  macroSummary: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 12,
  },
  section: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primaryBlue,
    marginTop: 8,
    marginBottom: 4,
  },
  ingredient: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
  },
  instructions: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 4,
    lineHeight: 20,
  },
  deleteCircle: {
    position: 'absolute',
    right: -10,
    top: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primaryRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteX: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 18,
    fontWeight: 'bold',
  },
})