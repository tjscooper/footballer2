import { check } from 'meteor/check';

import { WeeksCollection } from '../db/weeks';
import Week from '../model/week';

const currentWeek = (week) => {
  // Validation
  check(week, Object);

  // If week is not found, insert
  if (WeeksCollection.find({ number: week.number }).fetch().length === 0) {
    const weekObj = new Week({
      number: week.number
    });
    delete weekObj._id;
    const _id = WeeksCollection.insert(weekObj);
    const currentWeek = WeeksCollection.findOne(_id);
    return new Week(currentWeek);

  // Get the record and hydrate as Week class
  } else {
    const currentWeek = WeeksCollection.findOne({ number: week.number });
    return new Week(currentWeek);
  }
}

export {
  currentWeek
};

