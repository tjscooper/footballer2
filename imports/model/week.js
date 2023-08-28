export default class Week {
  
  constructor({ _id, number }){
    // Properties
    this._id = _id;
    this.number = number;
  }

  // Methods
  id() {
    return this._id;
  }

  current() {
    return this.number;
  }

  previous() {
    return (this.number - 1) < 1
      ? 1 
      : this.number - 1; 
  }

  next() {
    return this.number + 1; 
  }

}