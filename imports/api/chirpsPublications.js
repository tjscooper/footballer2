import { Meteor } from 'meteor/meteor';

import { ChirpsCollection } from '../db/chirps';

Meteor.publish('chirps', function () {

  return ChirpsCollection.find(
    {}, // No query
    { 
      sort: {
        $natural : -1 // Latest chirps
      },
      limit: 25 // Limit to 25 chirps
    }
  );
});
