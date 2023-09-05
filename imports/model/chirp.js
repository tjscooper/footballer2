export default class Chirp {
  
  constructor({
    _id,
    _userId,
    _username,
    _channelId,
    _chirp, 
    _chirpedAt,
    _createdAt,
    _status,
    _meta,
  }){
    // Properties
    this._id = _id;
    this.userId = _userId;
    this.username = _username;
    this.channelId = _channelId;
    this.chirp = _chirp;
    this.chirpedAt = _chirpedAt;
    this.createdAt = _createdAt;
    this.status = _status;
    this.meta = _meta;
  }

  // Methods
  id() {
    return this._id;
  }

}