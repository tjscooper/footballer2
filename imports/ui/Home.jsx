import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ToggleOffRoundedIcon from '@mui/icons-material/ToggleOffRounded';
import ToggleOnRoundedIcon from '@mui/icons-material/ToggleOnRounded';
import { CircularProgress } from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';

import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryLabel,
  VictoryStack
} from 'victory';

import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';

import { GamesCollection } from '../db/games';
import { PicksCollection } from '../db/picks';
import { WeeksCollection } from '../db/weeks';
import { LeaderboardsCollection } from '../db/leaderboards';

import { GamesList } from './GamesList';
import { Chirps } from './Chirps';
import { AppBarResponsive } from './AppBarResponsive';

export const Home = () => {

  // References
  const navigate = useNavigate();

  // Routing
  const navigateTo = (pageName) => navigate(`/${pageName}`);

  // Authenticated Route
  // Force login if no meteor token is found
  if (!localStorage.getItem('Meteor.loginToken')) {
    navigateTo('sign-in');
  }

  // State
  const [showActiveFilterToggle, setShowActiveFilterToggle] = useState(false); // Toggle switch in header
  const [chirpsPanelOpen, setChirpsPanelOpen] = useState(false);
  const [selectedWeekId, setSelectedWeekId] = useState(null);

  // Data
  const { currentWeek, weeks, games, picks, players, leaderboard, isLoading } = useTracker(() => {
    
    // Hydrate players
    const playersHandler = Meteor.subscribe('players.listUsers');
    if (!playersHandler.ready()) {
      return { weeks: null, games: null, players: null, picks: null, isLoading: true };
    }

    const players = Meteor.users.find({}).fetch();
    
    // Hydrate weeks
    const weeksHandler = Meteor.subscribe('weeks');
    if (!weeksHandler.ready()) {
      return { weeks: null, games: null, players, picks: null, isLoading: true };
    }

    const weeks = WeeksCollection
      .find({})
      .fetch()
      .sort((a, b) => b.number - a.number);

    const currentWeek = selectedWeekId !== null
      ? weeks.find(w => w._id === selectedWeekId)
      : weeks[0];

    // Get data from application logic

    const leaderboardHandler = Meteor.subscribe('leaderboard.byWeekId', currentWeek);
    
    if (!leaderboardHandler.ready()) {
      return { currentWeek, isLoading: true };
    }

    const leaderboard = LeaderboardsCollection.find({ weekId: currentWeek._id }).fetch()[0];

    // Hydrate local collections
    const picksAndGamesHandler = Meteor.subscribe('picksAndGames', currentWeek); 

    // Await data hydration
    if (!picksAndGamesHandler.ready()) {
      return { currentWeek, isLoading: true };
    }
    
    // Query local collections
    const picks = PicksCollection.find({ weekId: currentWeek._id }).fetch();
    const games = GamesCollection.find({ weekId: currentWeek._id }).fetch();

    // Return data
    return { currentWeek, picks, games, weeks, players, leaderboard, isLoading: false };
  }, [selectedWeekId]);
  
  // Methods
  const onWeekSelect = (event) => {
    setSelectedWeekId(event.target.value);
  }

  const handleFilterToggle = () => {
    setShowActiveFilterToggle(!showActiveFilterToggle);
  }

  const toggleChirpsPanel = () => setChirpsPanelOpen(!chirpsPanelOpen);

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
      width: '90.75vw',
      height: '300px',
      background: '#323232',
      borderBottomRightRadius: '16px',
      borderBottomLeftRadius: '16px',
    },
    chirps: {
      btn: {
        marginLeft: '16px',
        marginTop: '-8px',
        paddingLeft: '24px',
        height: '64px',
        width: '64px',
        color: '#FFFFFF',
        background: '#f34cc5',
        borderRadius: '48px',
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'monospace',
        border: '3px solid #FFFFFF',
        zIndex: 99
      }
    },
    filter: {
      border: highlightRegions ? '1px solid red' : 'none',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: '100%',
      select: {
        marginTop: '8px',
        background: '#27272f',
        width: '140px',
        color: '#FFFFFF',
        height: '48px',
        borderRadius: '16px',
        menuItem: {
          borderRadius: '16px',
          textAlign: 'center',
          background: '#FFFFFF',
          height: '18px',
          color: '#000000',
          paddingLeft: '16px',
          margin: '10px'
        }
      },
      toggle: {
        border: highlightRegions ? '1px solid orange' : 'none',
        border: 'none',
        color: '#FFFFFF',
        textTransform: 'capitalize',
        paddingTop: '12px',
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

  // Components

  const FilterToggle = ({ onLabelText, offLabelText, showActiveFilterToggle, handleToggle, styles, useOnLabelTextForBoth = false }) => {
    return showActiveFilterToggle
      ? <Button variant="outlined"
          startIcon={<ToggleOnRoundedIcon sx={{ color: '#d0ff12' }} />}
          onClick={ () => handleToggle(false) }
          sx={styles}>
          {useOnLabelTextForBoth ? onLabelText : offLabelText}
        </Button>
      : <Button variant="outlined"
          startIcon={<ToggleOffRoundedIcon />}
          onClick={ () => handleToggle(true) }
          sx={styles}>
          {onLabelText}
        </Button>
  }

  const BarChart = (chartData) => {

    if (!chartData) {
      return null;
    }

    const data = chartData.data.sort((a, b) => a.totalWins - b.totalWins);

    return (
      <VictoryChart
        // domainPadding will add space to each side of VictoryBar to
        // prevent it from overlapping the axis
        domainPadding={{ x: 16, y: 18 }}
        padding={{ top: 50, bottom: 50, right: 24, left: 90 }}
        height={250}
        width={300}
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 100
        }}
      >
        <VictoryAxis
          tickFormat={data.map(d => d.username)}
          style={{
            axis: { stroke: '#f34cc5', width: '100px' },
            data: {
              stroke: '#FFFFFF'
            },
            tickLabels: {
              fontSize: 10,
              stroke: '#FFFFFF',
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 100
            }
          }}
        />
        <VictoryAxis
          label={ !selectedWeekId ? "This Week" : `Week ${currentWeek.number}`}
          axisLabelComponent={
            <VictoryLabel
              dx={-24}
              dy={-210}
              style={[{
                textanchor: "middle",
                fontSize: 16,
                fill: '#FFFFFF',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 600,
                opacity: 0.25
              }]}
          />}
          dependentAxis
          domain={[0, 16]}
          tickFormat={(x) => x}
          style={{
            axis: { stroke: '#f34cc5' },
            data: {
              stroke: '#FFFFFF'
            },
            tickLabels: {
              fontSize: 12,
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 100,
              stroke: '#FFFFFF'
            }
          }}
        />
        <VictoryStack
          colorScale={["#698009", "#d0ff12"]}>
          
          {/* Confirmed Wins */}
          <VictoryBar
            barRatio={0.70}
            horizontal
            sortOrder='ascending'
            data={data}
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 }
            }}
            x="username"
            y="wins"
          />

          {/* Currently Winning */}
          <VictoryBar
            barRatio={0.70}
            horizontal
            sortOrder='ascending'
            data={data}
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 }
            }}
            labels={({ datum }) => datum.totalWins > 0 ? Math.round(datum.totalWins) : '' }
            style={{ labels: { fill: "white", fontSize: 10 } }}
            labelComponent={<VictoryLabel dx={4}/>}
            x="username"
            y="winning"
          />
        </VictoryStack>
      </VictoryChart>
    );
  }

  // View
  if (!currentWeek) {
    return <Box sx={{
      background: 'inherit',
      color: '#FFFFFF',
      paddingTop: '60px',
      textAlign: 'center',
      padding: '16px',
      alignContent: 'center',
      justifyContent: 'center',
      textTransform: 'uppercase',
      fontSize: '16px'
    }}>
      <CircularProgress color="secondary" />
    </Box>
  }

  return (
    <>
      <AppBarResponsive />
      <Grid container>
        <Grid mobile={6} tablet={4} laptop={3}>
          {/* Leaderboard */}
          <Box sx={styles.chart}>
            {
              // Render the leaderboard chart 
              BarChart(leaderboard)
            }
          </Box>

          {/* <Header> */}
          <Box sx={styles.header}>
            {/* Week Selection */}
            { weeks 
                && <Select
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
                                  id="weeks-select-menu-item"
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
            }

            {/* Show Active Toggle */}
            

            <Button
              variant="outlined"
              sx={{ ...styles.chirps.btn }}
              startIcon={<CampaignIcon />}
              onClick={ () => toggleChirpsPanel() } />

            <FilterToggle
              onLabelText='Show Active'
              offLabelText='Show All'
              showActiveFilterToggle={showActiveFilterToggle}
              handleToggle={handleFilterToggle}
              styles={styles.filter.toggle}
              useOnLabelTextForBoth={true} />

          </Box>

          {/* <List> */}
          <Box sx={styles.picksList}>
            <GamesList
              games={games}
              picks={picks}
              players={players}
              leaderboard={leaderboard}
              currentWeek={currentWeek}
              isLoading={isLoading}
              showActiveFilterToggle={showActiveFilterToggle}
            />
          </Box>
        </Grid>
      </Grid>
      <Drawer
        anchor={'right'}
        open={chirpsPanelOpen}
        onClose={() => toggleChirpsPanel()}
        PaperProps={{ sx: { width: '75vw', paddingLeft: '16px', background: '#333333' } }}>
          <Chirps
            toggleChirpsPanel={toggleChirpsPanel} />
      </Drawer>
    </>
  );
};
