import { addChirp, removeChirp } from '../service/chirpService';

Meteor.methods({
  async 'chirps.addChirp'(args) {
    return addChirp(args);
  },
  async 'chirps.removeChirp'(args) {
    return removeChirp(args);
  },
});


