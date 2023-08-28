import { check } from 'meteor/check';

import { WeeksCollection } from '../db/weeks';
import Week from '../model/week';

const getWeeks = (queryObj) => {
  return WeeksCollection.find(queryObj).fetch();
};

const getWeekById = (_id) => {
  return new Week(WeeksCollection.findOne(_id));
}

const getWeekObj = (week) => {
  const weekObj = new Week(week);
  delete weekObj._id;
  return weekObj;
}

const insertWeek = (weekObj) => {
  const id = WeeksCollection.insert(weekObj);
  check(id, String);
  return id;
}

// Process Feed
const processFeed = (week) => {
  // Validation
  check(week, Object); 
  
  // Get week number from feed data
  const { number } = week;

  // If week is not found, insert
  if (getWeeks({ number }).length === 0) {
    const weekObj = getWeekObj(week);
    const id = insertWeek(weekObj);
    return getWeekById(id);
  } else {
    return currentWeek();
  }
}

// Current Week
// returns the latest week (sorted by "number" property)
const currentWeek = () => {
  const week = getWeeks({})
    .sort((a, b) => b.number - a.number)[0];
  return week;
}

// Public methods (for API)
export {
  processFeed,
  currentWeek
};

