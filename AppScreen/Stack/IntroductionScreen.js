import {StyleSheet, Text, View, Image, TouchableOpacity, ScrollView} from 'react-native';
import React from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import {useNavigation} from '@react-navigation/native';

const IntroductionScreen = () => {
  const navigation = useNavigation();

  return (
    <MainLayout>
      <View style={styles.container}>
        <Image
          source={require('../../assets/image/introductionScreen/introductionKing.png')}
          style={styles.kingImage}
          resizeMode="contain"
        />
        <Text style={styles.titleKing}>King's</Text>
        <Text style={styles.titleChronicles}>Chronicles</Text>

        <ScrollView>
          <Text style={styles.description}>
            King's Chronicles 📜👑 is an app that invites users on an exciting
            journey through the ages. 🌍✨ It combines historical facts,
            intriguing stories, and chronicles about rulers from various eras,
            highlighting their achievements, great victories, and mistakes that
            changed the course of history. ⚔️📚
          </Text>
          <Text style={styles.subDescription}>
            The app allows you to immerse yourself in the atmosphere of bygone
            times, understand the context of events, and feel like a part of
            historical epochs. 🗿⭐
          </Text>

          <TouchableOpacity
            style={styles.beginButton}
            onPress={() => navigation.replace('LoginScreen')}>
            <Text style={styles.beginButtonText}>Begin</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </MainLayout>
  );
};

export default IntroductionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  kingImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  titleKing: {
    fontSize: 40,
    fontWeight: '600',
    color: '#C5A572', // Golden color
    marginBottom: 5,
  },
  titleChronicles: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 24,
    color: '#333',
  },
  subDescription: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    color: '#333',
  },
  beginButton: {
    backgroundColor: '#C5A572',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 25,
    marginTop: 20,
  },
  beginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
