import { Meteor } from 'meteor/meteor';
import { fetch, Headers } from 'meteor/fetch';

import ServiceResponse from '../model/serviceResponse';

// Enums
import { ENTITY } from '../model/entities';

// Constants
const SCOREBOARD_URL = "http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";
const SCHEDULE_URL = "https://site.web.api.espn.com/apis/v2/scoreboard/header?sport=football&league=nfl&region=us&lang=en&contentorigin=espn&tz=America/New_York";
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
      return result;

    } catch (e) {
      // Response
      return new ServiceResponse({
        _status: false,
        _displayMessage: 'Failed to get Scores.',
        _meta: {
          detailedText: 'Automated service call to process game information.',
          serviceClass: 'FeedService',
          methodName: 'getScores',
          data: {
            error: e,
            errorMessage: JSON.stringify(e)
          }
        },
        _type: ENTITY.FEED
      });
    }
  }

  async getTeams() {
    try {
      const response = await fetch(SCHEDULE_URL, {
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
      const result = await Meteor.call('teams.processFeed', data);
      return result;

    } catch (e) {
      // Response
      return new ServiceResponse({
        _status: false,
        _displayMessage: 'Failed to get Teams.',
        _meta: {
          detailedText: 'Automated service call to process team information.',
          serviceClass: 'FeedService',
          methodName: 'getTeams',
          data: {
            error: e,
            errorMessage: JSON.stringify(e)
          }
        },
        _type: ENTITY.FEED
      });
    }
  }

  async getGames() {
    try {
      const response = await fetch(SCHEDULE_URL, {
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
      const result = await Meteor.call('games.processFeed', data);
      return result;

    } catch (e) {
      // Response
      return new ServiceResponse({
        _status: false,
        _displayMessage: 'Failed to get Games.',
        _meta: {
          detailedText: 'Automated service call to process game information.',
          serviceClass: 'FeedService',
          methodName: 'getGames',
          data: {
            error: e,
            errorMessage: JSON.stringify(e)
          }
        },
        _type: ENTITY.FEED
      });
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