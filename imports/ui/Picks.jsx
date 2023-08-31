import React, { useState } from 'react';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';

import { GamesCollection } from '../db/games';
import { PicksCollection } from '../db/picks';
import { WeeksCollection } from '../db/weeks';

import { PicksList } from './PicksList';

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
      .find({})
      .fetch()
      .sort((a, b) => b.number - a.number);

    const currentWeek = weeks[0];

    // Hydrate local collections
    const picksGamesAndWeeksHandler = Meteor.subscribe('picksAndGames', currentWeek);
    
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
  
  // Menu
  const [isBottomOpen, setIsBottomOpen] = useState(false);
  
  // Methods
  const toggleBottomNav = () => setIsBottomOpen(!isBottomOpen);

  const onWeekSelect = (event) => {
    console.log(event.target.value);
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
    <Grid container>
      <Grid mobile={6} tablet={4} laptop={3}>
        
        {/* <Header> */}
        <Box sx={styles.header}>
          {/* Title */}
          <Typography sx={styles.header.primary}>
            Picks
          </Typography>

          {/* Navigation Button */}
          <IconButton
            color="primary"
            aria-label="open drawer"
            onClick={() => toggleBottomNav()}
            sx={{ mr: 2, ...(isBottomOpen && { display: 'none' }) }}>
            <MenuIcon />
          </IconButton>
        </Box>
        
        {/* <Options> */}
        <Box sx={styles.filter}>
          <Select
            labelId="week-selection"
            id="week-selector"
            value={currentWeek._id}
            label="Week"
            onChange={onWeekSelect}
            sx={styles.filter.select}>
              {
                weeks.length > 0
                  ? weeks.map((week) => (
                      <MenuItem
                        disableGutters
                        key={week._id}
                        value={week._id}
                        sx={styles.filter.select.menuItem}>
                          Week {week.number}
                      </MenuItem>
                    ))
                  : (
                      <Typography>No weeks to select.</Typography>
                    )
                }
          </Select>
        </Box>

        {/* <List> */}
        <Box sx={styles.picksList}>
          <PicksList
            games={games}
            picks={picks}
            currentWeek={currentWeek}
            isLoading={isLoading}
          />
        </Box>
        
        {/* <Menu> (Hidden Drawer) */}
        <Drawer
          anchor={'bottom'}
          open={isBottomOpen}
          onClose={() => toggleBottomNav()}>
            <p><Button onClick={ () => navigateTo('') }>Home</Button></p>
            <p><Button onClick={ () => navigateTo('teams') }>Teams</Button></p>
            <p><Button onClick={ () => navigateTo('picks') }>Picks</Button></p>
        </Drawer>
        
      </Grid>
    </Grid>
  );
};
