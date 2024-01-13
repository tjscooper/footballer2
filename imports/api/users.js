import { resetPassword } from '../service/userService';

Meteor.methods({
  async 'users.resetPassword'(args) {
    return resetPassword(args);
  },
});


