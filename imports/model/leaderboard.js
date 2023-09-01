const DEBUG_ENABLED = false;
export default class Leaderboard {

  constructor({
    _id,
    _weekId,
    _players,
    _picks,
    _games,
    _meta = {},
  }){
    // Properties
    this._id = _id;
    this.weekId = _weekId;
    this.players = _players;
    this.picks = _picks;
    this.games = _games;
    this.meta = _meta;

    this.debug = DEBUG_ENABLED || false;
  }

  // Methods
  id() {
    return this._id;
  }

  log(title, obj) {
    if (this.debug) {
      console.log(title, obj);
    }
  }

  getWins() {
    return Math.round(Math.random(8) * 16);
  }

  getWinning() {
    return Math.round(Math.random(8) * 16);
  }

  isHomeWinning = ({ homeTeam, awayTeam, odds }) => {
    const isFav = odds.favourite.home;
    const spreadScore = isFav
      ? Number(homeTeam.score) + odds.spread - 0.5 // 0.5 to cover
      : Number(homeTeam.score);
    return spreadScore > awayTeam.score;
  }

  isAwayWinning = ({ homeTeam, awayTeam, odds }) => {
    const isFav = odds.favourite.away;
    const spreadScore = isFav
      ? Number(awayTeam.score) + odds.spread - 0.5 // 0.5 to cover
      : Number(awayTeam.score);
    return spreadScore > homeTeam.score;
  }

  createGameDictionary() {

    // games list cannot be empty
    if (!this.games.length) {
      return null;
    }

    let retObj = {};

    // for each game
    this.games.map((game) => {
      const homeWinning = this.isHomeWinning(game);
      
      // Get winning team Id
      const winningTeamId = homeWinning
        ? game.homeTeam.id
        : game.awayTeam.id;
      
      // Add team id to dictionary
      retObj[game.gameId] = {
        winningTeamId,
        active: game.gameStatus.status === 'in' ? true : false
      };
    });

    return retObj;
  }

  getLeaderboardTop5() {

    // create game result dictionary
    const gameDictionary = this.createGameDictionary();
    this.log('gameDictionary', gameDictionary);
    
    // create leaderboard list 
    // for each player
    const leaderboard = this.players.map((player) => {
      // data
      const wins = [];
      const winning = [];

      // for each pick
      this.picks
        .filter(p => p.userId === player._id)
        .map((pick) => {
          this.log('pick', pick);
          // winning team id = game dictionary [pick gameId]
          const { winningTeamId, active } = gameDictionary[pick.gameId];
          this.log('winning team id', winningTeamId);

          // if winning team id = pick team id
          if (winningTeamId === pick.teamId) {
            this.log('you picked a winner', {});
            // if game active
            active ? winning.push(pick) : wins.push(pick);
          }
        });
      // total = sum winning and wins
      const total = wins.length + winning.length;
      this.log('total', total);
      // return { username, wins, winning, total }
      return {
        username: player.username,
        wins: wins.length,
        winning: winning.length,
        total
      };
    });
    this.log('leaderboard', leaderboard);

    const sorted = [...leaderboard.sort((a, b) => b.total - a.total)];
    this.log('sorted', sorted);
    const trimmedAndSorted = [
      ...sorted
           .slice(0, 5)
           .sort((a, b) => b.total - a.total)
    ];
    this.log('trimmedAndSorted', trimmedAndSorted);
    return trimmedAndSorted.reverse();
  }

  getHorizontalBarChartData(chartName) {
    switch (chartName) {
      case 'leaderboard-top-5': return this.getLeaderboardTop5();
      default: return null;
    }
  }
}

// let isPicked = false;
// picks.forEach(pick => {
//   if (pick.gameId === gameId && homeTeam.id === teamId) {
//     isPicked = true;
//   }
// });
// return isPicked && spreadScore > awayTeam.score;