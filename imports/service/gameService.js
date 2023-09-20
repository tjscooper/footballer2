import { check } from 'meteor/check';

import { GamesCollection } from '../db/games';
import Game from '../model/game';
import Week from '../model/week';
import ServiceResponse from '../model/serviceResponse';

// Enums
import { ENTITY } from '../model/entities';

const getGames = (queryObj = {}) => {
  return GamesCollection.find(queryObj).fetch();
}

const getGameById = (_id) => {
  return new Game(GamesCollection.findOne(_id));
}

const getGameByGameId = (_gameId) => {
  // Get game from Db
  const game = GamesCollection.find({ gameId: _gameId }).fetch()[0];
  
  // If no game found, return
  if (!game) {
    return null;
  }

  // Return a game object
  return game;
}

// Use upsert to prevent duplicates
const insertGame = ({
  weekId, 
  weekNumber, 
  gameId,
  name,
  shortName,
  competitionId,
  location,
  seasonType,
  gameStatus,
  clockStatus,
  homeTeam,
  awayTeam,
  odds,
  meta
}) => {

  const query = { gameId };

  const updateObj = {
    weekId, 
    weekNumber, 
    gameId,
    name,
    shortName,
    competitionId,
    location,
    seasonType,
    gameStatus,
    clockStatus,
    homeTeam,
    awayTeam,
    odds,
    meta
  }
  const update = { $set: updateObj };
  const options = { upsert: true };
  const result = GamesCollection.update(query, update, options);
  check(result, Number);
  return result;
}

const updateGame = (queryObj) => {
  const game = getGameByGameId(queryObj._gameId);
  if (!game) {
    return;
  }
  const { _id } = game;
  return GamesCollection.update(_id, {
    $set: {
      odds: queryObj._odds,
      updatedAt: new Date()
    }
  });
}

const getTeam = (event, teamType) => {
  const game = event.competitions[0];
  const team = game.competitors.find(game => game.homeAway === teamType);
  return team;
}

const updateGameScoreAndStatus = (game) => {
  const existingGame = getGameByGameId(game.id);
  if (!existingGame) {
    return;
  }

  const { _id, homeTeam, awayTeam } = existingGame;
  
  const { score: homeScore } = getTeam(game, 'home');
  const { score: awayScore } = getTeam(game, 'away');
  
  const getSituation = (situation) => {
    if (!situation) {
      return null;
    }
    return {
      isRedZone: situation.isRedZone,
      possession: situation.possession,
      possessionText: situation.possessionText,
      shortDownDistanceText: situation.shortDownDistanceText,
      downDistanceText: situation.downDistanceText,
      down: situation.down,
      yardLine: situation.yardLine,
      distance: situation.distance
    };
  }

  try {
    const result = GamesCollection.update(_id, {
      $set: {
        homeTeam: {
          ...homeTeam,
          // winner: game.homeTeam.winner,
          score: homeScore
        },
        awayTeam: {
          ...awayTeam,
          // winner: game.awayTeam.winner,
          score: awayScore
        },
        clockStatus: {
          date: game.date,
          displayClock: game.status.displayClock,
          clock: game.status.clock,
        },
        gameStatus: {
          status: game.status.type.state,
          name: game.status.type.name,
          shortDetail: game.status.type.shortDetail,
          situation: getSituation(game.competitions[0].situation)
        },
        updatedAt: new Date()
      }
    });
    return result === 1;
  } catch(e) {
    console.log(e);
  }
}

const updateGameOdds = (game) => {
  const result = updateGame({
    _gameId: game.id,
    _odds: getOdds(game.odds)
  });
  return result === 1;
}

const getGameObj = (game, _weekId, _weekNumber) => {
  const gameObj = new Game({
    _id: null,
    _weekId,
    _weekNumber,
    _gameId: game.id, 
    _name: game.name,
    _shortName: game.shortName,
    _competitionId: game.id,
    _location: game.location,
    _seasonType: game.seasonType,
    _gameStatus: {
      status: game.status,
      winner: null
    },
    _clockStatus: {
      displayClock: game.fullStatus.displayClock,
      period: game.period,
      name: game.fullStatus.type.name,
      clock: game.fullStatus.clock,
    },
    _homeTeam: getHomeTeam(game.competitors),
    _awayTeam: getAwayTeam(game.competitors),
    _odds: getOdds(game.odds),
    _meta: {
      gameUrl: game.link
    },
  });
  delete gameObj._id;
  return gameObj;
}

const getHomeTeam = (competitors) => {
  return competitors.find(competitor => competitor.homeAway === 'home');
}

const getAwayTeam = (competitors) => {
  return competitors.find(competitor => competitor.homeAway === 'away');
}

const getOdds = (odds) => {
  return {
    details: odds.details,
    spread: odds.spread,
    favourite: {
      home: odds.homeTeamOdds.favorite,
      away: odds.awayTeamOdds.favorite,
    }
  };
}

const isWithinDateRange = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
  const hour = now.getHours();

  // Check if it's Tuesday (dayOfWeek === 2) and the time is at or after 2 AM
  // or if it's Wednesday or Thursday and the time is before 8 PM
  if (
    (dayOfWeek === 2 && hour >= 2) || // Tuesday after 2 AM
    (dayOfWeek === 3) || // Wednesday
    (dayOfWeek === 4 && hour <= 20) // Thursday before 8 PM
  ) {
    return true;
  }

  return false;
};

