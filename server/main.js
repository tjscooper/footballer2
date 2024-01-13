import { Meteor } from 'meteor/meteor';

// Data Publications
import '../imports/api/weeksPublications';
import '../imports/api/teamsPublications';
import '../imports/api/picksPublications';
import '../imports/api/leaderboardsPublications';
import '../imports/api/chirpsPublications';
import '../imports/api/usersPublications';

// Scheduling Services
import CronService from '../imports/service/cronService';
import FeedService from '../imports/service/feedService';
import MigrationService from '../imports/service/migrationService';

// APIs
import '../imports/api/weeks.js';
import '../imports/api/teams.js';
import '../imports/api/games.js';
import '../imports/api/scores.js';
import '../imports/api/picks.js';
import '../imports/api/leaderboards.js';
import '../imports/api/chirps.js';
import '../imports/api/feeds.js';
import '../imports/api/users.js';

Meteor.startup(() => {

  const runMigrations = true;

  if (runMigrations) {

    const migrationService = new MigrationService().getInstance();

    // Migration List
    const migrations = [
      {
        name: 'Calculate all leaderboards',
        version: '01',
        func: migrationService.v_01_refreshLeaderboards_up,
        addToQueue: false
      }
    ];

    // List of migrations to run in sequence
    const migrationTimer = ms => new Promise(res => setTimeout(res, ms));
    const timerSetting = 30; // seconds

    const completedMigrations = [];
    const performMigrations = async () => { 
      for (let taskNumber = 0; taskNumber < migrations.length; taskNumber++) {

        console.log(`performing migration ${taskNumber + 1}`);

        // Execute migration logic, if add to queue is indicated
        if (migrations[taskNumber].addToQueue) {
          migrations[taskNumber]['func']();
          completedMigrations.push(migrations[taskNumber]);
        } else {
          console.log(`migration ${taskNumber + 1} was skipped (not in queue)`);  
        }

        // Manage migration threads using task timer
        await migrationTimer(timerSetting * 1000); // Await timer in ms
      }
      console.log(`completed ${completedMigrations.length} migrations`);
    }

    // Determine the total number of tasks to perform
    const migrationTotal = migrations.length;

    console.log('starting migration queue processing')
    performMigrations(migrationTotal);

  }

  const automateWorkflow = true;

  if (automateWorkflow) {
  
    const feedService = new FeedService().getInstance();

    // Trigger all services on startup
    // Get Teams must always run first
    feedService.getTeams();
    feedService.getWeeks();
    feedService.getGames();
    feedService.getScores();

    // Scheduled Service Registry
    CronService.register({
      name: 'Get Scores',
      scheduleParserText: 'every 1 min',
      scheduleFn: feedService.getScores
    });

    CronService.register({
      name: 'Get Weeks',
      scheduleParserText: 'at 1:55 am every Wednesday',
      scheduleFn: feedService.getWeeks
    });

    CronService.register({
      name: 'Get Games',
      scheduleParserText: 'at 2:00 am every Wednesday',
      scheduleFn: feedService.getGames()
    });
    
    CronService.register({
      name: 'Get Teams',
      scheduleParserText: 'every 5 min',
      scheduleFn: feedService.getTeams
    });

    // Start Scheduled Services
    CronService.start();
  }
});

