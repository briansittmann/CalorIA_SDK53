import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { COLORS } from '../theme/color'

export default function LoadingSpinner() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primaryRed} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    justifyContent:  'center',
    alignItems:      'center',
    marginTop:20,
    backgroundColor: COLORS.background,
  },
})