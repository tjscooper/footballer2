import { check } from 'meteor/check';

import { PicksCollection } from '../db/picks';
import Pick from '../model/pick';
import ServiceResponse from '../model/serviceResponse';

// Enums
import { ENTITY } from '../model/entities';

const getPicks = (queryObj) => {
  return PicksCollection.find(queryObj).fetch();
}

const getPickById = (_id) => {
  return new Pick(PicksCollection.findOne(_id));
}

const getPickBy = (queryObj) => {
  // Get pick from Db  
  const pick = PicksCollection.findOne({
    userId: queryObj.userId,
    gameId: queryObj.gameId,
    weekId: queryObj.weekId
  });
  
  // If no pick found, return
  if (!pick) {
    return null;
  }
  
  // Instantiate a new pick object
  return new Pick({
    _id: pick._id,
    _gameId: pick.gameId,
    _teamId: pick.teamId,
    _weekId: pick.weekId
  });
}

const insertPick = (pickObj) => {
  const id = PicksCollection.insert(pickObj);
  check(id, String);
  return id;
}

const updatePick = ({ _id, _teamId }) => {
  if (!Meteor.user()._id) {
    throw Meteor.Error('No logged in user.');
  }

  const result = PicksCollection.update(_id, {
    $set: {
      teamId: _teamId,
      updatedAt: new Date()
    }
  });
  return result === 1;
}

const setPick = (queryObj) => {
  // Create a pick object
  const pickObj = getPickObj({
    _userId: Meteor.user()._id,
    _gameId: queryObj.gameId,
    _teamId: queryObj.teamId,
    _weekId: queryObj.weekId,
    _meta: {
      entity: ENTITY.PICK
    }
  });
  
  const pick = getPickBy(pickObj);
  
  if (!pick) {
    const id = insertPick(pickObj);
    return id;
  } else {
    const result = updatePick({
      _id: pick._id,
      _teamId: queryObj.teamId
    });
    return result ? pick._id : null;
  }
}

const getPickObj = (pick) => {
  const pickObj = new Pick(pick);
  delete pickObj._id;
  return pickObj;
}

export {
  getPicks,
  getPickById,
  getPickBy,
  setPick
};
