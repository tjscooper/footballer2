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

  isWinning = (homeAway, { homeTeam, awayTeam, odds }) => {
    let isFav = null;
    let spreadScore = 0;
    let isWinning = null;
    if (homeAway === 'home') {
      isFav = odds.favourite.home;
      spreadScore = isFav
        ? Number(homeTeam.score) 
        : Number(homeTeam.score) + Math.abs(odds.spread) + 0.5 // 0.5 to cover;
      isWinning = spreadScore > awayTeam.score;
    } else if (homeAway === 'away') {
      isFav = odds.favourite.away;
      spreadScore = isFav
        ? Number(awayTeam.score) 
        : Number(awayTeam.score) + Math.abs(odds.spread) + 0.5 // 0.5 to cover;
      isWinning = spreadScore > homeTeam.score;
    }
    return isWinning;
  }

  createGameDictionary() {
    // games list cannot be empty
    if (!this.games.length) {
      return null;
    }

    let retObj = {};

    // for each game
    this.games.map((game) => {
      const homeWinning = this.isWinning('home', game);

      // Get winning team Id
      const winningTeamId = homeWinning
        ? game.homeTeam.id
        : game.awayTeam.id;
      
      // Add team id to dictionary
      retObj[game.gameId] = {
        teams: { home: game.homeTeam.id, away: game.awayTeam.id },
        winningTeamId,
        pregame: game.gameStatus.status === 'pre' ? true : false, 
        active: game.gameStatus.status === 'in' ? true : false,
        final: game.gameStatus.status === 'post' ? true : false,
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
      const losing = [];

      // for each pick
      this.picks
        .filter(p => p.userId === player._id)
        .map((pick) => {
          // winning team id = game dictionary [pick gameId]
          const { winningTeamId, pregame, active, final } = gameDictionary[pick.gameId];
          
          // if winning team id = pick team id
          if (winningTeamId === pick.teamId) {
            // if game active
            if (pregame) {
              // hide from users
            } else if (active) {
              // show who is winning any games
              winning.push(pick);
            } else if (post) {
              // show the finished games
              wins.push(pick);
            }
          } else {
            losing.push(pick);
          }
        });
      // total = sum winning and wins
      const totalWins = wins.length + winning.length;
      const stats = {
        username: player.username,
        wins: wins.length,
        winning: winning.length,
        losing: losing.length,
        totalWins
      };
      return stats;
    });
    
    const sorted = [...leaderboard.sort((a, b) => b.totalWins - a.totalWins)];
    const trimmedAndSorted = [
      ...sorted
           .slice(0, 5)
           .sort((a, b) => b.totalWins - a.totalWins)
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