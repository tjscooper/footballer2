import { check } from 'meteor/check';

import { LeaderboardsCollection } from '../db/leaderboards';
import { GamesCollection } from '../db/games';
import { PicksCollection } from '../db/picks';

import Leaderboard from '../model/leaderboard';
import ServiceResponse from '../model/serviceResponse';

// Enums
import { ENTITY } from '../model/entities';

const getLeaderboards = (queryObj) => {
  return LeaderboardsCollection.find(queryObj).fetch();
}

const getLeaderboardById = (_id) => {
  return new Leaderboard(LeaderboardsCollection.findOne(_id));
}

const getLeaderboardByWeekId = (_weekId) => {
  // Get leaderboard from Db
  const leaderboard = LeaderboardsCollection.find({ weekId: _weekId }).fetch()[0];
  
  // If no leaderboard found, return
  if (!leaderboard) {
    return null;
  }

  // Return a leaderboard object
  return leaderboard;
}

const insertLeaderboard = (leaderboardObj) => {
  const id = LeaderboardsCollection.insert(leaderboardObj);
  check(id, String);
  return id;
}

const updateLeaderboard = (queryObj) => {
  const leaderboard = getLeaderboardByWeekId(queryObj._weekId);
  if (!leaderboard) {
    return;
  }
  const { _id } = leaderboard;
  return LeaderboardsCollection.update(_id, {
    $set: {
      data: queryObj._data,
      updatedAt: new Date()
    }
  });
}

const getLeaderboardObj = (_weekId, _type) => {

  const players = Meteor.users.find({}).fetch();
  const games = GamesCollection.find({ weekId: _weekId }).fetch();
  const picks = PicksCollection.find({ weekId: _weekId }).fetch();
  
  const leaderboardObj = new Leaderboard({
    _id: null,
    _weekId,
    _type,
    _players: players,
    _games: games,
    _picks: picks,
    _data: null,
    _meta: {
      full: null
    }
  });
  delete leaderboardObj._id;
  return leaderboardObj;
}

const processTop5 = ({ _currentWeek }) => {
  // Success
  try {
    // Validation
    check(_currentWeek, Object);

    // Get leaderboard object
    const leaderboardObj = getLeaderboardObj(_currentWeek._id, 'top5');
    
    // Generate chart compatible data (VictoryBar)
    const chartData = leaderboardObj.getHorizontalBarChartData('top-5');
    leaderboardObj.setData(chartData.top5);
    leaderboardObj.setMeta('full', chartData.full);

    if (!leaderboardObj) {
      return;
    }

    // Look for existing leaderboard
    const existingLeaderboard = getLeaderboardByWeekId(_currentWeek._id);
    
    // Create new leaderboard
    if (!existingLeaderboard) {
      const id = insertLeaderboard(leaderboardObj);
      console.log(`Inserted ${leaderboardObj.weekId} at [id]${id}`);
    } else {
      // Update existing leaderboard
      const { _id } = existingLeaderboard;
      try {
        const result = LeaderboardsCollection.update(_id, {
          $set: {
            data: leaderboardObj.data,
            meta: leaderboardObj.meta,
            updatedAt: new Date()
          }
        });
        console.log(
          `Update ${leaderboardObj.weekId} at [id]${_id}: ${result === 1 ? 'Success' : 'Failed '}`
        );
        return result === 1;
      } catch(e) {
        console.log(e);
      }
    }
  
  } catch (e) {
    console.log(e);
    // Response
    return new ServiceResponse({
      _status: false,
      _displayMessage: 'Failed to process leaderboard information.',
      _meta: {
        detailedText: 'Automated service call to process leaderboard information.',
        serviceClass: 'LeaderboardService',
        methodName: 'processTop5',
        data: {
          error: e,
          errorMessage: JSON.stringify(e)
        }
      },
      _type: ENTITY.GAME
    }).throw();
  }
};

const getTop5 = ({ _weekId }) => {
  if (!_weekId) {
    return null;
  }
  return getLeaderboardByWeekId(_weekId).meta.full;
}

export {
  processTop5,
  getTop5
};