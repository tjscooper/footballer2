import { check } from 'meteor/check';

import { LeaderboardsCollection } from '../db/leaderboards';
import { GamesCollection } from '../db/games';
import { PicksCollection } from '../db/picks';

import Leaderboard from '../model/leaderboard';
import ServiceResponse from '../model/serviceResponse';

// Enums
import { ENTITY, GAME_STATUS } from '../model/entities';
import { getWeek } from './weekService';

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

const getLeaderboardObj = (_weekId, _type = null) => {

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
    _meta: null,
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

const calculateWinners = async (gamesData = null, gameId = null, config) => {
  
  const { debugMode } = config || false;
  const DEBUG = debugMode || false;
  const inspectGameId = gameId || '401547396'; 

  // Begin with empty return object
  let games = {};

  gamesData.forEach((game) => {

    const gameId = game.gameId;
    const homeTeam = game.homeTeam;
    const awayTeam = game.awayTeam;
    const homeScore = parseFloat(game.homeTeam.score);
    const awayScore = parseFloat(game.awayTeam.score);
    const spread = parseFloat(game.odds.spread) * -1;
    if (DEBUG && gameId === inspectGameId) console.log('spread', spread);

    const fav = game.odds.favourite.home ? 'home' : 'away';
    if (DEBUG && gameId === inspectGameId) console.log('fav', fav);
    
    let winningTeam = null;

    if (homeScore > awayScore) {
      winningTeam = homeTeam;
      if (DEBUG && gameId === inspectGameId) console.log('straight up winner [winningTeam]', winningTeam);
    } else if (awayScore > homeScore) {
      winningTeam = awayTeam;
      if (DEBUG && gameId === inspectGameId) console.log('straight up winner [winningTeam]', winningTeam);
    }
    
    // Calculate the winning team considering the spread
    if (spread !== null) {
      // who is winning?
      // tie game or no score
      if (!winningTeam) {
        // who is the fav?
        // home
        if (fav === 'home') {
          if (homeScore - spread > awayScore) {
            winningTeam = homeTeam;
            if (DEBUG && gameId === inspectGameId) console.log('tie game, home was the fav, spread IS covered [winningTeam]', winningTeam);
          } else {
            winningTeam = awayTeam;
            if (DEBUG && gameId === inspectGameId) console.log('tie game, home was the fav, spread IS NOT covered [winningTeam]', winningTeam);
          }
        } 
        // away
        else {
          if (awayScore - spread > homeScore) {
            winningTeam = awayTeam;
            if (DEBUG && gameId === inspectGameId) console.log('tie game, away was the fav, spread IS covered [winningTeam]', winningTeam);
          } else {
            winningTeam = homeTeam;
            if (DEBUG && gameId === inspectGameId) console.log('tie game, away was the fav, spread IS NOT covered [winningTeam]', winningTeam);
          }
        }
      } 
      // no tie, with scores
      else {
        // home
        if (winningTeam === homeTeam) {
          // who is the fav?
          // home
          if (fav === 'home') {
            if (homeScore - spread > awayScore) {
              winningTeam = homeTeam;
              if (DEBUG && gameId === inspectGameId) console.log('not a tie, home was winning, home was the fav, spread IS covered [winningTeam]', winningTeam);
            } else {
              winningTeam = awayTeam;
              if (DEBUG && gameId === inspectGameId) console.log('not a tie, home was winning, home was the fav, spread IS NOT covered [winningTeam]', winningTeam);
            }
          }
          // away
          else {
            if (awayScore - spread > homeScore) {
              winningTeam = awayTeam;
              if (DEBUG && gameId === inspectGameId) console.log('not a tie,  home was winning, away was the fav, spread IS covered [winningTeam]', winningTeam);
            } else {
              winningTeam = homeTeam;
              if (DEBUG && gameId === inspectGameId) console.log('not a tie,  home was winning, away was the fav, spread IS NOT covered [winningTeam]', winningTeam);
            }
          }
        } 
        // away
        else {
          // who is the fav?
          // home
          if (fav === 'home') {
            if (homeScore - spread > awayScore) {
              winningTeam = homeTeam;
              if (DEBUG && gameId === inspectGameId) console.log('not a tie, away was winning, home was the fav, spread IS covered [winningTeam]', winningTeam);
            } else {
              winningTeam = awayTeam;
              if (DEBUG && gameId === inspectGameId) console.log('not a tie, away was winning, home was the fav, spread IS NOT covered [winningTeam]', winningTeam);
            }
          }
          // away
          else {
            if (awayScore - spread > homeScore) {
              winningTeam = awayTeam;
              if (DEBUG && gameId === inspectGameId) console.log('not a tie, away was winning, away was the fav, spread IS covered [winningTeam]', winningTeam);
            } else {
              winningTeam = homeTeam;
              if (DEBUG && gameId === inspectGameId) console.log('not a tie, away was winning, away was the fav, spread IS NOT covered [winningTeam]', winningTeam);
            }
          }
        }
      }
    }

    games[gameId] = {
      name: `${awayTeam.abbreviation} @ ${homeTeam.abbreviation}`,
      score: {
        home: homeScore,
        away: awayScore,
      },
      awayTeam: {
        abbreviation: awayTeam.abbreviation,
        name: awayTeam.name,
        score: awayScore,
        picks: [],
      },
      homeTeam: {
        abbreviation: homeTeam.abbreviation,
        name: homeTeam.name,
        score: homeScore,
        picks: [],
      },
      spread,
      fav,
      winningTeam: {
        id: winningTeam.id,
        abbreviation: winningTeam.abbreviation, 
        homeAway: winningTeam.homeAway,
      },
    };
  });

  return games;
}

const getUsername = (userId) => Meteor.users.find({ _id: userId }).fetch()[0].username;

const calculateLeaderboard = async ({ number, year }, saveToDb = false) => {

  const DEBUG = false;

  // Replace with lookups
  const week = getWeek({ number, year });

  const leaderboardObj = getLeaderboardObj(week._id);
  
  if (!leaderboardObj) {
    return;
  }

  const winners = await calculateWinners(leaderboardObj.games); 
  
  const awayPicks = [];
  const homePicks = [];

  // Leaderboard chart data
  const data = [];

  // Create user map for leaderboard chart
  leaderboardObj.players.forEach((player) => {
    
    const wins = [];
    const winning = [];

    // Review each game
    leaderboardObj.games.forEach((game) => {

      // Locate the pick  
      leaderboardObj.picks.forEach((pick) => {

        // Get current username
        const username = getUsername(pick.userId);

        // Is the pick winning?
        if (pick.userId === player._id
          && winners[game.gameId].winningTeam.id === pick.teamId) {

          // Add user pick to game 
          
          // Pregame
          if (game.gameStatus.status === GAME_STATUS.PRE
            && player._id === pick.userId) {
              if (DEBUG) console.log('pregame - do nothing', pick);
          }
          // Wins
          if (game.gameStatus.status === GAME_STATUS.POST
            && player._id === pick.userId) {
              wins.push(pick);
          }
          // Winning
          if (game.gameStatus.status === GAME_STATUS.IN_PROGRESS
            && player._id === pick.userId) {
              winning.push(pick);
          }
        }

        // Hydrate pick lists within each team (for display)
        if (pick.teamId === game.awayTeam.id
          && player._id === pick.userId
            && !awayPicks.find(p => p.username === username)) {
              winners[game.gameId].awayTeam.picks.push({ username });
        } 
        else if (pick.teamId === game.homeTeam.id
          && player._id === pick.userId
            && !homePicks.find(p => p.username === username)) {
              winners[game.gameId].homeTeam.picks.push({ username });
        }
      });
    }); 
    
    // Calculate user metrics
    const totalWins = wins.length + winning.length;
    const winPercentage = Math.round((totalWins / leaderboardObj.games.length) * 100);

    // Push user stats to leaderboard
    data.push({
      username: player.username,
      wins: wins.length,
      winning: winning.length,
      totalWins,
      winPercentage
    });
  });

  leaderboardObj.setData(data);
  leaderboardObj.setMeta(winners);
  
  if (saveToDb) {
    // Look for existing leaderboard
    const existingLeaderboard = getLeaderboardByWeekId(week._id);
  
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
  } else {
    return leaderboardObj;
  }
}

export {
  // processTop5,
  // getTop5,
  getLeaderboards,
  calculateWinners,
  calculateLeaderboard
};