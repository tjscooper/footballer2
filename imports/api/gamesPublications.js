import { Meteor } from 'meteor/meteor';

import { GamesCollection } from '../db/games';

Meteor.publish('games', function () {
  return GamesCollection.find({}, { sort: { gameId: 1 } });
});
