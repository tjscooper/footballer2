const DEBUG_ENABLED = false;
export default class Leaderboard {

  constructor({
    _id,
    _weekId,
    _players,
    _picks,
    _games,
    _summary,
    _meta = {},
  }){
    // Properties
    this._id = _id;
    this.weekId = _weekId;
    this.players = _players;
    this.picks = _picks;
    this.games = _games;
    this.summary = _summary;
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

  getWinningTeamId = ({ homeTeam, awayTeam, odds }) => {
    
    const fav = odds.favourite.home === true ? 'home' : 'away';
    const spread = Math.abs(odds.spread);
    
    // PHI 18 - NE 20, NE -3.5
    // is 20 > 18 = true
    // home is fav, fav is winning
    // but fav has to win by 3.5
    // 20 - 3.5 = 16.5
    // 16.5 > 18 = false

    // Home is fav
    if (fav === 'home') { 
      // is the home team score winning?
      if (homeTeam.score > awayTeam.score) {
        // home team has more points, they must cover the spread
        return (homeTeam.score - spread) > awayTeam.score 
          ? homeTeam.id
          : awayTeam.id;
      } else if (homeTeam.score <= awayTeam.score) {
        return awayTeam.id;
      }

    // Fav is away
    } else if (fav === 'away') { 
      // is the away team score winning?
      if (awayTeam.score > homeTeam.score) {
        // home team has more points, they must cover the spread
        return (awayTeam.score - spread) > homeTeam.score 
          ? awayTeam.id
          : homeTeam.id;
      } else if (awayTeam.score <= homeTeam.score) {
        return homeTeam.id;
      }
    }
  }

  createGameDictionary() {
    // games list cannot be empty
    if (!this.games.length) {
      return null;
    }

    let retObj = {};

    // for each game
    this.games.map((game) => {
      // Get winning team Id
      const winningTeamId = this.getWinningTeamId(game);
      // Add team id to dictionary
      retObj[game.gameId] = {
        teams: { 
          home: { 
            name: game.homeTeam.abbreviation,
            id: game.homeTeam.id,
          },
          away: {
            name: game.awayTeam.abbreviation,
            id: game.awayTeam.id
          }
        },
        winningTeamId,
        pregame: game.gameStatus.status === 'pre' ? true : false, 
        active: game.gameStatus.status === 'in' ? true : false,
        final: game.gameStatus.status === 'post' ? true : false,
      };
    });
    return retObj;
  }

  setData(data) {
    if (!data) {
      this.data = null;
    }
    this.data = data;
  }

  setSummary(summary) {
    if (!summary) {
      this.summary = null;
    }
    this.summary = summary;
  }

  setMeta(data) {
    if (!data) {
      this.meta = null;
    }
    this.meta = data;
  }

}