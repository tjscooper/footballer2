import React, { useState } from 'react';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';

import { GamesCollection } from '../db/games';
import { PicksCollection } from '../db/picks';
import { WeeksCollection } from '../db/weeks';

import { PicksList } from './PicksList';
import { AppBarResponsive } from './AppBarResponsive';
import { Button } from '@mui/material';

/*
  Settings - Description

  
  
*/

export const Settings = () => {

  // References
  const navigate = useNavigate();

  const navigateTo = (pageName) => navigate(`/${pageName}`);  

  // Authenticated Route
  // Force login if no meteor token is found
  if (!localStorage.getItem('Meteor.loginToken')) {
    navigateTo('sign-in');
  }

  // Data
  // const { picks, games, weeks, currentWeek, isLoading } = useTracker(() => {
    
  //   // Hydrate weeks
  //   const weeksHandler = Meteor.subscribe('weeks');
  //   if (!weeksHandler.ready()) {
  //     return { weeks: null, games: null, picks: null, isLoading: true };
  //   }

  //   const weeks = WeeksCollection
  //     .find({})
  //     .fetch()
  //     .sort((a, b) => b.number - a.number);

  //   const currentWeek = weeks[0];

  //   // Hydrate local collections
  //   const picksGamesAndWeeksHandler = Meteor.subscribe('userPicksAndGames', currentWeek);
    
  //   // Await data hydration
  //   if (!picksGamesAndWeeksHandler.ready()) {
  //     return { picks: null, games: null, weeks: null, isLoading: true };
  //   }
    
  //   // Query local collections
  //   const picks = PicksCollection.find({ weekId: currentWeek._id }).fetch();
  //   const games = GamesCollection.find({ weekId: currentWeek._id }).fetch();
    
  //   // Return data
  //   return { picks, games, weeks, currentWeek, isLoading: false };
  // });

  // State

  const [currentWeek, setCurrentWeek] = useState(null);
  const [teamsMessage, setTeamsMessage] = useState(null);
  const [gamesMessage, setGamesMessage] = useState(null);
  const [scoresMessage, setScoresMessage] = useState(null);

  // Methods

  const handleGetWeeks = () => {
    Meteor.call('feeds.getWeeks', (err, data) => {
      if (err) {
        console.err(err);
      }
      console.log('data', data);
      var obj = { status: true, ...data };
      if (obj?.displayMessage !== null) {
        obj['displayMessage'] = data.displayMessage;
      } else {
        obj = { obj, ...data };
      }
      setCurrentWeek(obj);
    });
  }

  const handleGetTeams = () => {
    Meteor.call('feeds.getTeams', (err, data) => {
      if (err) {
        console.err(err);
      }
      setTeamsMessage(data.displayMessage);
    });
  }

  const handleGetGames = () => {
    Meteor.call('feeds.getGames', (err, data) => {
      if (err) {
        console.err(err);
      }
      setGamesMessage(data.displayMessage);
    });
  }

  const handleGetScores = () => {
    Meteor.call('feeds.getScores', (err, data) => {
      if (err) {
        console.err(err);
      }
      console.log('data', data);
      setScoresMessage(data.displayMessage);
    });
  }
  
  // Styles
  const styles = {
    container: {
      minWidth: '91vw',
      maxWidth: '91vw',
      minHeight: '90.5vw',
      padding: '12px'
    },
    header: {
      display: 'block',
      width: '90vw',
      marginTop: '16px',
      primary: {
        fontSize: '18px',
        fontWeight: 'regular',
        textTransform: 'uppercase',
        color: '#999999'
      }
    },
    section: {
      display: 'block',
      marginTop: '16px',
      background: '#dedede',
      color: '#FFFFFF',
      padding: '16px',
      borderRadius: '24px',
      button: {
        color: '#FFFFFF',
        minWidth: '100px',
        maxWidth: '100px',
        maxHeight: '55px',
        borderRadius: '8px',
        fontSize: '14px',
        backgroundColor: '#333333',
        padding: '16px'
      }
    }
  }

  // View
  // if (!currentWeek) {
  //   return null;
  // }

  return (
    <>
      <AppBarResponsive />
      <Grid container>
        <Grid sx={styles.container} mobile={6} tablet={4} laptop={3}>
          {/* General */}
          <Box sx={styles.header}>
            <Box sx={styles.header.primary}>
              Settings
            </Box>
          </Box>
          <Box sx={styles.section}>

            <Box style={{ display: 'inline-flex', color: '#000000', margin: '8px' }}>
              <Button
                onClick={handleGetWeeks}
                sx={styles.section.button}>
                Weeks
              </Button>
              <Box style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column' }}>
                <span>YEAR: {currentWeek?.year || '-'}</span>
                <span>TYPE: {currentWeek?.type || '-'}</span>
                <span>WEEK: {currentWeek?.number || '-'}</span>
              </Box>
            </Box>

            <hr />

            <Box style={{ display: 'inline-flex', color: '#000000', margin: '8px' }}>
              <Button
                onClick={handleGetTeams}
                sx={styles.section.button}>
                Teams
              </Button>
              <Box style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column' }}>
                <span>STATUS:</span>
                <span>{teamsMessage || '-'}</span>
              </Box>
            </Box>

            <hr />

            <Box style={{ display: 'inline-flex', color: '#000000', margin: '8px' }}>
              <Button
                onClick={handleGetGames}
                sx={styles.section.button}>
                Games
              </Button>
              <Box style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column' }}>
                <span>STATUS:</span>
                <span>{gamesMessage || '-'}</span>
              </Box>
            </Box>

            <hr />

            <Box style={{ display: 'inline-flex', color: '#000000', margin: '8px' }}>
              <Button
                onClick={handleGetScores}
                sx={styles.section.button}>
                Scores
              </Button>
              <Box style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column' }}>
                <span>STATUS:</span>
                <span>{scoresMessage || '-'}</span>
              </Box>
            </Box>


          </Box>
        </Grid>
      </Grid>
    </>
  );
};
