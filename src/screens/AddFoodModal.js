// src/screens/AddFoodModal.js
import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
  Animated,
  Image,
} from 'react-native'
import FoodInputCard from '../components/FoodInputCard'
import FoodItem      from '../components/FoodItem'
import SendButton    from '../components/SendButton'
import { COLORS }    from '../theme/color'
import { registerFood } from '../services/foodService'
import { useMacros } from '../context/MacrosContext'

// Ilustración “Caloria comiendo”
const BG_IMG = require('../../assets/images/caloriaComiendo.png')

export default function AddFoodModal({ navigation }) {
  const { refreshMacros } = useMacros()
  const [name,    setName]    = useState('')
  const [grams,   setGrams]   = useState('')
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(false)

  /* Fade-in del botón “Enviar” */
  const fadeAnim = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: items.length > 0 ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }, [items.length, fadeAnim])

  /* Handlers */
  const handleAdd = () => {
    if (!name.trim() || !grams.trim()) return
    setItems(prev => [...prev, { name: name.trim(), grams: grams.trim() }])
    setName('')
    setGrams('')
  }

  const removeItem = idx => setItems(prev => prev.filter((_, i) => i !== idx))

  const handleSend = async () => {
    if (items.length === 0) return Alert.alert('Añade al menos un alimento')
    setLoading(true)
    try {
      await Promise.all(
        items.map(it =>
          registerFood({ nombre: it.name, gramos: parseFloat(it.grams) })
        )
      )
      Alert.alert('¡Alimento añadido!')
      await refreshMacros()
      navigation.goBack()
    } catch (err) {
      console.error('Error registrando alimentos:', err)
      Alert.alert('Error', 'No se pudo enviar, inténtalo de nuevo')
    } finally {
      setLoading(false)
    }
  }

  /* ——— Cálculos dinámicos para la ilustración ——— */
  const bgBottom  = -60 - items.length * 30          // -60, -80, -100, ...
  const bgOpacity = items.length > 0 ? 0.4 : 0.8     // cambia con ≥1 ítem

  /* Render */
  return (
    <View
      style={styles.screen}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      {/* BACKGROUND */}
      <Image
        source={BG_IMG}
        resizeMode="contain"
        pointerEvents="none"
        style={[
          styles.bgImage,
          { bottom: bgBottom, opacity: bgOpacity }
        ]}
      />

      {/* Input principal */}
      <View style={styles.inputWrapper}>
        <Text style={styles.header}>Indique su alimento</Text>
        <FoodInputCard
          name={name}
          setName={setName}
          grams={grams}
          setGrams={setGrams}
          onAdd={handleAdd}
        />
      </View>

      {/* Lista de items + botón enviar */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {items.map((it, i) => (
          <FoodItem
            key={i}
            name={it.name}
            grams={it.grams}
            onDelete={() => removeItem(i)}
          />
        ))}

        {/* Botón animado / loader */}
        <Animated.View style={{ opacity: fadeAnim }}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={COLORS.primaryRed}
              style={styles.sendButton}
            />
          ) : (
            <SendButton
              size={90}
              backgroundColor={COLORS.secondaryBlue}
              iconColor={COLORS.text}
              onPress={handleSend}
              style={styles.sendButton}
            />
          )}
          {items.length > 0 && (
            <Text style={styles.addFoodButtonText}>Enviar</Text>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  )
}

/* ——— Styles ——— */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  /* Imagen de fondo */
  bgImage: {
    position: 'absolute',
    left:   -100,
    width:  400,
    height: 400,
    // opacity se define dinámicamente
  },

  /* Cabecera e input */
  inputWrapper: {
    marginTop: 20,
    padding:   20,
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },

  /* ScrollView */
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 60,
  },

  /* Botón / loader */
  sendButton: {
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  addFoodButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 40,
  },
})