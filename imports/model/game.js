export default class Game {
  
  constructor({
    _id,
    _weekId,
    _weekNumber,
    _gameId, 
    _name,
    _shortName,
    _competitionId,
    _location,
    _seasonType,
    _gameStatus,    // { type: 'pre', winner: competitor.winner === true }
    _clockStatus,   // { clock: number, displayClock: string, period: number } 
    _homeTeam,      // competitor.homeAway === 'home' ? { score, id, abbreviation, logo }
    _awayTeam,      // competitor.homeAway === 'away' ? { score, id, abbreviation, logo }
    _odds,          // { deatils: string, spread, number, fav: homeTeamOdds.favorite === true }
    _meta,          // { gameUrl: string }
  }){
    // Properties
    this._id = _id;
    this.weekId = _weekId;
    this.weekNumber = _weekNumber;
    this.gameId = _gameId;
    this.name = _name;
    this.shortName = _shortName;
    this.competitionId = _competitionId;
    this.location = _location;
    this.seasonType = _seasonType;
    this.gameStatus = _gameStatus;
    this.clockStatus = _clockStatus;
    this.homeTeam = _homeTeam;
    this.awayTeam = _awayTeam;
    this.odds = _odds;
    this.meta = _meta;
  }

  // Methods
  id() {
    return this._id;
  }

  matchUp() {
    return this.name;
  }

}