import React, {createContext, useState, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GameContext = createContext({
  gameScores: [],
  totalScore: 0,
  addGameScore: async score => {},
  deductScore: async amount => {},
  getTotalScore: () => 0,
  isMusicEnable: () => {},
  setIsMusicEnable: () => {},
});

export function GameProvider({children}) {
  const [gameScores, setGameScores] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [isMusicEnable, setIsMusicEnable] = useState(true);
  // console.log('totalScore', totalScore);

  // Load scores from AsyncStorage when app starts
  React.useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    try {
      const savedScores = await AsyncStorage.getItem('gameScores');
      if (savedScores) {
        const parsedScores = JSON.parse(savedScores);
        setGameScores(parsedScores);
        // Calculate and set total score when loading
        const total = parsedScores.reduce((sum, game) => sum + game.score, 0);
        setTotalScore(total);
      }
    } catch (error) {
      console.error('Error loading scores:', error);
    }
  };

  const addGameScore = async score => {
    try {
      const newScore = {
        score,
        date: new Date().toISOString(),
      };

      const updatedScores = [...gameScores, newScore];
      await AsyncStorage.setItem('gameScores', JSON.stringify(updatedScores));
      setGameScores(updatedScores);
      // Update total score when adding new score
      setTotalScore(prevTotal => prevTotal + score);
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  // New function to handle score deduction
  const deductScore = async amount => {
    try {
      const newTotal = totalScore - amount;
      if (newTotal >= 0) {
        // Update the last game score to reflect deduction
        const updatedScores = [...gameScores];
        if (updatedScores.length > 0) {
          updatedScores[updatedScores.length - 1].score -= amount;
        }

        await AsyncStorage.setItem('gameScores', JSON.stringify(updatedScores));
        setGameScores(updatedScores);
        setTotalScore(newTotal);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deducting score:', error);
      return false;
    }
  };

  // Get total score from state
  const getTotalScore = () => totalScore;

  return (
    <GameContext.Provider
      value={{
        gameScores,
        totalScore,
        addGameScore,
        deductScore,
        getTotalScore,
        isMusicEnable,
        setIsMusicEnable,
      }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
