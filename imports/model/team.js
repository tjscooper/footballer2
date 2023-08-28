export default class Team {
  
  constructor({
    _id,
    _competitorId,
    _displayName,
    _name, 
    _abbreviation,
    _location,
    _color,
    _alternateColor,
    _logo,
    _logoDark,
    _record
  }){
    // Properties
    this._id = _id;
    this.competitorId = _competitorId;
    this.displayName = _displayName;
    this.name = _name;
    this.abbreviation = _abbreviation;
    this.location = _location;
    this.color = _color;
    this.alternateColor = _alternateColor;
    this.logo = _logo;
    this.logoDark = _logoDark;
    this.record = _record;
  }

  // Methods
  id() {
    return this._id;
  }

}