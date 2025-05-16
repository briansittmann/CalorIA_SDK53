// src/screens/DiaryScreen.js
import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { COLORS } from '../theme/color'

// Ilustración local
const EMPTY_IMG = require('../../assets/images/nevera.png')

export default function DiaryScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={EMPTY_IMG}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.emptyTitle}>Mmmm…</Text>
      <Text style={styles.emptySubtitle}>
        Parece que aún no has añadido alimentos a tu diario. Empieza hoy mismo para llevar un mejor registro.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  image: {
    width: 200,           
    height: 200,          
    opacity: 0.9,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
})