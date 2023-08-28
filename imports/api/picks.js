import { setPick } from '../service/pickService';

Meteor.methods({
  async 'picks.setPick'(args) {
    return setPick(args);
  },
});


