import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { useNavigate } from 'react-router-dom';
import { GAME_STATUS } from '../model/entities';

export const PicksList = (props) => {

  // References
  const navigate = useNavigate();

  // Data
  const { games, picks, currentWeek } = props;
  
  // Methods
  const toggleBottomNav = () => setIsBottomOpen(!isBottomOpen);

  const navigateTo = (pageName) => navigate(`/${pageName}`);

  const handleHomePick = ({ homeTeam, gameId }) => {
    if (!homeTeam || !gameId) {
      return;
    }

    Meteor.call('picks.setPick', {
      teamId: homeTeam.id,
      gameId,
      weekId: currentWeek._id
    }, (err, data) => {
      if (err) {
        console.error(err);
      }
    });
  }

  const handleAwayPick = ({ awayTeam, gameId }) => {
    if (!awayTeam || !gameId) {
      return;
    }

    Meteor.call('picks.setPick', {
      teamId: awayTeam.id,
      gameId,
      weekId: currentWeek._id
    }, (err, data) => {
      if (err) {
        console.error(err);
      }
    });
  }

  const isPicked = (team) => {
    if (picks.length === 0) {
      return false;
    }
    let isFound = false;
    picks.forEach(pick => {
      if (pick.teamId === team.id) {
        isFound = true;
      }
    }); 
    return isFound;
  }

  // Styles
  const styles = {
    box: {
      bgcolor: '#FFFFFF',
      borderRadius: '16px',
    },
    listBox: {
      marginTop: '8px',
      bgcolor: '#FFFFFF',
      borderRadius: '16px',
      list: {
        // border: '1px solid red', // TODO Remove
        listItem: {
          minHeight: '72px',
          paddingLeft: '10px',
          container: {
            homePick: {
              // border: '1px solid green', // TODO Remove
              height: '100%',
              width: '10vw',
              marginLeft: '8px',
              btn: {
                width: '10vw',
                marginTop: '-4px'
              }
            },
            homeLogo: {
              // border: '1px solid orange', // TODO Remove
              height: '100%',
              width: '12vw',
              paddingTop: '3px'
            },
            homeInfo: {
              // border: '1px solid pink', // TODO Remove
              height: '100%',
              width: '10vw',
              name: {
                fontWeight: 'bold',
                fontSize: '18px'
              },
              record: {
                fontWeight: 'light',
                fontSize: '12px',
                color: '#333333'
              }
            },
            odds: {
              // border: '1px solid blue', // TODO Remove
              height: '50%',
              width: '10vw',
              paddingLeft: '8px',
              paddingRight: '8px',
              textAlign: 'center',
              fontSize: '16px',
              margin: '0px',
              btn: {
                width: '10vw'
              }
            },
            awayInfo: {
              // border: '1px solid pink', // TODO Remove
              height: '100%',
              width: '10vw',
              name: {
                fontWeight: 'bold',
                fontSize: '18px'
              },
              record: {
                fontWeight: 'light',
                fontSize: '12px',
                color: '#333333'
              }
            },
            awayLogo: {
              // border: '1px solid orange', // TODO Remove
              height: '100%',
              width: '12vw',
              paddingTop: '3px'
            },
            awayPick: {
              // border: '1px solid green', // TODO Remove
              height: '100%',
              width: '10vw',
              marginRight: '16px',
              marginLeft: '-8px',
              btn: {
                width: '10vw',
                marginTop: '-4px',
                marginRight: '20px'
              }
            }
          },
          // border: '1px solid purple', // TODO Remove
          display: 'flex',
          width: '90vw',
          teamInfo: {
            name: {},
            record: {},
            logo: {}
          }
        }
      }
    }
  };
  
  if (!games) {
    return <div>No Games found.</div>
  }

  const LogoImage = (imageSrc) => {
    return (
      <img
        src={imageSrc.logo}
        width={30}
        height={30}
        srcSet={imageSrc.logo}
        alt={imageSrc.name}
        loading="lazy"
      />
    );
  }

  // View
  return (
    <Box sx={styles.listBox}>
      <nav aria-label="games">
        { games.length > 0
            ? ( 
                <List sx={styles.listBox.list}>
                  { games.map((game, index) => (
                      <ListItem
                        key={game._id}
                        divider={index < games.length - 1}
                        sx={styles.listBox.list.listItem}>
                          <Grid
                            container
                            spacing={0}
                            sx={styles.listBox.list.listItem.container}
                          >
                            <Grid item xs={1}>
                              <Box sx={styles.listBox.list.listItem.container.awayPick}>
                                <ListItemButton
                                  onClick={ () => handleAwayPick(game) }
                                  disabled={game.gameStatus.status !== GAME_STATUS.PRE}
                                  sx={styles.listBox.list.listItem.container.awayPick.btn}>
                                  <ListItemIcon>
                                    {
                                      isPicked(game.awayTeam)
                                      ? <CheckCircleIcon sx={{ fontSize: 30, color: 'green' }} />
                                      : <RadioButtonUncheckedIcon sx={{ fontSize: 30 }} />
                                    }
                                  </ListItemIcon>
                                </ListItemButton>
                              </Box>
                            </Grid>
                            <Grid item xs={1}>
                              <Box sx={styles.listBox.list.listItem.container.awayLogo}>
                                { LogoImage(game.awayTeam) }
                              </Box>
                            </Grid>
                            <Grid item xs={2}>
                              <Box sx={styles.listBox.list.listItem.container.awayInfo}>
                                <Box sx={styles.listBox.list.listItem.container.awayInfo.name}>
                                  {game.awayTeam.abbreviation}
                                </Box>
                                <Box sx={styles.listBox.list.listItem.container.awayInfo.record}>
                                  {game.awayTeam.record}
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={3}>
                              <Box sx={styles.listBox.list.listItem.container.odds}>
                                <Box sx={{
                                  mt: -1,
                                  borderRadius: '8px',
                                  color: '#FFFFFF',
                                  background: game.odds.favourite.home
                                    ? `#${game.homeTeam.color}`
                                    : `#${game.awayTeam.color}`,
                                  padding: '6px'
                                }}>
                                  { 
                                    game.odds.favourite.home
                                      ? <ArrowForwardIcon
                                          sx={{ fontSize: 32, marginLeft: -0.5, marginBottom: -1 }} />
                                      : <ArrowBackIcon
                                          sx={{ fontSize: 32, marginLeft: -0.5, marginBottom: -1 }} />
                                  }
                                  <Box>
                                    {Math.abs(game.odds.spread)}
                                  </Box>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={1}>
                              <Box sx={styles.listBox.list.listItem.container.homeLogo}>
                                { LogoImage(game.homeTeam) }
                              </Box>
                            </Grid>
                            <Grid item xs={2}>
                              <Box sx={styles.listBox.list.listItem.container.homeInfo}>
                                <Box sx={styles.listBox.list.listItem.container.homeInfo.name}>
                                  {game.homeTeam.abbreviation}
                                </Box>
                                <Box sx={styles.listBox.list.listItem.container.homeInfo.record}>
                                  {game.homeTeam.record}
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={1}>
                              <Box sx={styles.listBox.list.listItem.container.homePick}>
                                <ListItemButton
                                  onClick={ () => handleHomePick(game) }
                                  disabled={game.gameStatus.status !== GAME_STATUS.PRE}
                                  sx={styles.listBox.list.listItem.container.homePick.btn}
                                >
                                  <ListItemIcon>
                                    {
                                      isPicked(game.homeTeam) === true
                                        ? <CheckCircleIcon sx={{ fontSize: 30, marginLeft: '-6px', color: 'green' }} />
                                        : <RadioButtonUncheckedIcon sx={{ fontSize: 30, marginLeft: '-6px' }} />
                                    }
                                  </ListItemIcon>
                                </ListItemButton>
                              </Box>
                            </Grid>
                          </Grid>
                      </ListItem>
                  )) }
              </List>
            )
          : <div>No Teams found.</div>
        }
      </nav>
    </Box>
  );
};
