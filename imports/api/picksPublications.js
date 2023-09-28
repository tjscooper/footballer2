import { Meteor } from 'meteor/meteor';

import { PicksCollection } from '../db/picks';
import { GamesCollection } from '../db/games';

Meteor.publish('userPicksAndGames', function (currentWeek) {
  return [
    PicksCollection.find({ weekId: currentWeek._id, userId: Meteor.userId() }),
    GamesCollection.find({ weekId: currentWeek._id }, { sort: { 'clockStatus.date': 1 } })
  ];
});

Meteor.publish('picksAndGames', function (currentWeek) {
  return [
    PicksCollection.find({ weekId: currentWeek._id }),
    GamesCollection.find({ weekId: currentWeek._id }, { sort: { 'clockStatus.date': 1 } })
  ];
});
