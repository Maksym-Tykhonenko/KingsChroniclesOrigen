import {StyleSheet, Text, View, Image, Animated} from 'react-native';
import MainLayout from '../../components/Layout/MainLayout';
import {useEffect, useRef} from 'react';

const WelcomeScreen = ({navigation}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2000, // 2 seconds
      useNativeDriver: false,
    }).start(() => {
      navigation.replace('IntroductionScreen');
    });
  }, []);
  return (
    <MainLayout>
      <Image
        source={require('../../assets/image/welcomeScreen/welcomeKing.png')}
        style={styles.logo}
      />
      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </MainLayout>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  progressContainer: {
    // width: '80%',
    height: 4,
    backgroundColor: '#FFD700',
    borderRadius: 2,
    overflow: 'hidden',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 2,
  },
  logo: {
    width: '100%',
    height: '60%',
  },
});
