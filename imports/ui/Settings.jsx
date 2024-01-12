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

  // Methods
  const onWeekSelect = (event) => {
    // console.log(event.target.value);
  }
  
  // Styles
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      minWidth: '90.5vw',
      minHeight: '90.5vw',
      background: '#000000',
      padding: '12px',
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: '16px',
      primary: {
        fontSize: '18px',
        fontWeight: 'regular',
        textTransform: 'uppercase',
        color: '#999999',
        minWidth: '310px'
      }
    },
    section: {
      display: 'flex',
      flexDirection: 'row',
      width: '90vw',
      marginTop: '16px',
      background: '#666666',
      color: '#FFFFFF',
      padding: '16px',
      borderRadius: '24px',
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
            {/* <Box sx={styles.header.primary}>
              Settings
            </Box> */}
            <Box>Test</Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
