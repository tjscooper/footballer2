import { check } from 'meteor/check';

import Team from '../model/team';

const processFeed = async ({ sports }) => {
  // Validation
  check(sports, Array);

  // Get teams
  console.log(sports[0].id); // "20"
  
  // Response
  return 'cheese';
};

export {
  processFeed
};