/*/
 * Manage the creation of games for a given week
 * Depends on: scheduled task for Schedule data
/*/
const processFeed = async ({ sports }) => {
  // Success
  try {
    // Validation
    check(sports, Array);

    const games = sports[0].leagues[0].events;

    // Games cannot be empty
    if (games.length === 0) {
      return new ServiceResponse({
        _status: false,
        _displayMessage: 'Failed to process game information.',
        _meta: {
          detailedText: 'Automated service call to process game information.',
          serviceClass: 'GameService',
          methodName: 'processFeed',
          data: {
            error: new Meteor.Error('No games are scheduled for this week.'),
            errorMessage: JSON.stringify(new Error('No games are scheduled for this week.'))
          }
        },
        _type: ENTITY.GAME
      }).throw();
    }

    const week = { number: games[0].number };

    if (!week) {
      return;
    }

    // Get current week
    const currentWeek = new Week(
      await Meteor.call('weeks.currentWeek', week)
    );
    check(currentWeek, Week);
    
    const _weekId = currentWeek._id;
    const _weekNumber = currentWeek.number;
    
    // Get games
    if (getGames({ weekId: _weekId }).length === 0) {
      // Insert games
      games.forEach(game => {

        if (game.competitors.length === 0) {
          // Response
          return new ServiceResponse({
            _status: false,
            _displayMessage: 'Event is missing game information.',
            _meta: {
              detailedText: 'The competitors array is empty.',
              serviceClass: 'GameService',
              methodName: 'processFeed',
              data: {
                error: Meteor.Error('The competitions array is empty.'),
                errorMessage: JSON.stringify(new Error('The competitions array is empty.'))
              }
            },
            _type: ENTITY.GAME
          }).throw();
        }

        // Games are created 
        const gameObj = getGameObj(game, _weekId, _weekNumber);
        const result = insertGame(gameObj);
        if (result) {
          console.debug(`Successfully inserted ${game.name}`);
        } else {
          console.debug(`Failed to insert ${game.name}`);
        }
      });
    } else {
      // Games already exist, only update game odds
      if (isWithinDateRange()) {
        games.forEach(game => {
          updateGameOdds(game);
        });
      }
    }
    
    // Response
    return new ServiceResponse({
      _status: true,
      _displayMessage: 'Successfully processed games.',
      _meta: {
        detailedText: 'Automated service call to insert and update game information.',
        serviceClass: 'GameService',
        methodName: 'processFeed',
      },
      _type: ENTITY.GAME
    });
  
  }
  // Failure
  catch (e) {
    console.log(e);
    // Response
    return new ServiceResponse({
      _status: false,
      _displayMessage: 'Failed to process game information.',
      _meta: {
        detailedText: 'Automated service call to process game information.',
        serviceClass: 'GameService',
        methodName: 'processFeed',
        data: {
          error: e,
          errorMessage: JSON.stringify(e)
        }
      },
      _type: ENTITY.GAME
    }).throw();
  }
};

/*/
 * Manage the live update of games for a given week
 * Depends on: scheduled task for Scoreboard data
/*/
const processScores = async ({ _games: games, _currentWeek }) => {
  // Success
  try {
    // Validation
    check(games, Array);
    check(_currentWeek, Object);

    // Games cannot be empty
    if (games.length === 0) {
      return new ServiceResponse({
        _status: false,
        _displayMessage: 'Failed to process game scores.',
        _meta: {
          detailedText: 'Automated service call to process game scores.',
          serviceClass: 'GameService',
          methodName: 'processScores',
          data: {
            error: new Meteor.Error('No games are scheduled for this week.'),
            errorMessage: JSON.stringify(new Error('No games are scheduled for this week.'))
          }
        },
        _type: ENTITY.GAME
      }).throw();
    }

    const _weekId = _currentWeek._id;
    const _weekNumber = _currentWeek.number;
    
    // Get games
    if (getGames({ weekId: _weekId }).length === 0) {
      return new ServiceResponse({
        _status: false,
        _displayMessage: 'Failed to process game scores, no existing games present.',
        _meta: {
          detailedText: 'Automated service call to process game scores.',
          serviceClass: 'GameService',
          methodName: 'processScores',
          data: {
            error: new Meteor.Error('No games exist for this week.'),
            errorMessage: JSON.stringify(new Error('No games exist for this week.'))
          }
        },
        _type: ENTITY.GAME
      }).throw();
    }
    
    // Update game scores and statuses
    games.forEach(game => updateGameScoreAndStatus(game));
  }
  // Failure
  catch (e) {
    console.log(e);
    // Response
    return new ServiceResponse({
      _status: false,
      _displayMessage: 'Failed to process game scores.',
      _meta: {
        detailedText: 'Automated service call to process game scores.',
        serviceClass: 'GameService',
        methodName: 'processScores',
        data: {
          error: e,
          errorMessage: JSON.stringify(e)
        }
      },
      _type: ENTITY.GAME
    }).throw();
  }
}

export {
  getGames,
  getGameById,
  getGameByGameId,
  processFeed,
  processScores
};