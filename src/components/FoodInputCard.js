// src/components/FoodInputCard.js
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import AddButton from './AddButton';
import { COLORS } from '../theme/color';

export default function FoodInputCard({
  name,
  setName,
  grams,
  setGrams,
  onAdd,
  cardWidth       = 355,
  addButtonSize   = 60,
  cardHeight      = 200,
}) {
  return (
    <View style={[
        styles.cardContainer,
        {
          width: cardWidth,
          height: cardHeight,
          paddingBottom: addButtonSize / 2 + 10, // espacio para el botón
        }
      ]}
    >
      <View style={styles.inputsContainer}>
        <TextInput
          style={styles.input}
          placeholder="Alimento"
          placeholderTextColor="rgba(0,0,0,0.3)"
          value={name}
          onChangeText={setName}
          maxLength={30}              // ← máximo 30 caracteres
        />
        <TextInput
          style={styles.input}
          placeholder="g"
          placeholderTextColor="rgba(0,0,0,0.3)"
          keyboardType="numeric"
          value={grams}
          onChangeText={setGrams}
          maxLength={5}               // ← máximo 5 caracteres
        />
      </View>

      <AddButton
        size={addButtonSize}
        backgroundColor={COLORS.secondaryBlue}
        iconColor={COLORS.text}
        onPress={onAdd}
        style={{
          position: 'absolute',
          bottom: -(addButtonSize / 2),
          alignSelf: 'center',
        }}
      />
    </View>
  );
}

FoodInputCard.propTypes = {
  name:           PropTypes.string.isRequired,
  setName:        PropTypes.func.isRequired,
  grams:          PropTypes.string.isRequired,
  setGrams:       PropTypes.func.isRequired,
  onAdd:          PropTypes.func.isRequired,
  cardWidth:      PropTypes.number,
  cardHeight:     PropTypes.number,
  addButtonSize:  PropTypes.number,
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius:    15,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.1,
    shadowRadius:    5,
    elevation:       5,
    paddingTop:      50,
    marginBottom:    30,   // separa la tarjeta de lo siguiente
    overflow:        'visible',
  },
  inputsContainer: {
    paddingHorizontal: 20,
  },
  input: {
    height:            40,
    backgroundColor:   COLORS.primaryBlue,
    borderRadius:      20,
    paddingHorizontal: 12,
    color:             '#fff',
    marginBottom:      10,
  },
});