import { check } from 'meteor/check';

// import { ScoresCollection } from '../db/scores';
import Week from '../model/week';

Meteor.methods({
  /*
   * Process Feed
   * args: Scoreboard Root Object (see docs)
  */
  async 'scores.processFeed'({ leagues, week, season, events }) {
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
    
    

    // Response
    return currentWeek.id();

    // const scores = ScoresCollection.findOne({ code });
    // if (!game) {
    //   throw new Meteor.Error('Game not found.');
    // }

    // ScoresCollection.update(game._id, { 
    //   $set: { updatedAt: new Date() },
    //   $addToSet: { players: playerObj }
    // });
    // return `/lobby/${ game.code }`;
  },
});


