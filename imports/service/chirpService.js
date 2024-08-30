import { check } from 'meteor/check';

import { ChirpsCollection } from '../db/chirps';
import Chirp from '../model/chirp';
import { CHIRP_STATUS } from '../model/entities';

import ServiceResponse from '../model/serviceResponse';

// Enums
import { ENTITY } from '../model/entities';

const getChirps = (queryObj) => {
  return ChirpsCollection.find(queryObj).fetch();
}

const getChirpById = (_id) => {
  return new Chirp(ChirpsCollection.findOne(_id));
}

const getChirpsBy = (queryObj) => {
  return ChirpsCollection.find(queryObj).fetch();
}

const getChirpBy = (queryObj) => {
  return getChirpsBy(queryObj)[0];
}

const getChirpsByChannelId = (_channelId) => {
  // Get chirps from Db
  const chirps = ChirpsCollection.find({ channelId: _channelId }).fetch();
  
  // If no chirps found, return
  if (!chirps) {
    return null;
  }

  // Return an array of chirps
  return chirps;
}

const insertChirp = (chirpObj) => {
  const id = ChirpsCollection.insert(chirpObj);
  check(id, String);
  return id;
}

const updateChirp = (queryObj) => {
  const chirp = getChirpById(queryObj._id);
  if (!chirp) {
    return;
  }
  const { _id } = chirp;
  return ChirpsCollection.update(_id, {
    $set: {
      status: queryObj._status,
      updatedAt: new Date()
    }
  });
}

const getChirpObj = (_channelId, _chirp, _chirpedAt, _createdAt) => {

  if (!Meteor.user()) {
    return null;
  }

  const chirpObj = new Chirp({
    _id: null,
    _userId: Meteor.user()._id,
    _username: Meteor.user().username,
    _chirp,
    _channelId,
    _chirpedAt,
    _createdAt,
    _status: CHIRP_STATUS.ACTIVE,
    _meta: {}
  });
  delete chirpObj._id;
  return chirpObj;
}

const addChirp = ({ _channelId = 'default', _chirp, _chirpedAt, _createdAt }) => {

  // Success
  try {
    // Validation
    check(_channelId, String);
    check(_chirp, String);

    // Get chirp object
    const chirpObj = getChirpObj(_channelId, _chirp, _chirpedAt, _createdAt);
    
    if (!chirpObj) {
      return;
    }

    // Look for existing chirp
    const existingChirp = getChirpBy({ _channelId, _chirp });
    
    // Create new chirp
    if (!existingChirp) {
      const id = insertChirp(chirpObj);
      // console.log(`Inserted chirp in channel[${_channelId}] at [id]${id}`);
      return id;
    } else {
      return null;
    }
  
  } catch (e) {
    console.log(e);
    // Response
    return new ServiceResponse({
      _status: false,
      _displayMessage: 'Failed to process chirp information.',
      _meta: {
        detailedText: 'Automated service call to process chirp information.',
        serviceClass: 'ChirpService',
        methodName: 'addChirp',
        data: {
          error: e,
          errorMessage: JSON.stringify(e)
        }
      },
      _type: ENTITY.CHIRP
    }).throw();
  }
};

const removeChirp = (_id) => {
  // Success
  try {
    // Validation
    check(_id, String);

    // Get chirp from Db
    const chirp = getChirpById(_id);
    
    if (!chirp) {
      return;
    }
    
    // Update chirp (soft delete)
    return updateChirp({ _id, _status: CHIRP_STATUS.DELETED });
  
  } catch (e) {
    console.log(e);
    // Response
    return new ServiceResponse({
      _status: false,
      _displayMessage: 'Failed to process chirp information.',
      _meta: {
        detailedText: 'Automated service call to process chirp information.',
        serviceClass: 'ChirpService',
        methodName: 'addChirp',
        data: {
          error: e,
          errorMessage: JSON.stringify(e)
        }
      },
      _type: ENTITY.CHIRP
    }).throw();
  }
};

export {
  addChirp,
  removeChirp
};