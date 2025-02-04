import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import MainLayout from '../../components/Layout/MainLayout';

const battles = [
  {id: 1, title: 'Battle of Hastings (1066)'},
  {id: 2, title: 'Battle of Agincourt (1415)'},
  {id: 3, title: 'Battle of Waterloo (1815)'},
  {id: 4, title: 'Siege of Sevastopol (1854)'},
  {id: 5, title: 'Battle of Grunwald (1410)'},
];

const BattleList = ({navigation}) => {
  const [selectedBattle, setSelectedBattle] = useState(null);

  const handleBattleSelect = battle => {
    // console.log(battle);
    // navigation.navigate('BattleScreen', {battle: battle});
    setSelectedBattle(battle);
  };

  const handleKingsBattle = () => {
    if (selectedBattle) {
      console.log(selectedBattle);
      console.log(`Navigating to battle: ${selectedBattle.title}`);
      // navigation.navigate('BattleDetails', { battle: selectedBattle });
      navigation.navigate('BattleScreen', {battle: selectedBattle});
    }
  };

  return (
    <MainLayout>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {battles.map(battle => (
              <Pressable
                key={battle.id}
                onPress={() => handleBattleSelect(battle)}
                style={({pressed}) => [
                  styles.battleItem,
                  selectedBattle?.id === battle.id && styles.selectedBattle,
                  pressed && styles.pressedBattle,
                ]}>
                <Text
                  style={[
                    styles.battleText,
                    selectedBattle?.id === battle.id &&
                      styles.selectedBattleText,
                  ]}>
                  {battle.title}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <Pressable
          style={({pressed}) => [
            styles.kingsBattleButton,
            pressed && styles.pressedKingsBattle,
            !selectedBattle && styles.disabledKingsBattle,
          ]}
          onPress={handleKingsBattle}
          disabled={!selectedBattle}>
          <Text style={styles.kingsBattleText}>King's Battle</Text>
        </Pressable>
      </SafeAreaView>
    </MainLayout>
  );
};

export default BattleList;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: '#FFF',
  },
  scrollView: {
    flex: 1,
    paddingTop: 50,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  container: {
    gap: 16,
  },
  battleItem: {
    backgroundColor: '#171717',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  selectedBattle: {
    backgroundColor: '#C6A44E',
  },
  pressedBattle: {
    opacity: 0.8,
  },
  battleText: {
    color: '#C6A44E',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedBattleText: {
    color: '#171717',
  },
  kingsBattleButton: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: '#C6A44E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  pressedKingsBattle: {
    opacity: 0.8,
  },
  disabledKingsBattle: {
    opacity: 0.5,
  },
  kingsBattleText: {
    color: '#171717',
    fontSize: 16,
    fontWeight: '600',
  },
});
