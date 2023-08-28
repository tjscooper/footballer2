export default class Pick {
  
  constructor({
    _id,
    _weekId,
    _gameId,
    _teamId, 
    _userId,
    _meta,   // {}
  }){
    // Properties
    this._id = _id;
    this.weekId = _weekId;
    this.gameId = _gameId;
    this.teamId = _teamId;
    this.userId = _userId;
    this.meta = _meta;
  }

  // Methods
  id() {
    return this._id;
  }

}