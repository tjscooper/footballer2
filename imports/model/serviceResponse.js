export default class ServiceResponse {
  
  constructor({
    _status,         // boolean
    _displayMessage, // 'Processing complete.' 
    _type,           // 'service', 'api',
    _meta,           // { message: string, data: object, entity: string }
  }){
    // Properties
    this.status = _status;
    this.type = _type;
    this.displayMessage = _displayMessage;
    this.meta = _meta;
  }

  throw() {
    throw Meteor.Error(
      this.toString(),  
      {
        status: this.status,
        type: this.type,
        displayMessage: this.displayMessage,
        meta: this.meta
      }
    );
  }

  // Methods
  toString() {
    return this.status
      ? `[SUCCESS] ${this.displayMessage} - [${this.type}] ${JSON.stringify(this.meta)}`
      : `[FAILURE] ${this.displayMessage} - [${this.type}] ${JSON.stringify(this.meta)}`
  }

}