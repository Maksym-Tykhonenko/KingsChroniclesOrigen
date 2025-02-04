import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {BATTLE_DATA} from '../../data/BattleData';
import MainLayout from '../../components/Layout/MainLayout';
import Back from '../../components/ui/Back';

const BattleScreen = ({route}) => {
  const {battle} = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Find the battle details from BATTLE_DATA using the battle id
  const battleDetails = BATTLE_DATA.find(item => item.id === battle.id);

  const handleNext = () => {
    if (currentIndex < battleDetails.description.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!battleDetails) return null;

  const currentDescription = battleDetails.description[currentIndex];
  const isTextAbove = currentIndex % 2 === 0; // Alternates text position

  return (
    <MainLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView style={styles.container}>
          {/* Timeline */}

          {/* Content Container */}
          <View style={styles.contentContainer}>
            {/* Text Above */}
            {isTextAbove && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>
                  {currentDescription.text}
                </Text>
              </View>
            )}

            {/* Battle Image */}
            <View style={styles.imageContainer}>
              <ImageBackground
                source={currentDescription.image}
                style={styles.battleImage}
                resizeMode="cover">
                {/* Navigation Arrows */}
                <View style={styles.navigationContainer}>
                  <TouchableOpacity
                    onPress={handlePrevious}
                    disabled={currentIndex === 0}
                    style={[
                      styles.navButton,
                      currentIndex === 0 && styles.navButtonDisabled,
                    ]}>
                    <Image
                      source={require('../../assets/image/icons/arrowLeft.png')}
                      style={styles.navIcon}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleNext}
                    disabled={
                      currentIndex === battleDetails.description.length - 1
                    }
                    style={[
                      styles.navButton,
                      currentIndex === battleDetails.description.length - 1 &&
                        styles.navButtonDisabled,
                    ]}>
                    <Image
                      source={require('../../assets/image/icons/arrowLeft.png')}
                      style={[
                        styles.navIcon,
                        {transform: [{rotate: '180deg'}]},
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              </ImageBackground>

              {/* Navigation Arrows */}
              {/* <View style={styles.navigationContainer}>
              <TouchableOpacity
                onPress={handlePrevious}
                disabled={currentIndex === 0}
                style={[
                  styles.navButton,
                  currentIndex === 0 && styles.navButtonDisabled,
                ]}>
                <Image
                  source={require('../../assets/image/icons/arrowLeft.png')}
                  style={styles.navIcon}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNext}
                disabled={currentIndex === battleDetails.description.length - 1}
                style={[
                  styles.navButton,
                  currentIndex === battleDetails.description.length - 1 &&
                    styles.navButtonDisabled,
                ]}>
                <Image
                  source={require('../../assets/image/icons/arrowLeft.png')}
                  style={[styles.navIcon, {transform: [{rotate: '180deg'}]}]}
                />
              </TouchableOpacity>
            </View> */}
            </View>

            {/* Text Below */}
            {!isTextAbove && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>
                  {currentDescription.text}
                </Text>
              </View>
            )}
          </View>

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            {battleDetails.description.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.navDot,
                  currentIndex === index && styles.navDotActive,
                ]}
              />
            ))}
          </View>
        </SafeAreaView>
        <Back />
        <View style={{height: 60}} />
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#FFF',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  timelineContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  timeline: {
    height: 2,
    backgroundColor: '#E5E5E5',
    position: 'relative',
  },
  timelineLine: {
    height: '100%',
    backgroundColor: '#171717',
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C6A44E',
    position: 'absolute',
    top: -3,
  },
  hourglassIcon: {
    width: 24,
    height: 24,
    position: 'absolute',
    top: -11,
    left: '50%',
    marginLeft: -12,
  },
  imageContainer: {
    width: '100%',
    height: Dimensions.get('window').height * 0.6,
    marginVertical: 20,
    position: 'relative',
    paddingHorizontal: 20,
  },
  battleImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  navigationContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
    bottom: '10%',
    transform: [{translateY: 0}],
  },
  navButton: {
    // width: 40,
    // height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navIcon: {
    width: 46,
    height: 36,
    tintColor: '#D7B154',
  },
  descriptionContainer: {
    padding: 20,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#171717',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
    gap: 8,
  },
  navDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5E5',
  },
  navDotActive: {
    backgroundColor: '#C6A44E',
  },
});

export default BattleScreen;
