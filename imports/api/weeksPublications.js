import { Meteor } from 'meteor/meteor';

import { WeeksCollection } from '../db/weeks';

Meteor.publish('weeks', function () {
  return WeeksCollection.find({});
});