import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React from 'react';
import MainLayout from '../../components/Layout/MainLayout';

const PromotionScreen = ({navigation}) => {
  return (
    <MainLayout>
      <View style={styles.container}>
        {/* Timeline Design */}
        <View style={styles.timelineContainer}>
          {/* <View style={styles.timeline}> */}
          {/* <View style={styles.timelineLine} /> */}
          {/* <View style={[styles.timelineDot, {left: '25%'}]} /> */}
          <Image
            source={require('../../assets/image/ui/hourglass.png')}
            style={styles.hourglassIcon}
          />
          <View style={[styles.timelineDot, {right: '25%'}]} />
          {/* </View> */}
        </View>

        <ScrollView>
          {/* Content */}
          <View style={styles.contentContainer}>
            <Text style={styles.description}>
              We will dive into the fascinating world of great rulers and
              monarchs whose fates and decisions left an indelible mark on
              history. In the "Kings and Queens" section, you will discover
              captivating stories about rulers from different eras and
              continents, their victories, mistakes, and legacies. Learn how
              their actions shaped the course of events, influenced cultures and
              world powers, and how their legacy continues to live on in the
              modern world.
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('TabBarNavigation')}>
              <Text style={styles.buttonText}>Time Travel with Kings</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </MainLayout>
  );
};

export default PromotionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  timelineContainer: {
    // marginTop: 30,
    // marginBottom: 30,
    // height: 60,
    // justifyContent: 'center',
    // marginBottom: 60,
    marginVertical: 50,
    // width: '100%',
    alignContent: 'center',
    alignItems: 'center',
  },
  timeline: {
    height: 2,
    backgroundColor: '#000',
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#000',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#C5A572',
    position: 'absolute',
    top: -4,
  },
  hourglassIcon: {
    // width: 24,
    // height: 54,
    position: 'absolute',
    // left: '50%',
    top: -11,
    // marginLeft: -12,
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 10,
    marginVertical: 40,
  },
  description: {
    fontSize: 22,
    lineHeight: 24,
    color: '#000',
    textAlign: 'left',
    marginBottom: 40,
    fontWeight: '500',
    lineHeight:36
  },
  button: {
    backgroundColor: '#C5A572',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
