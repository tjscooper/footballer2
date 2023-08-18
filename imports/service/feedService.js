import { Meteor } from 'meteor/meteor';
import { fetch, Headers } from 'meteor/fetch';

// Constants
const SCOREBOARD_URL = "http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";

// Service
class FeedService {

  // Attributes
  constructor() {}

  // Methods
  async getScores() {
    try {
      const response = await fetch(SCOREBOARD_URL, {
          method: 'GET',
          mode: 'cors', 
          cache: 'no-cache',
          credentials: 'same-origin', 
          headers: new Headers({
            'Content-Type': 'application/json'
          }),
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
      });
      const data = await response.json();
      const result = await Meteor.call('scores.processFeed', data);
      console.log('result of meteor call', result);

    } catch (err) {
      console.log(err);
    }
  }
}

// Singleton Instance
class Singleton {
  constructor() {
    if (!Singleton.instance) {
      Singleton.instance = new FeedService();
    }
  }
  getInstance() {
    return Singleton.instance;
  }
}

export default Singleton;