import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const ButtleButton = ({title, style, marginTop, onPress}) => {
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, {marginTop}]}
      onPress={onPress}>
      <Text style={[styles.buttonText, style]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    minHeight: 50,
    width: '100%',
    maxWidth: 274,
    paddingHorizontal: 30,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    // lineHeight: 1.2,
  },
});
export default ButtleButton;
