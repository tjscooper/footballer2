import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { LEADERBOARD_JSON } from '../model/leaderboard.data';
import { calculateWinners } from '../service/leaderboardService';

if (Meteor.isServer) {
  describe('Leaderboard Service', () => {
    describe('Calculate Winners', () => {

      const { _games } = LEADERBOARD_JSON;
      const config = { debugMode: false };
      // const tempConfig = { debugMode: true };
      
      // Week 1 Scores
      const scoreSheets = [
        { gameId: '401547352', homeTeam: 'NYJ', homeScore: 22, awayTeam: 'BUF', awayScore: 16, spread: 2, winner: 'NYJ', weekNumber: '1', season: '2023' },
        { gameId: '401547353', homeTeam: 'KC', homeScore: 20, awayTeam: 'DET', awayScore: 21, spread: -4, winner: 'DET', weekNumber: '1', season: '2023' },
        { gameId: '401547396', homeTeam: 'BAL', homeScore: 25, awayTeam: 'HOU', awayScore: 9, spread: -9.5, winner: 'BAL', weekNumber: '1', season: '2023' },
        { gameId: '401547397', homeTeam: 'CLE', homeScore: 24, awayTeam: 'CIN', awayScore: 3, spread: 0, winner: 'CLE', weekNumber: '1', season: '2023' },
        { gameId: '401547398', homeTeam: 'MIN', homeScore: 17, awayTeam: 'TB', awayScore: 20, spread: -4, winner: 'TB', weekNumber: '1', season: '2023' },
        { gameId: '401547399', homeTeam: 'NO', homeScore: 16, awayTeam: 'TEN', awayScore: 15, spread: -4, winner: 'TEN', weekNumber: '1', season: '2023' },
        { gameId: '401547400', homeTeam: 'DEN', homeScore: 16, awayTeam: 'LV', awayScore: 17, spread: -3, winner: 'LV', weekNumber: '1', season: '2023' },
        { gameId: '401547401', homeTeam: 'LAC', homeScore: 34, awayTeam: 'MIA', awayScore: 36, spread: -3, winner: 'MIA', weekNumber: '1', season: '2023' },
        { gameId: '401547402', homeTeam: 'NE', homeScore: 20, awayTeam: 'PHI', awayScore: 25, spread: 3.5, winner: 'PHI', weekNumber: '1', season: '2023' },
        { gameId: '401547403', homeTeam: 'ATL', homeScore: 24, awayTeam: 'CAR', awayScore: 10, spread: -3.5, winner: 'ATL', weekNumber: '1', season: '2023' },
        { gameId: '401547404', homeTeam: 'IND', homeScore: 21, awayTeam: 'JAX', awayScore: 31, spread: 3.5, winner: 'JAX', weekNumber: '1', season: '2023' },
        { gameId: '401547405', homeTeam: 'PIT', homeScore: 7, awayTeam: 'SF', awayScore: 30, spread: 1, winner: 'SF', weekNumber: '1', season: '2023' },
        { gameId: '401547406', homeTeam: 'WSH', homeScore: 20, awayTeam: 'ARI', awayScore: 16, spread: -7, winner: 'ARI', weekNumber: '1', season: '2023' },
        { gameId: '401547407', homeTeam: 'CHI', homeScore: 20, awayTeam: 'GB', awayScore: 38, spread: -1.5, winner: 'GB', weekNumber: '1', season: '2023' },
        { gameId: '401547408', homeTeam: 'SEA', homeScore: 13, awayTeam: 'LAR', awayScore: 30, spread: -4.5, winner: 'LAR', weekNumber: '1', season: '2023' },
        { gameId: '401547409', homeTeam: 'NYG', homeScore: 0, awayTeam: 'DAL', awayScore: 40, spread: 3, winner: 'DAL', weekNumber: '1', season: '2023' },
        { gameId: '401547410', homeTeam: 'PHI', homeScore: 34, awayTeam: 'MIN', awayScore: 28, spread: -6, winner: 'MIN', weekNumber: '2', season: '2023' },
        { gameId: '401547411', homeTeam: 'BUF', homeScore: 38, awayTeam: 'LV', awayScore: 10, spread: -9, winner: 'BUF', weekNumber: '2', season: '2023' },
        { gameId: '401547421', homeTeam: 'ARI', homeScore: 28, awayTeam: 'NYG', awayScore: 31, spread: 5.5, winner: 'ARI', weekNumber: '2', season: '2023' },
        { gameId: '401547422', homeTeam: 'LAR', homeScore: 23, awayTeam: 'SF', awayScore: 30, spread: 8, winner: 'LAR', weekNumber: '2', season: '2023' },
        // { gameId: '401547412', homeTeam: 'BUF', homeScore: 38, awayTeam: 'LV', awayScore: 10, spread: -9, winner: 'BUF', weekNumber: '2', season: '2023' },
      ]

      scoreSheets.forEach(({
        gameId,
        homeTeam,
        homeScore,
        awayTeam,
        awayScore,
        spread,
        winner,
        weekNumber,
        season 
      }) => {
        // Generate unit tests for each game
        it(`can calculate ${winner} is the ${season} week ${weekNumber} winner [${awayTeam} ${awayScore} @ ${homeTeam} ${homeScore}, Spread: ${spread}]`, async () => {
          const games = await calculateWinners(_games, gameId, config);
          const game = games[gameId];
          assert.equal(game.winningTeam.abbreviation, winner);
        });
      });

    });
  });
}