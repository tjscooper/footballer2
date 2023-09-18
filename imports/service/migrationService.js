import { Meteor } from 'meteor/meteor';
import { fetch, Headers } from 'meteor/fetch';

import ServiceResponse from '../model/serviceResponse';
import { LeaderboardsCollection } from '../db/leaderboards';
import { WeeksCollection } from '../db/weeks';
import { calculateLeaderboard } from './leaderboardService';

// Enums
import { ENTITY } from '../model/entities';

// Constants
const DEBUG = true;

// Service
class MigrationService {

  // Attributes
  constructor() {}

  // Methods
  async v_01_refreshLeaderboards_up() {

    console.log('\n\nMIGRATION', 'v_01_refreshLeaderboards_up\n');

    try {

      // Get leaderboards
      console.log('01 - get leaderboards');
      const leaderboardsBefore = LeaderboardsCollection.find({}).fetch();
      // console.log('leaderboards', leaderboards);

      // If empty, get weeks, sort by number
      if (leaderboardsBefore.length === 0) {
        console.log('02 - if empty, get weeks, sort by number');
        
        const weeks = WeeksCollection.find({}, { sort: { number: 1 } }).fetch();
        
        const taskTimer = ms => new Promise(res => setTimeout(res, ms));
        const timerSetting = 30; // seconds

        const performTasks = async () => { 
          for (let taskNumber = 0; taskNumber < weeks.length; taskNumber++) {
            console.log(`05 - performing task ${taskNumber + 1}`);

            // Task logic
            const { number, year } = weeks[taskNumber];
            const result = await calculateLeaderboard({ number, year }, true); // Allow Save to DB (true)
            console.log(`05-${taskNumber + 1} - inserted leaderboard for week ${number} [${ result ? 'success' : 'fail' }]`);

            // Manage task threads using task timer
            await taskTimer(timerSetting * 1000); // Await timer in ms
          }

          // Get leaderboards, verify weeks count is equal
          console.log('06 - get leaderboards to verify');
          const leaderboardsAfter = LeaderboardsCollection.find({}).fetch();
          console.log('07 - found leaderboards', leaderboardsAfter.length);

          if (leaderboardsAfter.length === weeks.length) {
            console.log('08 - migration successful\n\n');
            return true;
          } else {
            console.log('06 - operation failed, run down migration\n\n');
            // Failed migration, run down migration
            return this.v_01_refreshLeaderboards_down();
          }
        }

        // Determine the total number of tasks to perform
        const taskTotal = weeks.length;

        console.log('04 - starting task queue processing')
        performTasks(taskTotal);
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
      console.log('MIGRATION', 'v_01_refreshLeaderboards_down');

      // Get leaderboards
      console.log('TODO - Clean up migration tasks');
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