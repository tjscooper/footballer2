import { processFeed, leaderboard } from '../service/scoreService';

Meteor.methods({
  /*
   * Process Feed
   * args: Scoreboard Root Object (see docs)
  */
  async 'scores.processFeed'(args) {
    return processFeed(args);
  },
  async 'scores.leaderboard'(args) {
    return leaderboard(args);
  },
});


