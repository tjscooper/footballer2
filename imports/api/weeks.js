import { currentWeek } from "../service/weekService";

Meteor.methods({
  'weeks.currentWeek'(week) { return currentWeek(week) }
});


