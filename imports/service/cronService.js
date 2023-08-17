import { SyncedCron } from 'meteor/percolate:synced-cron';

// Note:
// parser is a later.parse object

export default class CronService {

  constructor() {}

  static start() {
    SyncedCron.start();
  }

  static stop() {
    SyncedCron.stop();
  }

  static register({ name, scheduleParserText, scheduleFn }) {
    // TODO Remove test scenario 01
    SyncedCron.add({
      name,
      schedule: function(parser) {
        return parser.text(scheduleParserText);
      },
      job: function() {
        // Method
        scheduleFn();
      }
    });
  }
}
