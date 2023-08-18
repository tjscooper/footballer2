import { currentWeek } from "../service/weekService";

// Public methods
Meteor.methods({
  'weeks.currentWeek'(week) { return currentWeek(week) }
});


