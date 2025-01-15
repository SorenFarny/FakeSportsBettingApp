import AsyncStorage from '@react-native-async-storage/async-storage';

let key = "6680a06291e7ea0058cb2c1edcb720bc";
let url = "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds?apiKey=" + key + "&regions=us&oddsFormat=american";
let url2 = "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/scores/?daysFrom=3&apiKey=" + key;

export const fetchBets = async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    console.log('Fetched data:', data);
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};

export const getResults = async () => {
  try {
    const response = await fetch(url2);
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};

export const saveBetsToFile = async () => {
  try {
    const data = await fetchBets();
    await AsyncStorage.setItem('betData', JSON.stringify(data));
    console.log('Data written to AsyncStorage');
  } catch (error) {
    console.error('Error saving data to AsyncStorage:', error);
  }
};

export const clearAllLocalStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('All local storage cleared');
  } catch (error) {
    console.error('Error clearing local storage:', error);
  }
};