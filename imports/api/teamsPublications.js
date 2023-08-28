import { Meteor } from 'meteor/meteor';

import { TeamsCollection } from '../db/teams';

Meteor.publish('teams', function () {
  return TeamsCollection.find({});
});