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

import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';

import { GamesCollection } from '../db/games';
import { PicksCollection } from '../db/picks';
import { WeeksCollection } from '../db/weeks';

import { GamesList } from './GamesList';

/*
  Home - Description

  a list of games for a given week, should show:
  • score
  • pick
  • clock
  • redzone
  • logos
  • abbrev
  • last play



*/

export const Home = () => {

  // References
  const navigate = useNavigate();

  // Authenticated Route
  const getCurrentUserId = () => Meteor.userId();
  
  const currentUser = useTracker(() => {
    const _id = getCurrentUserId();
    return Meteor.users.find({ _id }).fetch()[0];
  });

  if (!currentUser) {
    //navigateTo('sign-in');
  }

  // Data
  const { picks, games, weeks, currentWeek, isLoading } = useTracker(() => {
    
    // Hydrate weeks
    const weeksHandler = Meteor.subscribe('weeks');
    if (!weeksHandler.ready()) {
      return { weeks: null, games: null, picks: null, isLoading: true };
    }

    // TODO remove
    const data = [
      {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
      },
      {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
      },
      {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
      },
      {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
      },
      {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
      },
      {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
      },
      {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
      },
    ];

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
  const [isLeftOpen, setIsLeftOpen] = useState(false); // Menu (Left)
  
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

  const barChart = (props) => (
    <ResponsiveContainer width="100%" height="35%">
        <BarChart
          width={500}
          height={100}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill="#8884d8" />
          <Bar dataKey="uv" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
  );

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
