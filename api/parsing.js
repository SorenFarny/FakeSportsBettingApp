import betData from '../data/betData.json'; // Adjust the path if necessary

export const getTeamsWithDraftKingsPrices = () => {
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
};