import { check } from 'meteor/check';

import { LeaderboardsCollection } from '../db/leaderboards';
import { GamesCollection } from '../db/games';
import { PicksCollection } from '../db/picks';

import Leaderboard from '../model/leaderboard';
import ServiceResponse from '../model/serviceResponse';

import { getWeeks } from './weekService';

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
  DEBUG && console.log('leaderboard id', _id)
  return LeaderboardsCollection.update(_id, {
    $set: {
      data: queryObj.data,
      summary: queryObj.summary,
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
    leaderboardObj.summary = []
    
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
      DEBUG && console.log(`Inserted ${leaderboardObj.weekId} at [id]${id}`);
    } else {
      // Update existing leaderboard
      const { _id } = existingLeaderboard;
      try {
        const result = LeaderboardsCollection.upsert(_id, {
          $set: {
            data: leaderboardObj.data,
            meta: leaderboardObj.meta,
            updatedAt: new Date()
          }
        });
        DEBUG && console.log(
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
  const inspectGameId = gameId || '401547421'; 

  // Begin with empty return object
  let games = {};

  gamesData.forEach((game) => {

    const gameId = game.gameId;
    const homeTeam = game.homeTeam;
    const awayTeam = game.awayTeam;
    const homeScore = parseFloat(game.homeTeam.score);
    const awayScore = parseFloat(game.awayTeam.score);
    const spread = Math.abs(parseFloat(game.odds.spread));
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

const calculateLeaderboard = async ({ number, year, type }, saveToDb = true) => {
  const DEBUG = false;

  saveToDb && console.log('... calculating leaderboard stats for week', year, type, number);

  // Replace with lookups
  const weeks = getWeeks({ year });
  const leaderboards = getLeaderboards({})
  const week = getWeek({ number, year, type });

  const leaderboardObj = getLeaderboardObj(week._id);
  
  if (!leaderboardObj) {
    saveToDb && console.log('... No week found, failing')
    return;
  }

  const winners = await calculateWinners(leaderboardObj.games); 
  
  const awayPicks = [];
  const homePicks = [];

  // Leaderboard chart data
  const data = [];

  const summary = await calculateSummary({ currentWeek: week, existingLeaderboards: leaderboards });
  DEBUG && console.log(summary)

  // Create user map for leaderboard chart
  leaderboardObj.players.forEach((player) => {

    // Get current username
    const username = getUsername(player._id);
    
    const wins = [];
    const winning = [];

    // Review each game
    leaderboardObj.games.forEach((game) => {

      // Locate the pick  
      leaderboardObj.picks.forEach((pick) => {

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
  saveToDb && console.log('... set leaderboard data');

  leaderboardObj.setSummary(summary)
  saveToDb && console.log('... set summary data');

  leaderboardObj.setMeta(winners);
  saveToDb && console.log('... set leaderboard winners');
  
  if (saveToDb) {
    DEBUG && console.log('... saving to DB');
    // Look for existing leaderboard
    const existingLeaderboard = getLeaderboardByWeekId(week._id);
  
    // Create new leaderboard
    if (!existingLeaderboard) {
      DEBUG && console.log(`... inserting leaderboard`);
      const id = insertLeaderboard(leaderboardObj);
      DEBUG && console.log(`... inserted ${leaderboardObj.weekId} at [id]${id}`);
      return leaderboardObj;
    } else {
      // Update existing leaderboard
      const { _id } = existingLeaderboard;
      DEBUG && console.log(`... updating leaderboard at [id]${_id} for week ${number}`);
      try {
        const result = LeaderboardsCollection.update(_id, {
          $set: {
            data: leaderboardObj.data,
            summary: leaderboardObj.summary,
            meta: leaderboardObj.meta,
            updatedAt: new Date()
          }
        });
        DEBUG && console.log(
          `... updated ${leaderboardObj.weekId} at [id]${_id}: ${result === 1 ? 'Success' : 'Failed '}`
        );
        return result === 1;
      } catch(e) {
        DEBUG && console.log(`... failed to update leaderboard at [id]${_id}: ${result === 1 ? 'Success' : 'Failed '}`);
        DEBUG && console.log(e);
      }
    } 
  } else {
    saveToDb && console.log(`... no insert, returning record only`);
    return leaderboardObj;
  }
}

const calculateSummary = async ({ currentWeek, existingLeaderboards }, saveToDb = true) => {
  const DEBUG = true;

  saveToDb && console.log('... calculating leaderboard stats for year');

  const weeks = getWeeks({ year: currentWeek.year });

  // Filter leaderboards by year
  const leaderboardsByYear = existingLeaderboards.filter(l => weeks.filter(
    w => w.year === currentWeek.year && w._id === l.weekId).length > 0)

  return aggregateLeaderboards(leaderboardsByYear);
}

// Aggregating data from all leaderboards
const aggregateLeaderboards = (leaderboards) => {
  const aggregatedData = {};

  leaderboards.forEach((leaderboard) => {
    leaderboard.data.forEach(({ username, wins, winPercentage }) => {
      if (!aggregatedData[username]) {
        // Initialize the entry for the username if not present
        aggregatedData[username] = {
          username,
          totalWins: 0,
          totalWinPercentage: 0,
          appearanceCount: 0, // To calculate the average winPercentage
        };
      }

      // Aggregate the data
      aggregatedData[username].totalWins += wins;
      aggregatedData[username].totalWinPercentage += winPercentage;
      aggregatedData[username].appearanceCount += 1;
    });
  });

  // Calculate average winPercentage for each user
  return Object.values(aggregatedData).map((user) => ({
    username: user.username,
    totalWins: user.totalWins,
    averageWinPercentage: user.totalWinPercentage / user.appearanceCount,
  }));
};

export {
  // processTop5,
  // getTop5,
  getLeaderboards,
  calculateWinners,
  calculateLeaderboard
};