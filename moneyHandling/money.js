import { TaskContext } from '../context/TaskContext';
import React, { useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { getResults } from '../api/betsApi';

const startingAmount = 100000;
let currMoney = startingAmount; 
let currentBets = {}; 


const loadCurrentBetsAndMoney = async () => {
  try {
    const bets = await AsyncStorage.getItem('currentBets');
    const money = await AsyncStorage.getItem('currMoney');
    if (bets !== null) {
      currentBets = JSON.parse(bets);
    }
    if (money !== null) {
      currMoney = JSON.parse(money);
    }
  } catch (error) {
    console.error('Error loading bets and money from local storage:', error);
  }
};


loadCurrentBetsAndMoney();

export const getMoney = () => {
  console.log(currMoney);
  return currMoney;
};

export const subtractMoney = (amount) => {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error('Amount must be a positive integer');
  }
  currMoney -= amount;
  return currMoney;
};

export const addMoney = (amount) => {
  amount = parseInt(amount, 10);
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error('Amount must be a positive integer');
  }
  currMoney += amount;
  console.log(currMoney);
  return currMoney;
};

export const placeBet = async (amount, selectedTeam, selectedOdds, id, addTask, commence_time) => {
  amount = parseInt(amount, 10);
  console.log(commence_time);

  const newDate = new Date(commence_time);
  const currentTime = new Date().toISOString();
  if (newDate < currentTime) {
    throw new Error('Cannot place bet on a game that has already started');
  }
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error('Amount must be a positive integer');
  }
  if (amount > currMoney) {
    throw new Error('Not enough money to place bet');
  }
  if (currentBets[id]) {
    throw new Error('Bet already placed for this game');
  }

  subtractMoney(amount);
  console.log(currMoney);
  
  console.log(id, selectedTeam, selectedOdds);

  const newTask = {
    id,
    team: selectedTeam,
    odds: selectedOdds,
    commence_time,
  };
  addTask(newTask);

  currentBets[id] = { team: selectedTeam, odds: selectedOdds, amount, commence_time };

  await saveToLocalStorage(currentBets, currMoney);
  
  return currMoney;
};

export const winBet = (amount, odds) => {
  amount = parseInt(amount, 10);
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error('Amount must be a positive integer');
  }

  let winnings;
  if (odds > 0) {
    // Positive odds
    winnings = (amount * odds) / 100;
  } else {
    // Negative odds
    winnings = (amount * 100) / Math.abs(odds);
  }

  currMoney += amount + winnings; 
  console.log(currMoney);
  return currMoney;
};

export const removeBet = async (id) => {
  if (!currentBets[id]) {
    throw new Error('Bet not found');
  }

  // Refund the bet amount
  const { amount } = currentBets[id];
  currMoney += amount;

  // Remove the bet from the currentBets dictionary
  delete currentBets[id];

  // Save the updated currentBets and currMoney to local storage
  await saveToLocalStorage(currentBets, currMoney);

  console.log('Bet removed:', id);
  return currMoney;
};

const saveToLocalStorage = async (bets, money) => {
  try {
    await AsyncStorage.setItem('currentBets', JSON.stringify(bets));
    await AsyncStorage.setItem('currMoney', JSON.stringify(money));
    console.log('Data saved to localStorage:', { bets, money });
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

export const checkResults = async () => {
  console.log('Checking results...');
  try {
    const results = await getResults();
    const currentTime = new Date();

    for (const [id, bet] of Object.entries(currentBets)) {
      const { team, amount, odds, commence_time } = bet;
      const gameTime = new Date(commence_time);

      // Remove bet if the game time is before the current time
      if (gameTime < currentTime) {
        const result = results.find(result => result.id === id);
        if (result && result.completed) {
          const homeTeamScore = result.scores.find(score => score.name === result.home_team).score;
          const awayTeamScore = result.scores.find(score => score.name === result.away_team).score;

          let won = false;
          if (team === result.home_team && homeTeamScore > awayTeamScore) {
            won = true;
          } else if (team === result.away_team && awayTeamScore > homeTeamScore) {
            won = true;
          }

          if (won) {
            console.log(`Bet on ${team} won!`);
            winBet(amount, odds);
          } else {
            console.log(`Bet on ${team} lost.`);
          }
        }

        delete currentBets[id];
      }
    }

    await saveToLocalStorage(currentBets, currMoney);
  } catch (error) {
    console.error('Error checking results:', error);
  }
};
