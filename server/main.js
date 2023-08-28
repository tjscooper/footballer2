import { Meteor } from 'meteor/meteor';

// Data Publications
import '../imports/api/weeksPublications';
import '../imports/api/teamsPublications';
import '../imports/api/picksPublications';

// Scheduling Services
import CronService from '../imports/service/cronService';
import FeedService from '../imports/service/feedService';

// APIs
import '../imports/api/weeks.js';
import '../imports/api/teams.js';
import '../imports/api/games.js';
import '../imports/api/scores.js';
import '../imports/api/picks.js';


Meteor.startup(() => {

  const automateWorkflow = false;

  if (automateWorkflow) {
  
    const feedService = new FeedService().getInstance();

    // Get Teams must always run first
    feedService.getTeams();
    feedService.getGames();
    feedService.getScores();

    // Scheduled Service Registry
    CronService.register({
      name: 'Get Scores',
      scheduleParserText: 'every 1 min',
      scheduleFn: feedService.getScores
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
