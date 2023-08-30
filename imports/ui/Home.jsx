import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';

import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ToggleOffRoundedIcon from '@mui/icons-material/ToggleOffRounded';
import ToggleOnRoundedIcon from '@mui/icons-material/ToggleOnRounded';

import { VictoryBar, VictoryChart, VictoryAxis } from 'victory';

import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';

import { GamesCollection } from '../db/games';
import { PicksCollection } from '../db/picks';
import { WeeksCollection } from '../db/weeks';

import { GamesList } from './GamesList';

export const Home = () => {

  // References
  const navigate = useNavigate();

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
    const picksAndGamesHandler = Meteor.subscribe('picksAndGames', currentWeek);
    
    // Await data hydration
    if (!picksAndGamesHandler.ready()) {
      return { picks: null, games: null, weeks: null, isLoading: true };
    }
    
    // Query local collections
    const picks = PicksCollection.find({ weekId: currentWeek._id }).fetch();
    console.log('picks', picks);
    const games = GamesCollection.find({ weekId: currentWeek._id }).fetch();
    console.log('games', games);

    // Return data
    return { picks, games, weeks, currentWeek, isLoading: false };
  });
  
  // State
  const [isLeftOpen, setIsLeftOpen] = useState(false); // Menu (Left Drawer)
  const [showActiveFilterToggle, setShowActiveFilterToggle] = useState(false); // Toggle switch in header
  
  // Methods
  const toggleLeftNav = () => setIsLeftOpen(!isLeftOpen);
  
  const navigateTo = (pageName) => navigate(`/${pageName}`);

  const signOut = () => { 
    console.log('signing out...');
    Meteor.logout((err) => {
      if (err) {
        console.error(err);
      }
      console.log('signed out...')
      navigateTo('sign-in');
    });
  }

  const onWeekSelect = (event) => {
    console.log(event.target.value);
  }

  const handleFilterToggle = () => {
    setShowActiveFilterToggle(!showActiveFilterToggle);
  }

  // Components
  const Copyright = (props) => {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="http://hypnochip.com/">
          Hypnochip
        </Link>
        {` ${ new Date().getFullYear() }.`}
      </Typography>
    );
  }

  const FilterToggle = ({ onLabelText, offLabelText, showActiveFilterToggle, handleToggle, styles }) => {
    return showActiveFilterToggle
      ? <Button variant="outlined"
          startIcon={<ToggleOnRoundedIcon />}
          onClick={ () => handleToggle(false) }
          sx={styles}>
          {offLabelText}
        </Button>
      : <Button variant="outlined"
          startIcon={<ToggleOffRoundedIcon />}
          onClick={ () => handleToggle(true) }
          sx={styles}>
          {onLabelText}
        </Button>
  }

  const BarChart = () => {
    
    // Sample data structure for totals
    const orderBy = 'wins';
    const data = [
      { user: 'Tim', wins: 14 },
      { user: 'Rach', wins: 16 },
      { user: 'Liam', wins: 8 },
      { user: 'Stan', wins: 10 }
    ].sort((a,b) => a[orderBy] > b[orderBy]);
    
    return (
      <VictoryChart
        // domainPadding will add space to each side of VictoryBar to
        // prevent it from overlapping the axis
        domainPadding={20}
      >
        <VictoryAxis
          // tickValues specifies both the number of ticks and where
          // they are placed on the axis
          tickValues={[1, 2, 3, 4]}
          tickFormat={data.map(d => d.user)}
        />
        <VictoryAxis
          dependentAxis
          // tickFormat specifies how ticks should be displayed
          tickFormat={(x) => x}
        />
        <VictoryBar
          horizontal
          data={data}
          x="user"
          y="wins"
        />
      </VictoryChart>
    );
  }

  // Styles
  const highlightRegions = false;
  const styles = {
    header: {
      border: highlightRegions ? '1px solid blue' : 'none',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'spread-evenly',
      width: '94vw',
      primary: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#FFFFFF',
        minWidth: '310px'
      }
    },
    chart: {
      width: '90vw',
      height: '200px',
      background: '#FFFFFF',
      borderRadius: '12px'
    },
    filter: {
      border: highlightRegions ? '1px solid red' : 'none',
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
      },
      toggle: {
        border: highlightRegions ? '1px solid orange' : 'none',
        border: 'none'
      }
    },
    picksList: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'start',
      width: '100%',
    },
    menu: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'start',
      width: '70vw',
    }
  };

    // View
  if (!currentWeek) {
    return null;
  }

  return (
    <Grid container>
      <Grid mobile={6} tablet={4} laptop={3}>
        {/* Leaderboard */}
        <Box sx={styles.chart}>
          <BarChart
            styles={{ width: '90vw', height: '200px', minHeight: '200px' }} />
        </Box>

        {/* <Header> */}
        <Box sx={styles.header}>
          {/* Week Selection */}
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

          {/* Show Active Toggle */}
          <FilterToggle
            onLabelText='Show Active'
            offLabelText='Show All'
            showActiveFilterToggle={showActiveFilterToggle}
            handleToggle={handleFilterToggle}
            styles={styles.filter.toggle} />
          
          {/* Navigation Button */}
          <IconButton
            color="primary"
            aria-label="open drawer"
            onClick={() => toggleLeftNav()}
            sx={{ mr: 2, ...(isLeftOpen && { display: 'none' }) }}>
            <MenuIcon />
          </IconButton>
        </Box>

        {/* <List> */}
        <Box sx={styles.picksList}>
          <GamesList
            games={games}
            picks={picks}
            currentWeek={currentWeek}
            isLoading={isLoading}
            showActiveFilterToggle={showActiveFilterToggle}
          />
        </Box>

        {/* <Copyright> */}
        {/* <Copyright sx={{ mt: 8, mb: 4, width: '90vw' }} /> */}
        
        {/* <Menu> (Hidden Drawer) */}
        <Drawer
          sx={{ width: '90vw' }}
          anchor={'left'}
          open={isLeftOpen}
          onClose={() => toggleLeftNav()}>
            <p><Button onClick={ () => navigateTo('sign-up') }>Sign Up</Button></p>
            <p><Button onClick={ () => navigateTo('sign-in') }>Sign In</Button></p>
            <p><Button onClick={ () => signOut() }>Sign Out</Button></p>
            <p><Button onClick={ () => navigateTo('settings') }>Settings</Button></p>
            <p><Button onClick={ () => navigateTo('picks') }>Picks</Button></p>
            <p><Button onClick={ () => navigateTo('teams') }>Teams</Button></p>
        </Drawer>

      </Grid>
    </Grid>
  );
};
