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

Meteor.startup(() => {

  const runMigrations = true;

  if (runMigrations) {

    const migrationService = new MigrationService().getInstance();
    
    // List of migrations to run in sequence
    
    migrationService.v_01_refreshLeaderboards_up();

  }

  const automateWorkflow = true;

  if (automateWorkflow) {
  
    const feedService = new FeedService().getInstance();

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
      scheduleParserText: 'at 1:55 am every Tuesday',
      scheduleFn: feedService.getWeeks
    });

    CronService.register({
      name: 'Get Games',
      scheduleParserText: 'at 2:00 am every Tuesday',
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
