import { Meteor } from 'meteor/meteor';

import { LeaderboardsCollection } from '../db/leaderboards';

Meteor.publish('leaderboard.byWeekId', function (currentWeek) {
  return LeaderboardsCollection.find({ weekId: currentWeek._id });
});
