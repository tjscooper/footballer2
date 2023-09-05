import { Meteor } from 'meteor/meteor';

import { ChirpsCollection } from '../db/chirps';

Meteor.publish('chirps', function () {
  return ChirpsCollection.find(
    {}, // Query
    { 
      fields: { userId: 0 },
      sort: { createdAt: 1 },
      limit: 25
    } 
  );
});
