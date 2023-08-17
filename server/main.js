import { Meteor } from 'meteor/meteor';

import CronService from '../imports/service/cronService';
import ScoreboardService from '../imports/service/scoreboardService';

Meteor.startup(() => {
  
  // Scheduled Service Registry
  const scoreboardService = new ScoreboardService().getInstance();
  CronService.register({
    name: 'Get Scores',
    scheduleParserText: 'every 1 min',
    scheduleFn: scoreboardService.getScores
  });

  // Start Scheduled Services
  CronService.start();
});
