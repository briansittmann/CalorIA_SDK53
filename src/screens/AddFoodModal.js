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

  const handleAdd = () => {
    if (!name.trim()) return
    const g = grams.trim() ? parseFloat(grams.trim()) : 0
    setItems(prev => [...prev, { name: name.trim(), grams: g }])
    setName('')
    setGrams('')
  }

  const removeItem = idx => setItems(prev => prev.filter((_, i) => i !== idx))

  const handleSend = async () => {
    if (items.length === 0) {
      return Alert.alert('Añade al menos un alimento')
    }
    setLoading(true)
    try {
      const resp = await registerFood(
        items.map(it => ({ nombre: it.name, gramos: it.grams }))
      )
      // Si la IA responde con { error: "..." }
      if (resp.data && resp.data.error) {
        return Alert.alert('Error', resp.data.error)
      }
      Alert.alert('¡Alimento añadido!')
      await refreshMacros()
      navigation.goBack()
    } catch (err) {
      console.error('Error registrando alimentos:', err)
      // Si el servidor devolvió un 4xx/5xx con body { error: "..."}
      if (err.response && err.response.data && err.response.data.error) {
        Alert.alert('Error', err.response.data.error)
      } else {
        Alert.alert('Error', 'No se pudo enviar, inténtalo de nuevo')
      }
    } finally {
      setLoading(false)
    }
  }

  const bgBottom  = -60 - items.length * 30
  const bgOpacity = items.length > 0 ? 0.4 : 0.8

  return (
    <View
      style={styles.screen}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <Image
        source={BG_IMG}
        resizeMode="contain"
        pointerEvents="none"
        style={[styles.bgImage, { bottom: bgBottom, opacity: bgOpacity }]}
      />

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

        <Animated.View style={{ opacity: fadeAnim }}>
          {loading ? (
            <>
              <ActivityIndicator
                size="large"
                color={COLORS.primaryRed}
                style={styles.sendButton}
              />
              <Text style={styles.processingText}>
                Estamos procesando sus alimentos, esto puede tardar unos segundos.
              </Text>
            </>
          ) : (
            <SendButton
              size={90}
              backgroundColor={COLORS.secondaryBlue}
              iconColor={COLORS.text}
              onPress={handleSend}
              style={styles.sendButton}
            />
          )}
          {!loading && items.length > 0 && (
            <Text style={styles.addFoodButtonText}>Enviar</Text>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  bgImage: { position: 'absolute', left: -100, width: 400, height: 400 },
  inputWrapper: { marginTop: 20, padding: 20, alignItems: 'center' },
  header: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 60 },
  sendButton: { alignSelf: 'center', marginTop: 30, marginBottom: 10 },
  addFoodButtonText: {
    fontSize: 18, fontWeight: 'bold', color: COLORS.text, textAlign: 'center', marginBottom: 40
  },
  processingText: {
    fontSize: 16, fontStyle: 'italic', color: COLORS.text, textAlign: 'center', marginTop: 10, marginBottom: 40
  },
})