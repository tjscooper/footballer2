import { Meteor } from 'meteor/meteor';

import { PicksCollection } from '../db/picks';
import { GamesCollection } from '../db/games';

Meteor.publish('picksAndGames', function (currentWeek) {
  return [
    PicksCollection.find({ weekId: currentWeek._id, userId: Meteor.userId() }),
    GamesCollection.find({ weekId: currentWeek._id })
  ];
});
