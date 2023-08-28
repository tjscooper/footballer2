import { check } from 'meteor/check';

import Week from '../model/week';
import ServiceResponse from '../model/serviceResponse';

// Enums
import { ENTITY } from '../model/entities';

const processFeed = async ({ leagues, week, season, events }) => {
  // Validation
  check(leagues, Array);
  check(week, Object);
  check(season, Object);
  check(events, Array);

  // Get current week
  const currentWeek = new Week(
    await Meteor.call('weeks.currentWeek', week)
  );
  check(currentWeek, Week);

  // Add / Modify Games
  const result = await Meteor.call('games.processScores', {
    _games: events,
    _currentWeek: currentWeek
  });
  
  // Response
  return new ServiceResponse({
    _status: true,
    _displayMessage: 'Process Feed',
    _meta: {
      detailedText: 'Automated service call to insert and update game information.',
      serviceClass: 'ScoreService',
      methodName: 'processFeed',
      data: {
        currentWeekId: currentWeek.id(),
        gamesProcessFeed: result,
      }
    },
    _type: ENTITY.GAME
  });
};

export {
  processFeed
};
