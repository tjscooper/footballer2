import { check } from 'meteor/check';

import { WeeksCollection } from '../db/weeks';
import Week from '../model/week';

const getWeeks = (queryObj) => {
  return WeeksCollection.find(queryObj).fetch();
};

const getWeeksOrderByType = () => {
  return WeeksCollection.find({}, { sort: { type: -1, number: -1 }}).fetch();
};

const getWeekOrderByType = () => {
  return WeeksCollection.find({}, { sort: { type: -1, number: -1 } }, { limit: 1 }).fetch()[0];
};

const getWeek = (queryObj) => {
  return getWeeks(queryObj)[0] || [];
}

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
// season: { type: 3, year: 2023 }
// week: { number: 1 }
const processFeed = ({ week, season }) => {
  

  // Validation
  check(week, Object); 
  check(season, Object);
  
  // Get week number from feed data
  const { number } = week;
  const { year, type } = season;

  // If week is not found, insert
  if (getWeeks({ number, year, type }).length === 0) {
    const weekObj = getWeekObj({
      _id: null,
      number,
      year,
      type
    });
    const id = insertWeek(weekObj);
    return getWeekById(id);
  } else {
    return currentWeek();
  }
}

// Current Week
// returns the latest week (sorted by "number" property)
const currentWeek = () => {
  const week = getWeekOrderByType();
  return week;
}

// Public methods (for API)
export {
  processFeed,
  currentWeek,
  getWeek
};

