import { processFeed } from '../service/teamService';

Meteor.methods({
  /*
   * Process Feed
   * args: Schedule Data Root Object (see docs)
  */
  async 'teams.processFeed'(args) {
    return processFeed(args);
  },
});


