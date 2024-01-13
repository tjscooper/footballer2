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
  Picks - Description

  picks are stored in a collection
  each pick has a userId, gameId, weekId, and teamId
  
  the weeks collection will populate a dropdown for weeks (defaulting to current week)
  Once the current week data (sub is filled) is known, the picks collections can be queried

  if the picks query returns empty, the games collection will be used to create an object
  for any new picks

  picks are disabled once a game has started.
  
*/

export const Picks = () => {

  // References
  const navigate = useNavigate();

  const navigateTo = (pageName) => navigate(`/${pageName}`);  

  // Authenticated Route
  // Force login if no meteor token is found
  if (!localStorage.getItem('Meteor.loginToken')) {
    navigateTo('sign-in');
  }

  // Data
  const { picks, games, weeks, currentWeek, isLoading } = useTracker(() => {
    
    // Hydrate weeks
    const weeksHandler = Meteor.subscribe('weeks');
    if (!weeksHandler.ready()) {
      return { weeks: null, games: null, picks: null, isLoading: true };
    }

    const weeks = WeeksCollection
      .find({}, { sort: { type: -1, number: -1 } }).fetch();

    const currentWeek = weeks[0];

    // Hydrate local collections
    const picksGamesAndWeeksHandler = Meteor.subscribe('userPicksAndGames', currentWeek);
    
    // Await data hydration
    if (!picksGamesAndWeeksHandler.ready()) {
      return { picks: null, games: null, weeks: null, isLoading: true };
    }
    
    // Query local collections
    const picks = PicksCollection.find({ weekId: currentWeek._id }).fetch();
    const games = GamesCollection.find({ weekId: currentWeek._id }).fetch();
    
    // Return data
    return { picks, games, weeks, currentWeek, isLoading: false };
  });

  // Methods
  const onWeekSelect = (event) => {
  }
  
  // Styles
  const styles = {
    header: {
      display: 'flex',
      flexDirection: 'row',
      width: '90vw',
      primary: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#FFFFFF',
        minWidth: '310px'
      }
    },
    filter: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      select: {
        marginTop: '8px',
        background: '#27272f',
        width: '140px',
        color: '#FFFFFF',
        height: '48px',
        menuItem: {
          background: 'blue',
          height: '18px',
          color: '#000000',
          paddingLeft: '16px',
        }
      }
    },
    picksList: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'start',
      width: '100%',
    }
  }

  // View
  if (!currentWeek) {
    return null;
  }

  return (
    <>
      <AppBarResponsive />
      <Grid container>
        <Grid mobile={6} tablet={4} laptop={3}>
          {/* <List> */}
          <Box sx={styles.picksList}>
            <PicksList
              games={games}
              picks={picks}
              currentWeek={currentWeek}
              isLoading={isLoading}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
