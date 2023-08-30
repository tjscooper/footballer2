import {
  currentWeek,
  processFeed
} from "../service/weekService";

// Public methods
Meteor.methods({
  'weeks.currentWeek'(week) { return currentWeek(week) },
  'weeks.processFeed'(data) { return processFeed(data) }
});


