import { Meteor } from 'meteor/meteor';

Meteor.publish('players.listUsers', function () {

  return Meteor.users.find(
    {}, // No query
    { 
      fields: {
        _id: 1, username: 1,
      },
      sort: {
        username : 1
      }
    }
  );
});
