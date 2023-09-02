import { getTop5, processTop5 } from '../service/leaderboardService';

Meteor.methods({
  async 'leaderboards.processTop5'(args) {
    return processTop5(args);
  },
  async 'leaderboards.getTop5'(args) {
    return getTop5(args);
  },
});


