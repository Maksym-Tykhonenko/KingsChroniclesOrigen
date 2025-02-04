import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FilterScreen from './Tab/FilterScreen';
import RoyalScreen from './Tab/RoyalScreen';
import BattleList from './Tab/BattleList';
import Palace from './Tab/Palace';
import Game from './Tab/Game';
import {Image} from 'react-native';
import {
  pauseBackgroundMusic,
  playBackgroundMusic,
  setupPlayer,
} from '../components/Sound/SoundSetting';
import {useGame} from '../store/context';
import {AppState} from 'react-native';
import {useState, useEffect, useRef} from 'react';

const Tab = createBottomTabNavigator();

const TabBarNavigation = () => {
  ////////Music
  const {isMusicEnable, setIsMusicEnable, totalScore} = useGame();
  const [isPlayMusic, setIsPlayMusic] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && isPlayMusic && isMusicEnable) {
        playBackgroundMusic();
      } else if (nextAppState === 'inactive' || nextAppState === 'background') {
        pauseBackgroundMusic();
      }
    });

    const initMusic = async () => {
      await setupPlayer();
      if (isMusicEnable) {
        await playBackgroundMusic();
        setIsPlayMusic(true);
      }
    };
    initMusic();

    return () => {
      subscription.remove();
      pauseBackgroundMusic();
    };
  }, [isMusicEnable]);

  /////////////////////
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#C6A44E',
        tabBarInactiveTintColor: '#171717',
        tabBarItemStyle: {
          paddingTop: 15,
        },
      }}>
      <Tab.Screen
        name="FilterScreen"
        component={FilterScreen}
        options={{
          tabBarIcon: ({color, focused}) => (
            <Image
              source={require('../assets/image/tabbar/crown.png')}
              style={[styles.tabIcon, {tintColor: color}]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="BattleList"
        component={BattleList}
        options={{
          tabBarIcon: ({color, focused}) => (
            <Image
              source={require('../assets/image/tabbar/battle.png')}
              style={[styles.tabIcon, {tintColor: color}]}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Palace"
        component={Palace}
        options={{
          tabBarIcon: ({color, focused}) => (
            <Image
              source={require('../assets/image/tabbar/palace.png')}
              style={[styles.tabIcon, {tintColor: color}]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Game"
        component={Game}
        options={{
          tabBarIcon: ({color, focused}) => (
            <Image
              source={require('../assets/image/tabbar/games.png')}
              style={[styles.tabIcon, {tintColor: color}]}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFF5E0',
    borderTopWidth: 0,
    elevation: 0,
    height: 90,
    paddingBottom: 10,
  },
  tabIcon: {
    width: 34,
    height: 34,
  },
});

export default TabBarNavigation;
