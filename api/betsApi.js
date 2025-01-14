// filepath: /c:/wanttodie/mockbet/api/betsApi.js
let key = "6680a06291e7ea0058cb2c1edcb720bc";
let url = "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds?apiKey=" + key + "&regions=us&oddsFormat=american";




export const fetchBets = async () => {
  try {
    const response = await fetch(url)
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