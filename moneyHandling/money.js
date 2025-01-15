import { TaskContext } from '../context/TaskContext';
import React, { useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { getResults, fetchBets } from '../api/betsApi'; // Import getResults and fetchBets functions

const startingAmount = 100000;
let currMoney = startingAmount; // Example initial value
let currentBets = {}; // Initialize the currentBets dictionary
let games = []; // Initialize the games array

// Load existing bets, money, and games from local storage when the app starts
const loadCurrentBetsAndMoney = async () => {
  try {
    const bets = await AsyncStorage.getItem('currentBets');
    const money = await AsyncStorage.getItem('currMoney');
    const savedGames = await AsyncStorage.getItem('games');
    if (bets !== null) {
      currentBets = JSON.parse(bets);
    }
    if (money !== null) {
      currMoney = JSON.parse(money);
    }
    if (savedGames !== null) {
      games = JSON.parse(savedGames);
    }
  } catch (error) {
    console.error('Error loading bets, money, and games from local storage:', error);
  }
};

export const saveCurrentBets = async () => {
  try {
    await AsyncStorage.setItem('currentBets', JSON.stringify(currentBets));
    console.log('Current bets saved to AsyncStorage');
  } catch (error) {
    console.error('Error saving current bets to AsyncStorage:', error);
  }
};

export const newDay = async () => {
  const day = await AsyncStorage.getItem('day');
  const currentDay = new Date().getDate().toString();
  if (day !== currentDay) {
    await AsyncStorage.setItem('day', currentDay);
    const results = await getResults();
    const newGames = await fetchBets();

    // Process results
    for (const [id, bet] of Object.entries(currentBets)) {
      const { commence_time, team } = bet;
      const newDate = new Date(commence_time);
      const currentTime = new Date();

      if (newDate < currentTime) {
        const result = results.find(result => result.commence_time === commence_time);
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
            winBet(bet.amount, bet.odds);
            // Update money or perform other actions
          } else {
            console.log(`Bet on ${team} lost.`);
            // Update money or perform other actions
          }
        }
      }
    }

    // Compare existing games with new games
    const gamesAreDifferent = JSON.stringify(games) !== JSON.stringify(newGames);

    // Save new games to local storage only if they are different
    if (gamesAreDifferent) {
      games = newGames;
      await AsyncStorage.setItem('games', JSON.stringify(games));
      console.log('New games saved to AsyncStorage');
    } else {
      console.log('Games are the same, no update to AsyncStorage');
    }
  }
};

// Call loadCurrentBetsAndMoney to initialize currentBets, currMoney, and games
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

  // Get the current time from the user's machine

  console.log('Current Time:', currentTime);
  
  const newTask = {
    id,
    team: selectedTeam,
    odds: selectedOdds,
    commence_time,
   
  };
  addTask(newTask);

  // Update the currentBets dictionary
  currentBets[id] = { team: selectedTeam, odds: selectedOdds, amount, commence_time,};

  // Save currentBets and currMoney to local storage
  await saveToLocalStorage(currentBets, currMoney);
  
  return currMoney;
};

export const winBet = (amount, odds) => {
  amount = parseInt(amount, 10);
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error('Amount must be a positive integer');
  }
  currMoney += amount * odds;
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
