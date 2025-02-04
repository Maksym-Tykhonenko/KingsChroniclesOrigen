import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
const Back = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{
        width: 60,
        height: 60,
        alignSelf: 'flex-end',
        marginRight: 40,
      }}>
      <Image
        source={require('../../assets/image/icons/back.png')}
        style={{width: 60, height: 60, tintColor: '#D7B154'}}
      />
    </TouchableOpacity>
  );
};

export default Back;

const styles = StyleSheet.create({});
