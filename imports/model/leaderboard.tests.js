import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { LeaderboardsCollection } from '/imports/db/leaderboards';
import Leaderboard from './leaderboard';

import { LEADERBOARD_JSON } from './leaderboard.data';

let leaderboard;

if (Meteor.isServer) {
  describe('Leaderboard', () => {
    describe('Set Up', () => {

      beforeEach(() => {
        // Empty Leaderboards
        LeaderboardsCollection.remove({});

        leaderboard = new Leaderboard(LEADERBOARD_JSON);
      });

      afterEach(() => {
        // Remove All Games
        LeaderboardsCollection.remove({});
      });

      it('can create an instance of leaderboard object', () => {
        assert.equal(leaderboard.weekId, 'deJmXfYBh3ZtTJcJ7');
      });

      it('can access properties of leaderboard object', () => {
        assert.equal(leaderboard.weekId, 'deJmXfYBh3ZtTJcJ7');
        assert.equal(leaderboard.games.length, 16);
      });

      it('can generate leaderboard "top5" chart object', () => {
        const chartData = leaderboard.getHorizontalBarChartData('top-5');
      });

      it('can determine winning teams with spread factor', () => {
        const dict = leaderboard.createGameDictionary();
      });

    });
  });
}