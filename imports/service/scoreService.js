import { check } from 'meteor/check';

import Week from '../model/week';
import Leaderboard from '../model/leaderboard';

import ServiceResponse from '../model/serviceResponse';

// Enums
import { ENTITY } from '../model/entities';

const shortenText = (text, chars, trail = null) => {
  if (text.length < chars) {
    return text;
  }
  return `${text.slice(0, chars)}${trail ? trail : ''}`;
}

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

const leaderboard = async ({ _weekId }) => {
  
  const players = Meteor.users.find({}).fetch();
  console.log('players', players);

  const shortened = players.map(
    p => ({ ...p, user: shortenText(p.username, 9, '..') }));

  const lb = new Leaderboard({
    _id: null,
    _weekId,
    _players: shortened
  });

  const chartData = lb.getChartData();
  console.log(chartData);

  return chartData;
};

export {
  leaderboard,
  processFeed
};
