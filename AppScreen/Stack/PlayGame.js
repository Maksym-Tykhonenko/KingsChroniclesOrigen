import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Text,
  Animated,
  TouchableOpacity,
  PanResponder,
  Modal,
} from 'react-native';
import Header from '../../components/Game/Header';
import {useNavigation} from '@react-navigation/native';
import {useGame} from '../../store/context';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const ARCHER_SIZE = 100;
const TARGET_SIZE = 50;
const ARROW_SIZE = 60;
const GAME_DURATION = 120;
const MAX_PULL = 150;
const HIT_THRESHOLD = TARGET_SIZE; // Made even more forgiving
const MAX_POWER = 700;
const MIN_POWER = 200;
const TARGET_SCORE = 100; // Score per target hit
const WINNING_SCORE = 500; // Total score needed to win

const PlayGame = () => {
  const navigation = useNavigation();
  const {addGameScore, gameScores} = useGame();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [targets, setTargets] = useState([]);
  const [isArrowFlying, setIsArrowFlying] = useState(false);
  const [aimAngle, setAimAngle] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [debugPoint, setDebugPoint] = useState(null); // Add debug point state
  const [power, setPower] = useState(MAX_POWER);
  const [arrowPath, setArrowPath] = useState([]); // Track arrow path
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // console.log('gameScores', gameScores);
  const arrowAnimation = useRef(new Animated.ValueXY()).current;

  // Format time to MM:SS
  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    generateTargets();
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const generateTargets = () => {
    // Fixed positions for targets relative to screen dimensions
    const targetPositions = [
      {
        x: SCREEN_WIDTH * 0.2, // Left target
        y: SCREEN_HEIGHT * 0.25,
      },
      {
        x: SCREEN_WIDTH * 0.5, // Top center target
        y: SCREEN_HEIGHT * 0.16,
      },
      {
        x: SCREEN_WIDTH * 0.8, // Right target
        y: SCREEN_HEIGHT * 0.23,
      },
    ];

    const newTargets = targetPositions.map((position, i) => ({
      id: i,
      x: position.x - TARGET_SIZE / 2,
      y: position.y - TARGET_SIZE / 2,
      isHit: false,
    }));

    setTargets(newTargets); // Set the targets in state
    console.log('Generated targets:', newTargets); // Debug log
  };

  const updatePower = gesture => {
    // Convert vertical drag to power
    const newPower =
      MAX_POWER - Math.max(0, Math.min(gesture.dy, MAX_POWER - MIN_POWER));
    setPower(newPower);
  };

  const checkHits = (arrowX, arrowY) => {
    setDebugPoint({x: arrowX, y: arrowY});

    let hitSomething = false;

    setTargets(currentTargets => {
      const newTargets = currentTargets.map(target => {
        const targetCenterX = target.x + TARGET_SIZE / 2;
        const targetCenterY = target.y + TARGET_SIZE / 2;

        const distance = Math.sqrt(
          Math.pow(arrowX - targetCenterX, 2) +
            Math.pow(arrowY - targetCenterY, 2),
        );

        if (distance < HIT_THRESHOLD && !target.isHit) {
          hitSomething = true;
          return {...target, isHit: true};
        }
        return target;
      });

      if (hitSomething) {
        setScore(prevScore => {
          const newScore = prevScore + 100;
          // Check if all targets are hit (300 points total)
          if (newScore >= 300) {
            handleGameComplete(newScore);
          }
          return newScore;
        });
      }

      return newTargets;
    });
  };

  const handleGameComplete = async finalScore => {
    try {
      await addGameScore(finalScore);
      // Short delay before navigation
      setTimeout(() => {
        navigation.navigate('TabBarNavigation', {screen: 'Game'});
      }, 500);
    } catch (error) {
      console.error('Error saving game score:', error);
    }
  };

  const generateNewTargets = () => {
    return Array.from({length: 3}, (_, i) => ({
      id: i,
      x: 50 + Math.random() * (SCREEN_WIDTH - TARGET_SIZE - 100),
      y: 100 + Math.random() * (SCREEN_HEIGHT / 3),
      isHit: false,
    }));
  };

  const shootArrow = () => {
    if (isArrowFlying) return;

    setIsArrowFlying(true);
    setDebugPoint(null);

    const targetX = Math.cos(aimAngle) * power;
    const targetY = Math.sin(aimAngle) * power;

    const startX = SCREEN_WIDTH / 2;
    const startY = SCREEN_HEIGHT - 150;

    Animated.timing(arrowAnimation, {
      toValue: {x: targetX, y: targetY},
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      const finalX = startX + targetX;
      const finalY = startY + targetY;

      checkHits(finalX, finalY);

      setTimeout(() => {
        setIsArrowFlying(false);
        arrowAnimation.setValue({x: 0, y: 0});
      }, 100);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        setPower(MAX_POWER);
      },
      onPanResponderMove: (_, gesture) => {
        if (isArrowFlying) return;

        const dx = gesture.dx;
        const dy = gesture.dy;
        const angle = Math.atan2(-dy, -dx);
        setAimAngle(angle);

        // Update power based on drag distance
        updatePower(gesture);
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
      },
    }),
  ).current;

  const renderAimLine = () => {
    if (!isDragging) return null;

    return (
      <>
        {/* Direction line */}
        <View
          style={[
            styles.aimLine,
            {
              width: 100,
              transform: [{rotate: `${aimAngle}rad`}],
            },
          ]}
        />
        {/* Arrow indicator at the end of line */}
        <View
          style={[
            styles.aimArrowIndicator,
            {
              transform: [
                {translateX: Math.cos(aimAngle) * 100},
                {translateY: Math.sin(aimAngle) * 100},
                {rotate: `${aimAngle}rad`},
              ],
            },
          ]}>
          <View style={styles.aimArrowHead} />
        </View>
      </>
    );
  };

  const getPowerPercentage = () => {
    return Math.round(((power - MIN_POWER) / (MAX_POWER - MIN_POWER)) * 100);
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setTargets(generateNewTargets());
    setShowSuccessModal(false);
    setIsArrowFlying(false);
    arrowAnimation.setValue({x: 0, y: 0});
  };

  // Add game over check when time runs out
  useEffect(() => {
    if (timeLeft === 0) {
      // Game over logic
      setShowSuccessModal(true);
    }
  }, [timeLeft]);

  return (
    <View style={styles.container}>
      <Header score={score} />
      <View style={styles.header}>
        {/* <Text style={styles.score}>{score}/500</Text> */}
        <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
      </View>

      <View style={styles.gameArea} {...panResponder.panHandlers}>
        {/* Power meter with improved percentage display */}
        <View style={styles.powerMeterContainer}>
          <Text style={styles.powerLabel}>POWER</Text>
          <View style={styles.powerMeter}>
            <View
              style={[
                styles.powerLevel,
                {
                  height: `${(power / MAX_POWER) * 100}%`,
                  backgroundColor:
                    power > MAX_POWER * 0.7
                      ? '#FF4444'
                      : power > MAX_POWER * 0.4
                      ? '#FFB344'
                      : '#44FF44',
                },
              ]}
            />
            {/* Power level markers with percentages */}
            <View style={[styles.powerMarker, {bottom: '75%'}]}>
              <Text style={styles.markerText}>75%</Text>
            </View>
            <View style={[styles.powerMarker, {bottom: '50%'}]}>
              <Text style={styles.markerText}>50%</Text>
            </View>
            <View style={[styles.powerMarker, {bottom: '25%'}]}>
              <Text style={styles.markerText}>25%</Text>
            </View>
          </View>
          <View style={styles.powerPercentageContainer}>
            <Text style={styles.powerPercentage}>
              {`${getPowerPercentage()}%`}
            </Text>
          </View>
        </View>

        {targets.map(target => (
          <View key={target.id}>
            <Image
              source={require('../../assets/image/arrowgame/targetSmall.png')}
              style={[
                styles.target,
                {
                  left: target.x,
                  top: target.y,
                  opacity: target.isHit ? 0.5 : 1,
                },
              ]}
            />
            {/* Debug view to see target position */}
            {/* <View
              style={[
                styles.targetDebug,
                {
                  left: target.x + TARGET_SIZE / 2,
                  top: target.y + TARGET_SIZE / 2,
                },
              ]}
            /> */}
          </View>
        ))}

        {/* Debug point to show where arrow lands */}
        {debugPoint && (
          <View
            style={[
              styles.debugPoint,
              {
                left: debugPoint.x,
                top: debugPoint.y,
              },
            ]}
          />
        )}

        {/* Direction control moved to right */}
        <View style={styles.directionControl}>
          {/* <View style={styles.directionBase} /> */}
          {/* <View
            style={[
              styles.aimLine,
              {
                width: 80,
                transform: [{rotate: `${aimAngle}rad`}],
              },
            ]}
          /> */}
          <View
            style={[
              styles.aimArrowIndicator,
              {
                transform: [
                  {translateX: Math.cos(aimAngle) * 80},
                  {translateY: Math.sin(aimAngle) * 80},
                  {rotate: `${aimAngle}rad`},
                ],
              },
            ]}>
            <View style={styles.aimArrowHead} />
          </View>
        </View>

        {/* Archer position */}
        <View
          style={[
            styles.archerContainer,
            {left: SCREEN_WIDTH / 2 - ARCHER_SIZE / 2},
          ]}>
          <Image
            source={require('../../assets/image/arrowgame/archer1.png')}
            style={styles.archerImage}
            resizeMode="contain"
          />
          <Animated.Image
            source={require('../../assets/image/arrowgame/arrow.png')}
            style={[
              styles.arrow,
              {
                transform: [
                  {translateX: arrowAnimation.x},
                  {translateY: arrowAnimation.y},
                  {rotate: `${aimAngle}rad`},
                ],
              },
            ]}
            resizeMode="contain"
          />
          {/* {renderAimLine()} */}
        </View>

        <TouchableOpacity
          style={[
            styles.shootButton,
            isArrowFlying && styles.shootButtonDisabled,
          ]}
          onPress={shootArrow}
          disabled={isArrowFlying}>
          <Text style={styles.shootButtonText}>
            {isArrowFlying ? 'FIRING...' : 'SHOOT'}
          </Text>
        </TouchableOpacity>

        {/* <View style={styles.debugInfo}>
          <Text>Angle: {Math.round((aimAngle * 180) / Math.PI)}°</Text>
          <Text>Flying: {isArrowFlying ? 'Yes' : 'No'}</Text>
          <Text>Score: {score}</Text>
        </View> */}
      </View>

      {/* Success Modal */}
      <Modal transparent visible={showSuccessModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {score >= WINNING_SCORE ? 'Congratulations!' : 'Game Over!'}
            </Text>
            <Text style={styles.modalScore}>Final Score: {score}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={resetGame}>
              <Text style={styles.modalButtonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  archerContainer: {
    position: 'absolute',
    bottom: 100,
    width: ARCHER_SIZE,
    height: ARCHER_SIZE,
  },
  archerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF5E0',
  },
  header: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#171717',
    position: 'absolute',
    top: '7%',
    left: 0,
    right: 0,
    zIndex: 1000,
    width: '20%',
    alignSelf: 'center',
    borderRadius: 10,
    padding: 10,
    marginLeft: '40%',
  },
  score: {
    color: '#C6A44E',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timer: {
    color: '#C6A44E',
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 60, // Ensure consistent width for timer
    textAlign: 'center',
  },
  gameArea: {
    flex: 1,
  },
  target: {
    position: 'absolute',
    width: TARGET_SIZE,
    height: TARGET_SIZE,
    resizeMode: 'contain',
  },
  archer: {
    position: 'absolute',
    bottom: 120,
    width: ARCHER_SIZE,
    height: ARCHER_SIZE,
    // backgroundColor: '#171717',
  },
  directionControl: {
    position: 'absolute',
    right: 20,
    bottom: 100, // Aligned with shoot button
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  directionBase: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#C6A44E',
    borderWidth: 2,
    borderColor: '#171717',
  },
  arrow: {
    position: 'absolute',
    width: ARROW_SIZE * 2,
    // height: ARROW_SIZE,
    // top: ARCHER_SIZE / 2 - ARROW_SIZE / 2,
    // left: ARCHER_SIZE / 2,
    height: 100,
    top: 200,
  },
  aimLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#C6A44E',
    top: ARCHER_SIZE / 2,
    left: ARCHER_SIZE / 2,
  },
  aimArrowIndicator: {
    position: 'absolute',
    top: ARCHER_SIZE / 2 - 5,
    left: ARCHER_SIZE / 2,
  },
  aimArrowHead: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 60,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#C6A44E',
    transform: [{rotate: '90deg'}],
  },
  shootButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#C6A44E',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    zIndex: 999,
  },
  shootButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    zIndex: 1000,
  },
  debugInfo: {
    position: 'absolute',
    top: 100,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
  },
  targetHit: {
    backgroundColor: '#171717',
    borderColor: '#C6A44E',
    transform: [{scale: 0.9}],
  },
  targetCenter: {
    width: 4,
    height: 4,
    // backgroundColor: '#FF0000',
    borderRadius: 2,
  },
  targetCenterHit: {
    backgroundColor: '#FFF',
  },
  shootButtonDisabled: {
    backgroundColor: '#888888',
  },
  debugPoint: {
    position: 'absolute',
    width: 10,
    height: 10,
    // backgroundColor: '#FF0000',
    borderRadius: 5,
    zIndex: 999,
  },
  powerMeterContainer: {
    position: 'absolute',
    left: 20,
    bottom: 30,
    alignItems: 'center',
  },
  powerLabel: {
    color: '#171717',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  powerMeter: {
    width: 20,
    height: 200,
    backgroundColor: '#E5E5E5',
    borderRadius: 10,
    overflow: 'hidden',
  },
  powerMarker: {
    position: 'absolute',
    left: -5,
    width: 30,
    height: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  markerText: {
    position: 'absolute',
    left: -30,
    top: -8,
    fontSize: 12,
    color: '#171717',
  },
  powerPercentageContainer: {
    backgroundColor: '#171717',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 10,
  },
  powerPercentage: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  powerLevel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#171717',
    marginBottom: 10,
  },
  modalScore: {
    fontSize: 18,
    color: '#171717',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#C6A44E',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  targetDebug: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    zIndex: 1000,
  },
});

export default PlayGame;
