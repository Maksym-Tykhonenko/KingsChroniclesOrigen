import {StyleSheet, Text, View, Image} from 'react-native';

const Header = ({score}) => {
  return (
    <View style={styles.header}>
      <View style={styles.kingContainer}>
        <Image
          source={require('../../assets/image/arrowgame/kingLeft.png')}
          style={[
            styles.kingIcon,
            {transform: [{scale: 2.5}, {translateY: -7}]},
          ]}
        />
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>{score}</Text>
          <Image
            source={require('../../assets/image/arrowgame/coin.png')}
            style={styles.coinIcon}
          />
        </View>
        <Image
          source={require('../../assets/image/arrowgame/kingRight.png')}
          style={[styles.kingIcon, {transform: [{scale: 3.5}]}]}
        />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#D8F0C7',
    paddingTop: 100,
    zIndex: 100,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomWidth: 10,
    borderBottomColor: '#D7B154',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#171717',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  score: {
    color: '#C6A44E',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 5,
  },
  coinIcon: {
    width: 20,
    height: 20,
  },
  kingContainer: {
    width: '100%',
    // backgroundColor: '#171717',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kingIcon: {
    width: 50,
    height: 50,
  },
});
