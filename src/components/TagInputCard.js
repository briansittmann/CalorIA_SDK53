// src/components/TagInputCard.js
import React, { useState } from 'react'
import {
  View, TextInput, StyleSheet, Text
} from 'react-native'
import PropTypes from 'prop-types'
import AddButton from './AddButton'
import { COLORS } from '../theme/color'

export default function TagInputCard ({
  title,
  tags, setTags,
  color         = COLORS.primaryBlue,
  placeholder   = 'Añadir elemento...',
  cardWidth     = 355,
  addButtonSize = 60,
  cardHeight    = 140
}) {
  const [text, setText] = useState('')

  const addTag = () => {
    const t = text.trim()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setText('')
  }

  return (
    <View style={[
      styles.card,
      {
        width: cardWidth,
        height: cardHeight,
        paddingBottom: addButtonSize / 2 + 10
      }
    ]}>
      {title && <Text style={styles.title}>{title}</Text>}

      <TextInput
        style={[styles.input, { backgroundColor: color }]}
        placeholder={placeholder}
        placeholderTextColor="rgba(0,0,0,0.3)"
        value={text}
        onChangeText={setText}
        onSubmitEditing={addTag}
        returnKeyType="done"
      />

      <AddButton
        size={addButtonSize}
        backgroundColor={color}
        iconColor={COLORS.text}
        onPress={addTag}
        style={{
          position: 'absolute',
          bottom: -(addButtonSize / 2),
          alignSelf: 'center'
        }}
      />
    </View>
  )
}

TagInputCard.propTypes = {
  title:         PropTypes.string,
  tags:          PropTypes.array.isRequired,
  setTags:       PropTypes.func.isRequired,
  color:         PropTypes.string,
  placeholder:   PropTypes.string,
  cardWidth:     PropTypes.number,
  cardHeight:    PropTypes.number,
  addButtonSize: PropTypes.number
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 15,
    elevation: 5,
    paddingTop: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 30
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
    color: COLORS.text
  },
  input: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 12,
    color: '#fff'
  }
})