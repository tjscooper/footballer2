import { check } from 'meteor/check';
import ServiceResponse from '../model/serviceResponse';

// Enums
import { ENTITY } from '../model/entities';

const TEMP_PASSWORD = '$2b$10$krnD34k1q8tnah2eaIPuBeiWtNsrUeLze18EXWzrht2vCELosJY6y';

const resetPassword = ({ username }) => {
  check(username, String);
  try {
    const result = updateUserPasswordDirect(username);
    if (result) {
      // Response
      return new ServiceResponse({
        _status: true,
        _displayMessage: `Successfully reset password for ${username}.`,
        _meta: {
          detailedText: `User [${username}] password was reset by Admin.`,
          serviceClass: 'UserService',
          methodName: 'resetPassword',
        },
        _type: ENTITY.USER
    });
    }
  } catch(e) {
    // Response
    return new ServiceResponse({
      _status: false,
      _displayMessage: 'Failed to update user.',
      _meta: {
        detailedText: 'Failed to reset user password.',
        serviceClass: 'UserService',
        methodName: 'resetPassword',
        data: {
          error: null,
          errorMessage: null
        }
      },
      _type: ENTITY.USER
    }).throw();
  }
};

const updateUserPasswordDirect = (username) => {
  check(username, String);
  const result = updatePasswordDirectDb(username);
  return result === 1;
}

const updatePasswordDirectDb = (username) => {
  check(username, String);
  const user = Meteor.users.find({ username }).fetch()[0];
  if (!user) {
    return;
  }
  const { _id } = user;
  const result = Meteor.users.update(_id, {
    $set: {
      services: { password: { bcrypt: TEMP_PASSWORD } }   
    }
  });
  return result;
}

export {
  resetPassword
};
