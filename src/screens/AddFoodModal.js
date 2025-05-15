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
} from 'react-native'
import FoodInputCard from '../components/FoodInputCard'
import FoodItem      from '../components/FoodItem'
import SendButton    from '../components/SendButton'
import { COLORS }    from '../theme/color'
import { registerFood } from '../services/foodService'
import { useMacros } from '../context/MacrosContext'

export default function AddFoodModal({ navigation }) {
  const { refreshMacros } = useMacros()
  const [name,    setName]    = useState('')
  const [grams,   setGrams]   = useState('')
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(false)

  // Animated value para el fade-in del botón/texto
  const fadeAnim = useRef(new Animated.Value(0)).current

  // Cada vez que cambie el número de items, disparo el fade
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: items.length > 0 ? 1 : 0,
      duration: 500,           // medio segundo
      useNativeDriver: true,
    }).start()
  }, [items.length, fadeAnim])

  const handleAdd = () => {
    if (!name.trim() || !grams.trim()) return
    setItems(prev => [...prev, { name: name.trim(), grams: grams.trim() }])
    setName('')
    setGrams('')
  }

  const removeItem = index => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const handleSend = async () => {
    if (items.length === 0) {
      Alert.alert('Añade al menos un alimento')
      return
    }

    setLoading(true)
    try {
      await Promise.all(
        items.map(item =>
          registerFood({
            nombre: item.name,
            gramos: parseFloat(item.grams),
          })
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

  return (
    <View
      style={styles.screen}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      {/* Input separado */}
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

      {/* ScrollView con items + botón animado */}
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

        {/* Animated.View que aparece solo si hay items */}
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

const styles = StyleSheet.create({
  screen: {
    flex:            1,
    backgroundColor: COLORS.background,
  },
  inputWrapper: {
    marginTop:    20,
    padding:      20,
    alignItems:   'center',
  },
  header: {
    fontSize:       18,
    fontWeight:     'bold',
    color:          COLORS.text,
    marginBottom:   10,
  },
  scrollContainer: {
    flexGrow:          1,
    paddingHorizontal: 20,
    paddingBottom:     60,
  },
  sendButton: {
    alignSelf:    'center',
    marginTop:    30,
    marginBottom: 10,
  },
  addFoodButtonText: {
    fontSize:     18,
    fontWeight:   'bold',
    color:        COLORS.text,
    textAlign:    'center',
    marginBottom: 40,
  },
})