import { Meteor } from 'meteor/meteor';

import CronService from '../imports/service/cronService';
import FeedService from '../imports/service/feedService';

import '../imports/api/weeks.js';
import '../imports/api/scores.js';

Meteor.startup(() => {
  
  // Scheduled Service Registry
  const feedService = new FeedService().getInstance();
  CronService.register({
    name: 'Get Scores',
    scheduleParserText: 'every 1 min',
    scheduleFn: feedService.getScores
  });

  // Start Scheduled Services
  CronService.start();
});
