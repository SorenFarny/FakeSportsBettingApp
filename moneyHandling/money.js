import { TaskContext } from '../context/TaskContext';
import React, { useContext } from 'react';
import * as FileSystem from 'expo-file-system'; // Import Expo FileSystem
import { Platform } from 'react-native'; // Import Platform module
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const startingAmount = 100000;
let currMoney = startingAmount; // Example initial value
let currentBets = {}; // Initialize the currentBets dictionary

// Load existing bets and money from local storage when the app starts
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

// Call loadCurrentBetsAndMoney to initialize currentBets and currMoney
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
  const currentTime = new Date().toISOString();
  console.log('Current Time:', currentTime);
  
  const newTask = {
    id,
    team: selectedTeam,
    odds: selectedOdds,
    commence_time,
    placed_time: currentTime, // Add the current time to the task
  };
  addTask(newTask);

  // Update the currentBets dictionary
  currentBets[id] = { team: selectedTeam, odds: selectedOdds, amount, commence_time, placed_time: currentTime };

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
