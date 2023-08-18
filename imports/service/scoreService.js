import { check } from 'meteor/check';

import Week from '../model/week';

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

  // Get events (games)
  
  // Response
  return currentWeek.id();
};

export {
  processFeed
};
