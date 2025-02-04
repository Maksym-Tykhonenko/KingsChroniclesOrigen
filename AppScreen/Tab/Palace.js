import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PALACE_DATA} from '../../data/PalaceData';
import MainLayout from '../../components/Layout/MainLayout';
import { useGame } from '../../store/context';

const UNLOCK_COST = 1000;
const PALACE_UNLOCK_KEY = 'unlockedPalaces';

const Palace = ({navigation}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [palaceData, setPalaceData] = useState(PALACE_DATA);
  const { totalScore, deductScore } = useGame();

  // Load unlocked palaces from storage
  useEffect(() => {
    loadUnlockedPalaces();
  }, []);

  const loadUnlockedPalaces = async () => {
    try {
      const unlockedPalaces = await AsyncStorage.getItem(PALACE_UNLOCK_KEY);
      if (unlockedPalaces) {
        const unlockedIds = JSON.parse(unlockedPalaces);
        const updatedPalaces = palaceData.map(palace => ({
          ...palace,
          isLocked: !unlockedIds.includes(palace.id)
        }));
        setPalaceData(updatedPalaces);
      }
    } catch (error) {
      console.error('Error loading unlocked palaces:', error);
    }
  };

  const saveUnlockedPalace = async (palaceId) => {
    try {
      const existingUnlocked = await AsyncStorage.getItem(PALACE_UNLOCK_KEY);
      const unlockedIds = existingUnlocked ? JSON.parse(existingUnlocked) : [];
      const updatedUnlocked = [...unlockedIds, palaceId];
      await AsyncStorage.setItem(PALACE_UNLOCK_KEY, JSON.stringify(updatedUnlocked));
    } catch (error) {
      console.error('Error saving unlocked palace:', error);
    }
  };

  const handleUnlockPalace = async () => {
    const currentPalace = palaceData[currentIndex];
    
    if (totalScore >= UNLOCK_COST) {
      Alert.alert(
        'Unlock Palace',
        `Do you want to spend ${UNLOCK_COST} coins to unlock this palace?`,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Unlock',
            onPress: async () => {
              // Use the new deductScore function
              const success = await deductScore(UNLOCK_COST);
              
              if (success) {
                // Update palace data
                const updatedPalaces = [...palaceData];
                updatedPalaces[currentIndex] = {
                  ...currentPalace,
                  isLocked: false
                };
                setPalaceData(updatedPalaces);
                
                // Save unlocked status
                await saveUnlockedPalace(currentPalace.id);
                
                // Show success message
                Alert.alert('Success', 'Palace unlocked successfully!');
              } else {
                Alert.alert('Error', 'Failed to unlock palace. Please try again.');
              }
            }
          }
        ]
      );
    } else {
      Alert.alert('Insufficient Coins', 'You need more coins to unlock this palace.');
    }
  };

  const handlePalaceAction = () => {
    const currentPalace = palaceData[currentIndex];
    if (!currentPalace.isLocked) {
      navigation.navigate('PalaceDetails', {palace: currentPalace});
    } else {
      handleUnlockPalace();
    }
  };

  const handleNext = () => {
    if (currentIndex < PALACE_DATA.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <MainLayout>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Total Score Display */}
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Total Coins: {totalScore}</Text>
          </View>

          {/* Navigation Arrows */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              onPress={handlePrevious}
              disabled={currentIndex === 0}
              style={[
                styles.navArrow,
                currentIndex === 0 && styles.arrowDisabled,
              ]}>
              <Image
                source={require('../../assets/image/icons/left.png')}
                style={[styles.arrowIcon, {tintColor: '#C6A44E'}]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNext}
              disabled={currentIndex === PALACE_DATA.length - 1}
              style={[
                styles.navArrow,
                currentIndex === PALACE_DATA.length - 1 && styles.arrowDisabled,
              ]}>
              <Image
                source={require('../../assets/image/icons/right.png')}
                style={[styles.arrowIcon, {tintColor: '#C6A44E'}]}
              />
            </TouchableOpacity>
          </View>

          {/* Palace Image */}
          <View style={styles.imageContainer}>
            <Image
              source={palaceData[currentIndex].image}
              style={styles.palaceImage}
              resizeMode="cover"
            />
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              palaceData[currentIndex].isLocked ? styles.lockedButton : styles.learnButton,
            ]}
            onPress={handlePalaceAction}>
            {palaceData[currentIndex].isLocked ? (
              <View style={styles.coinContainer}>
                <Text style={styles.coinText}>{UNLOCK_COST}</Text>
                <Image
                  source={require('../../assets/image/icons/coin.png')}
                  style={styles.coinIcon}
                />
              </View>
            ) : (
              <Text style={styles.buttonText}>Learn More</Text>
            )}
          </TouchableOpacity>
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
    alignItems: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    // marginTop: 20,
  },
  navArrow: {
    padding: 10,
  },
  arrowDisabled: {
    opacity: 0.5,
  },
  arrowIcon: {
    width: 54,
    height: 36,
  },
  imageContainer: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height * 0.6,
    marginVertical: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  palaceImage: {
    width: '100%',
    height: '100%',
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  lockedButton: {
    backgroundColor: '#171717',
  },
  learnButton: {
    backgroundColor: '#C6A44E',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coinText: {
    color: '#C6A44E',
    fontSize: 16,
    fontWeight: '600',
  },
  coinIcon: {
    width: 20,
    height: 20,
  },
  scoreContainer: {
    padding: 10,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C6A44E',
  },
});

export default Palace;
