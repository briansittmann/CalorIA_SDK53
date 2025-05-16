// src/screens/GenerateRecipeModal.js
import React, { useState, useCallback } from 'react'
import {
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import RecipeCard from '../components/RecipeCard'
import CustomButton from '../components/CustomButton'
import { COLORS } from '../theme/color'
import { generarRecetas, guardarRecetas } from '../services/recipeService'
import { useMacros } from '../context/MacrosContext'

// Ilustración “chef” como fondo
const CHEF_IMG = require('../../assets/images/chefCaloria.png')

export default function GenerateRecipeModal({ navigation }) {
  const { summary: macrosRest, refreshMacros } = useMacros()
  const [numComidas, setNumComidas] = useState(1)
  const [loading, setLoading]       = useState(false)
  const [recetas, setRecetas]       = useState([])

  useFocusEffect(useCallback(() => { refreshMacros() }, [refreshMacros]))

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

  const isEmptyState = !loading && recetas.length === 0

  return (
    <ImageBackground
      source={CHEF_IMG}
      style={styles.background}
      imageStyle={isEmptyState ? styles.bgImageEmpty : styles.bgImageFilled}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          isEmptyState && styles.centerContent,
          { paddingBottom: 80 }
        ]}
      >
        {/* Bloque generación */}
        <Text
          style={[
            styles.info,
            isEmptyState ? styles.infoEmpty : styles.infoFilled,
            styles.block
          ]}
        >
          Tienes{' '}
          <Text style={styles.highlight}>
            {macrosRest ? `${macrosRest.caloriasRestantes} kcal` : '…kcal'}
          </Text>{' '}
          por cubrir. Escoge de 1 a 4 comidas y pulsa «Generar» para encontrar recetas que se ajusten a tu objetivo.
        </Text>

        {/* Selector 1–4 */}
        <View style={[styles.selector, styles.block]}>
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

        {/* Botón Generar */}
        <CustomButton
          label="      Generar      "
          colorType="blue"
          onPress={handleGenerate}
          style={[styles.button, styles.block, styles.generateButton]}
        />

        {/* Loader */}
        {loading && (
          <ActivityIndicator
            size="large"
            color={COLORS.primaryRed}
            style={[styles.loader, styles.block]}
          />
        )}

        {/* Lista de recetas */}
        {!loading && recetas.length > 0 && (
          <>
            {recetas.map((item, i) => (
              <RecipeCard
                key={i}
                receta={item}
                onDelete={() => setRecetas(rs => rs.filter((_, j) => j !== i))}
                style={styles.card}
              />
            ))}
            <CustomButton
              label="Guardar recetas"
              colorType="blue"
              onPress={handleSave}
              style={[styles.button, styles.saveButton]}
            />
          </>
        )}
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  // Fondo cuando NO hay recetas
  bgImageEmpty: {
    opacity: 0.8,
    width: 250,
    height: 250,
    position: 'absolute',
    top: 50,
    left: 80,
  },
  // Fondo cuando HAY recetas
  bgImageFilled: {
    opacity: 0.5,
    width: 430,
    height: 430,
    position: 'absolute',
    top: 260,
    left: -100,
  },

  container: {
    marginTop: 50,
    marginBottom: 50,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  centerContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  block: {
    marginVertical: 30,   // espacio extra entre bloques
    width: '100%',
  },

  // Info: dos variantes de paddingTop
  info: {
    marginBottom: -10,
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
  },
  infoEmpty: {
    paddingTop: 80,
  },
  infoFilled: {
    paddingTop: -5,
  },

  highlight: {
    color: COLORS.primaryRed,
    fontSize: 18,
    fontWeight: 'bold',
  },

  selector: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bola: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.secondaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  bolaActiva: {
    backgroundColor: COLORS.primaryBlue,
  },
  bolaTexto: {
    color: COLORS.secondaryBlue,
    fontWeight: 'bold',
  },
  bolaTextoActiva: {
    color: COLORS.text,
  },

  button: {
    width: '100%',
    marginHorizontal: 0,
  },
  generateButton: {
    marginBottom: 30,  
  },
  saveButton: {
    marginBottom: 50, 
  },

  loader: {
    // centrado por container
  },

  card: {
    marginVertical: 20, // más separación entre tarjetas
    alignSelf: 'center',
    width: '100%',
  },
})