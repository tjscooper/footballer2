import {
  getTop5, processTop5, calculateLeaderboard
} from '../service/leaderboardService';

Meteor.methods({
  async 'leaderboards.processTop5'(args) {
    return processTop5(args);
  },
  async 'leaderboards.getTop5'(args) {
    return getTop5(args);
  },
  async 'leaderboards.calculateLeaderboard'(args) {
    return calculateLeaderboard(args);
  }
});


