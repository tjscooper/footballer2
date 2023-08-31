export default class Leaderboard {
  
  constructor({
    _id,
    _weekId,
    _players,
    _meta = {},
  }){
    // Properties
    this._id = _id;
    this.weekId = _weekId;
    this.players = _players;
    this.meta = _meta;
  }

  // Methods
  id() {
    return this._id;
  }

  getWins() {
    return Math.round(Math.random(8) * 16);
  }

  getWinning() {
    return Math.round(Math.random(8) * 16);
  }

  getChartData() {
    return this.players.map(player => {
      return {
        user: player.user,
        wins: this.getWins(player._id),
        winning: this.getWinning(player._id)
      };
    });
  }

}