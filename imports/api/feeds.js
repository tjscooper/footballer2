import FeedService from '../service/feedService';

const feedService = new FeedService().getInstance();

Meteor.methods({
  async 'feeds.getTeams'() {
    return feedService.getTeams();
  },
  async 'feeds.getWeeks'() {
    return feedService.getWeeks();
  },
  async 'feeds.getGames'() {
    return feedService.getGames();
  },
  async 'feeds.getScores'() {
    return feedService.getScores();
  },
});


