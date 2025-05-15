// src/components/FoodItem.js
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { COLORS } from '../theme/color'

export default function FoodItem({ name, grams, onDelete }) {
  const [showDelete, setShowDelete] = useState(false)

  return (
    <TouchableOpacity
      onLongPress={() => setShowDelete(true)}
      activeOpacity={0.8}
      onPress={() => showDelete && setShowDelete(false)}
    >
      <View style={styles.container}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.grams}>{grams} g</Text>

        {showDelete && (
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
  container: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryBlue,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    position: 'relative',
  },
  name: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  grams: {
    marginLeft: 'auto',
    color: COLORS.text,
    fontSize: 14,
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