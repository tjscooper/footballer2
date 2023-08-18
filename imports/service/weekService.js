import { check } from 'meteor/check';

import { WeeksCollection } from '../db/weeks';
import Week from '../model/week';

const getWeeks = (queryObj) => {
  return WeeksCollection.find(queryObj).fetch();
};

const getWeekById = (_id) => {
  return new Week(WeeksCollection.findOne(_id));
}

const getWeekByNumber = (number) => {
  return new Week(WeeksCollection.findOne(number));
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

const currentWeek = (week) => {
  // Validation
  check(week, Object);
  
  // Get week number from feed data
  const { number } = week;

  // If week is not found, insert
  if (getWeeks({ number }).length === 0) {
    const weekObj = getWeekObj(week);
    const id = insertWeek(weekObj);
    return getWeekById(id);
  // Get the record and hydrate as Week class
  } else {
    return getWeekByNumber({ number });
  }
}

// Public methods (for API)
export {
  currentWeek
};

