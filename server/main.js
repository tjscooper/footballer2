import { Meteor } from 'meteor/meteor';

// Scheduling Services
import CronService from '../imports/service/cronService';
import FeedService from '../imports/service/feedService';

// APIs
import '../imports/api/weeks.js';
import '../imports/api/teams.js';
import '../imports/api/scores.js';

Meteor.startup(() => {
  
  // Scheduled Service Registry
  
  const feedService = new FeedService().getInstance();
  CronService.register({
    name: 'Get Scores',
    scheduleParserText: 'every 1 min',
    scheduleFn: feedService.getScores
  });
  
  CronService.register({
    name: 'Get Teams',
    scheduleParserText: 'every 1 min',
    scheduleFn: feedService.getTeams
  });

  // Start Scheduled Services
  CronService.start();
});
