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
    this.data = null;

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
          // winning team id = game dictionary [pick gameId]
          const { winningTeamId, active } = gameDictionary[pick.gameId];
          
          // if winning team id = pick team id
          if (winningTeamId === pick.teamId) {
            // if game active
            active ? winning.push(pick) : wins.push(pick);
          }
        });
      // total = sum winning and wins
      const total = wins.length + winning.length;
      return {
        username: player.username,
        wins: wins.length,
        winning: winning.length,
        total
      };
    });
    
    const sorted = [...leaderboard.sort((a, b) => b.total - a.total)];
    const trimmedAndSorted = [
      ...sorted
           .slice(0, 5)
           .sort((a, b) => b.total - a.total)
    ];
    
    this.data = {
      top5: trimmedAndSorted,
      full: sorted
    }
    
    return this.data;
  }

  setData(data) {
    if (!data) {
      this.data = null;
    }
    this.data = data;
  }

  setMeta(metaKey, metaValue) {
    if (!metaKey || !metaValue) {
      return;
    }
    this.meta[metaKey] = metaValue;
  }

  getHorizontalBarChartData(chartName) {
    switch (chartName) {
      case 'top-5': return this.getLeaderboardTop5();
      default: return null;
    }
  }
}