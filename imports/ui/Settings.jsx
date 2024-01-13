import React, { useState } from 'react';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';

import { AppBarResponsive } from './AppBarResponsive';
import { Button } from '@mui/material';

/*
  Settings - Description

  An private area for managing the data feeds as well as password resets.
  
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
  const { users, isLoading } = useTracker(() => {
    
    // Hydrate users
    const usersHandler = Meteor.subscribe('players.listUsers');
    if (!usersHandler.ready()) {
      return { users: null, isLoading: true };
    }

    const users = Meteor.users
      .find({}, { sort: { username: 1 } })
      .fetch();

    // Return data
    return { users, isLoading: false };
  });

  // State

  const [currentWeek, setCurrentWeek] = useState(null);
  const [teamsMessage, setTeamsMessage] = useState(null);
  const [gamesMessage, setGamesMessage] = useState(null);
  const [scoresMessage, setScoresMessage] = useState(null);
  const [passwordResetMessage, setPasswordResetMessage] = useState(null);
  const [userSelect, setUserSelect] = useState('');

  // Methods

  const handleGetWeeks = () => {
    Meteor.call('feeds.getWeeks', (err, data) => {
      if (err) {
        console.err(err);
      }
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
      setScoresMessage(data.displayMessage);
    });
  }

  const onUserSelect = (event) => {
    const username = event.target.value;
    if (!username) {
      return;
    }
    setUserSelect(username);
  }

  const handleUserPasswordReset = () => {
    const username = userSelect || null;
    if (!username) {
      return;
    }

    Meteor.call('users.resetPassword', { username }, (err, data) => {
      if (err) {
        console.error(err);
      }
      setPasswordResetMessage(data.displayMessage);
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
    users: {
      select: {
        background: '#27272f',
        width: '180px',
        marginRight: '16px',
        color: '#FFFFFF',
        minHeight: '50px',
        maxHeight: '50px',
        borderRadius: '8px',
        menuItem: {
          borderRadius: '16px',
          textAlign: 'left',
          background: '#FFFFFF',
          height: '16px',
          fontSize: '14px',
          color: '#000000',
          paddingLeft: '8px',
          margin: '2px'
        }
      },
      resetPasswordMessageContainer: {
        color: '#000000',
        margin: '8px',
        display: 'flex',
        flexDirection: 'column',
        fontSize: '12px',
        justifyContent: 'space-between',
        minHeight: '42px'
      }
    },
    section: {
      display: 'block',
      marginTop: '16px',
      background: '#dedede',
      color: '#FFFFFF',
      padding: '8px',
      borderRadius: '16px',
      hint: {
        marginLeft: '60px',
        borderRadius: '4px',
        fontSize: '10px',
        padding: '4px',
        color: '#FFFFFF',
        backgroundColor: '#999999'
      },
      title: {
        marginLeft: '8px',
        marginTop: '16px',
        marginBottom: '16px',
        color: '#666666',
        fontStyle: '200',
        textTransform: 'uppercase',
        fontSize: '14px'
      },
      container: {
        display: 'inline-flex',
        color: '#000000',
        margin: '8px',
        button: {
          color: '#FFFFFF',
          minWidth: '100px',
          maxWidth: '100px',
          minHeight: '50px',
          maxHeight: '50px',
          borderRadius: '8px',
          fontSize: '14px',
          backgroundColor: '#333333',
          padding: '16px'
        },
        buttonResetPassword: {
          color: '#FFFFFF',
          minWidth: '100px',
          maxWidth: '100px',
          minHeight: '50px',
          maxHeight: '50px',
          borderRadius: '8px',
          lineHeight: '14px',
          fontSize: '12px',
          backgroundColor: 'brown',
          padding: '16px'
        },
        message: {
          marginLeft: '24px',
          display: 'flex',
          flexDirection: 'column',
          fontSize: '12px',
          justifyContent: 'space-between'
        }
      }
    }
  }

  if (isLoading) {
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

              <div style={styles.section.title}>
                Fetching Settings...
              </div>
            </Box>
          </Grid>
        </Grid>
      </>
    )
  }

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
            
            <div style={styles.section.title}>
              Manage Feeds
            </div>
            
            <Box style={styles.section.container}>
              <Button
                onClick={handleGetWeeks}
                sx={styles.section.container.button}>
                Weeks
              </Button>
              <Box sx={styles.section.container.message}>
                <span>YEAR: {currentWeek?.year || ''}</span>
                <span>TYPE: {currentWeek?.type || ''}</span>
                <span>WEEK: {currentWeek?.number || ''}</span>
              </Box>
            </Box>

            <hr />

            <Box style={styles.section.container}>
              <Button
                onClick={handleGetTeams}
                sx={styles.section.container.button}>
                Teams
              </Button>
              <Box sx={styles.section.container.message}>
                <span>STATUS:</span>
                <span>{teamsMessage || ''}</span>
              </Box>
            </Box>

            <hr />

            <Box style={styles.section.container}>
              <Button
                onClick={handleGetGames}
                sx={styles.section.container.button}>
                Games
              </Button>
              <Box sx={styles.section.container.message}>
                <span>STATUS:</span>
                <span>{gamesMessage || ''}</span>
              </Box>
            </Box>

            <hr />

            <Box style={styles.section.container}>
              <Button
                onClick={handleGetScores}
                sx={styles.section.container.button}>
                Scores
              </Button>
              <Box sx={styles.section.container.message}>
                <span>STATUS:</span>
                <span>{scoresMessage || ''}</span>
              </Box>
            </Box>

          </Box>

          <Box sx={styles.section}>
            
            <div style={styles.section.title}>
              Manage Users
              <span style={styles.section.hint}>
                <em>Password: </em><span style={{ marginLeft: '6px', textTransform: 'lowercase' }}>nfl2023</span>
              </span>
            </div>
            
            <Box style={styles.section.container}>
              { users && users.length > 0
                && <>
                    <Select
                        labelId="user-selection"
                        id="user-selector"
                        label="Users"
                        value={userSelect}
                        onChange={ (event) => onUserSelect(event)}
                        sx={styles.users.select}>
                          {
                            users.length > 0
                              ? users.map((user) => (
                                  <MenuItem
                                    id="users-select-menu-item"
                                    disableGutters
                                    key={user.username}
                                    value={user.username}
                                    sx={styles.users.select.menuItem}>
                                      { user.username }
                                  </MenuItem>
                                ))
                              : (
                                  <Typography>No users to select.</Typography>
                                )
                            }
                      </Select>
                      <Button
                        onClick={handleUserPasswordReset}
                        sx={styles.section.container.buttonResetPassword}>
                        Reset Password
                      </Button>
                    </>
              }
            </Box>

            <Box sx={styles.users.resetPasswordMessageContainer}>
                <span>STATUS:</span>
                <span>{passwordResetMessage || ''}</span>
            </Box>
          </Box>

        </Grid>
      </Grid>
    </>
  );
};
