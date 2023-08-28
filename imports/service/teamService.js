import { check } from 'meteor/check';

import { TeamsCollection } from '../db/teams';
import Team from '../model/team';
import ServiceResponse from '../model/serviceResponse';

// Enums
import { ENTITY } from '../model/entities';

const getTeams = (queryObj) => {
  return TeamsCollection.find(queryObj).fetch();
}

const getTeamById = (_id) => {
  return new Team(TeamsCollection.findOne(_id));
}

const getTeamByCompetitorId = (_competitorId) => {
  return new Team(TeamsCollection.find({ competitorId: _competitorId }).fetch()[0]);
}

const insertTeam = (teamObj) => {
  const id = TeamsCollection.insert(teamObj);
  check(id, String);
  return id;
}

const updateTeam = (queryObj) => {
  const { _id } = getTeamByCompetitorId(queryObj._competitorId);
  return TeamsCollection.update(_id, {
    $set: {
      record: queryObj._record,
      updatedAt: new Date()
    }
  });
}

const updateTeamRecord = (team) => {
  const result = updateTeam({
    _competitorId: team.id,
    _record: team.record
  });
  return result === 1;
}

const getTeamObj = (team) => {
  const teamObj = new Team(team);
  delete teamObj._id;
  return teamObj;
}

const processFeed = async ({ sports }) => {
  // Success
  try {
    // Validation
    check(sports, Array);

    // Get teams
    if (getTeams({}).length === 0) {
      // Insert teams
      const games = sports[0].leagues[0].events;
      games.forEach(game => {
        const teams = game.competitors;
        teams.forEach(team => {
          const teamObj = getTeamObj({
            _id: null,
            _competitorId: team.id,
            _displayName: team.displayName,
            _name: team.name, 
            _abbreviation: team.abbreviation,
            _location: team.location,
            _color: team.color,
            _alternateColor: team.alternateColor,
            _logo: team.logo,
            _logoDark: team.logoDark,
            _record: team.record
          });
          const id = insertTeam(teamObj);
          console.debug(`Inserted ${team.abbreviation} at [id]${id}`);
        });
      });
    } else {
      // Teams already exist, only update team records
      const games = sports[0].leagues[0].events;
      games.forEach(game => {
        const teams = game.competitors;
        teams.forEach(team => {
          updateTeamRecord(team);
        });
      });
    }
    
    // Response
    return new ServiceResponse({
      _status: true,
      _displayMessage: 'Successfully processed feed.',
      _meta: {
        detailedText: 'Automated service call to insert and update team information.',
        serviceClass: 'TeamService',
        methodName: 'processFeed',
      },
      _type: ENTITY.TEAM
    });
  
  }
  // Failure
  catch (e) {
    // Response
    return new ServiceResponse({
      _status: false,
      _displayMessage: 'Failed to process team information.',
      _meta: {
        detailedText: 'Automated service call to process team information.',
        serviceClass: 'TeamService',
        methodName: 'processFeed',
        data: {
          error: e,
          errorMessage: JSON.stringify(e)
        }
      },
      _type: ENTITY.TEAM
    });
  }
};

export {
  processFeed,
  getTeams,
  getTeamById,
  getTeamByCompetitorId
};
