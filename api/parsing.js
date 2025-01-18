import AsyncStorage from '@react-native-async-storage/async-storage';

export const getTeamsWithDraftKingsPrices = async () => {
  try {
    const storedBets = await AsyncStorage.getItem('betData');
    if (storedBets !== null) {
      const betData = JSON.parse(storedBets);
      return betData.map(bet => {
        const draftKings = bet.bookmakers.find(bookmaker => bookmaker.key === 'draftkings');
        if (draftKings) {
          const homeTeamOutcome = draftKings.markets[0].outcomes.find(outcome => outcome.name === bet.home_team);
          const awayTeamOutcome = draftKings.markets[0].outcomes.find(outcome => outcome.name === bet.away_team);
          return {
            id: bet.id,
            home_team: bet.home_team,
            away_team: bet.away_team,
            home_team_price: homeTeamOutcome ? homeTeamOutcome.price : null,
            away_team_price: awayTeamOutcome ? awayTeamOutcome.price : null,
            commence_time: bet.commence_time,
          };
        }
        return null;
      }).filter(item => item !== null); // Filter out any null values
    } else {
      console.error('No bet data found in AsyncStorage');
      return [];
    }
  } catch (error) {
    console.error('Error fetching bet data from AsyncStorage:', error);
    return [];
  }
};