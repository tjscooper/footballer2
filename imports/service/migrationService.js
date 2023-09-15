import { Meteor } from 'meteor/meteor';
import { fetch, Headers } from 'meteor/fetch';

import ServiceResponse from '../model/serviceResponse';
import { LeaderboardsCollection } from '../db/leaderboards';
import { WeeksCollection } from '../db/weeks';
import { calculateLeaderboard } from './leaderboardService';

// Enums
import { ENTITY } from '../model/entities';

// Constants
const MIGRATION_VERSION = 1.0;
const DEBUG = true;

// Service
class MigrationService {

  // Attributes
  constructor() {}

  // Methods
  async v_01_refreshLeaderboards_up() {

    console.log('MIGRATION', 'v_01_refreshLeaderboards_up');

    try {

      // Get leaderboards
      console.log('01 - get leaderboards');
      const leaderboardsBefore = LeaderboardsCollection.find({}).fetch();
      // console.log('leaderboards', leaderboards);

      // If empty, get weeks, sort by number
      if (leaderboardsBefore.length === 0) {
        console.log('02 - if empty, get weeks, sort by number');
        
        const weeks = WeeksCollection.find({}, { number: 1 }).fetch();
        console.log('weeks', weeks);

        weeks.forEach((week, index) => {
          let result = calculateLeaderboard({ number: week.number, year: week.year }, true);
          console.log(`03-${index} - insert leaderboard for week ${week.number} [${ result ? 'success' : 'fail' }]`);
          result = null;
        });

        // Get leaderboards, verify weeks count is equal
        console.log('04 - get leaderboards to verify');
        const leaderboardAfter = LeaderboardsCollection.find({}).fetch();

        if (leaderboardAfter.length === weeks.length) {
          return true;
        } else {
          // Failed migration, run down migration
          return this.v_01_refreshLeaderboards_down();
        }

      }
      // Existing leaderboards detected
      else {
        // Do nothing
        console.log('02 - not empty, do nothing');
      }
  
    } catch(err) {
      // If not, run the down migration
      return this.v_01_refreshLeaderboards_down(err);
    }
  }

  async v_01_refreshLeaderboards_down(err) {
    try {
      // Get leaderboards

      // If empty, do nothing
      
      // Empty the collection

      // Verify collection is empty


    } catch(e) {
      // Throw
    }
  }
}

// Singleton Instance
class Singleton {
  constructor() {
    if (!Singleton.instance) {
      Singleton.instance = new MigrationService();
    }
  }
  getInstance() {
    return Singleton.instance;
  }
}

export default Singleton;