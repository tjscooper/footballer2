import { check } from 'meteor/check';

import Week from '../model/week';
import Leaderboard from '../model/leaderboard';

import ServiceResponse from '../model/serviceResponse';

// Enums
import { ENTITY } from '../model/entities';
import { GamesCollection } from '../db/games';
import { PicksCollection } from '../db/picks';

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

  // Get player list
  const shortened = players.map(
    p => ({ ...p, user: shortenText(p.username, 9, '..') }));

  const lb = new Leaderboard({
    _id: null,
    _weekId,
    _players: shortened
  });

  // Get games
  const games = GamesCollection.find({ weekId: _weekId }).fetch();
  // console.log('games', games);

  // Get picks
  const picks = PicksCollection.find({ weekId: _weekId }).fetch();
  // console.log('picks', picks);

  // Iterate over picks
  picks.forEach((pick) => {
    // Iterate over games
    games.forEach((game) => {
      // Compare pick to each game
      if (pick.gameId === game.gameId) {
        // Did the pick win (or is it currently winning)
        // is the game in progress?
        // check home pick
        // check away pick
        // is home pick winning
        // is away pick winning
      }
    });
  });

  const chartData = lb.getChartData();
  return chartData;
};

export {
  leaderboard,
  processFeed
};
