import { processFeed, processScores } from '../service/gameService';

Meteor.methods({
  /*
   * Process Feed
   * args: Scoreboard Root Object (see docs)
  */
  async 'games.processFeed'(args) {
    return processFeed(args);
  },
  async 'games.processScores'(args) {
    return processScores(args);
  },
});


