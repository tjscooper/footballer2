import { Meteor } from 'meteor/meteor';

import { LeaderboardsCollection } from '../db/leaderboards';

Meteor.publish('top5', function (currentWeek) {
  return LeaderboardsCollection.find({ weekId: currentWeek._id, type: 'top5' });
});
