import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import React from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import Back from '../../components/ui/Back';

const PalaceDetails = ({route}) => {
  const {palace} = route.params;

  // Split the description at a suitable point (e.g., after the first sentence)
  const descriptionParts = palace.description.split('.');
  const firstPart = descriptionParts[0] + '.';
  const secondPart = descriptionParts.slice(1).join('.');

  return (
    <MainLayout>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* First part of description */}
          <Text style={styles.descriptionText}>{firstPart}</Text>

          {/* Palace Image */}
          <View style={styles.imageContainer}>
            <Image
              source={palace.image}
              style={styles.palaceImage}
              resizeMode="cover"
            />
          </View>

          {/* Second part of description */}
          <Text style={styles.descriptionText}>{secondPart}</Text>
          <Back />
        </ScrollView>
      </SafeAreaView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#FFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#171717',
    textAlign: 'center',
    marginVertical: 20,
    textTransform: 'uppercase',
  },
  imageContainer: {
    width: '100%',
    height: Dimensions.get('window').height * 0.4,
    marginVertical: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  palaceImage: {
    width: '100%',
    height: '100%',
  },
});

export default PalaceDetails;
