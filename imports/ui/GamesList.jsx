import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import CircleIcon from '@mui/icons-material/Circle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import TextureRoundedIcon from '@mui/icons-material/TextureRounded';
import HomeIcon from '@mui/icons-material/Home';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { GAME_STATUS } from '../model/entities';

export const GamesList = (props) => {

  // References
  const navigate = useNavigate();

  // Routing
  const navigateTo = (pageName) => navigate(`/${pageName}`);

  // Data
  const { games, teams, leaderboard, showActiveFilterToggle } = props;
  
  // Methods

  const getUsername = () => {
    const { username } = Meteor.user();
    return !username ? null : username;
  }

  const isHomePossession = (homeTeam, situation) => {
    if (!situation) {
      return false;
    }
    return homeTeam.id === situation.possession;
  }

  const isAwayPossession = (awayTeam, situation) => {
    if (!situation) {
      return false;
    }
    return awayTeam.id === situation.possession;
  }

  const isHomeRedZone = (homeTeam, situation) => {
    if (!situation) {
      return false;
    }
    return homeTeam.id === situation.possession
      && situation.isRedZone;
  }
  
  const isAwayRedZone = (awayTeam, situation) => {
    if (!situation) {
      return false;
    }
    return awayTeam.id === situation.possession
      && situation.isRedZone;
  }

  const isPreGame = (status) => {
    return status === GAME_STATUS.PRE;
  }

  const isInProgressGame = (status) => {
    return status === GAME_STATUS.IN_PROGRESS;
  }

  const isPostGame = (status) => {
    return status === GAME_STATUS.POST;
  }

  const isFav = (homeAway, gameId) => {
    if (!leaderboard) {
      return false;
    }
    const game = leaderboard.meta[gameId];
    return homeAway === 'home'
      ? game.fav === 'home'
      : game.fav === 'away';
  }
 
  const isPickWinning = (teamId, { gameId }) => {
    const game = leaderboard.meta[gameId];
    const winning = teamId === game.winningTeam.id;
    return winning;
  }

  const isPick = (homeAway, { gameId }) => {
    const game = leaderboard.meta[gameId];
    const picks = homeAway === 'home'
      ? game.homeTeam.picks
      : game.awayTeam.picks;

    const username = getUsername();
    const isFound = picks.filter(pick => pick.username === username).length ? true : false;
    return isFound;
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'STATUS_SCHEDULED' : return '';
      case 'STATUS_FINAL' : return 'Final';
      default : return status;
    }
  }

  const getStatusDate = (date) => {
    const statusDate = dayjs(date).format('ddd');
    return statusDate;
  }

  const getStatusTime = (date) => {
    const statusTime = dayjs(date).format('h:mm A');
    return statusTime;
  }

  const getTeamRecord = (competitorId) => {
    if (!competitorId || !teams) {
      return null;
    }
    return teams.find(t => t.competitorId === competitorId).record;
  }

  // Styles
  const highlightRegions = false;
  const styles = {
    box: {
      bgcolor: '#FFFFFF',
      borderRadius: '16px',
    },
    icons: {
      star: {
        isPick: {
          border: '1px solid green'
        }
      },
      size: 24,
    },
    listBox: {
      marginTop: '8px',
      bgcolor: '#FFFFFF',
      borderRadius: '16px',
      list: {
        listItemHeader: {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: '30px',
          background: '#e4e4e4',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          marginTop: '-8px'
        },
        listItem: {
          height: '120px',
          container: {
            border: highlightRegions ? '1px solid blue' : 'none',
            display: 'flex',
            flexDirection: 'flex-start',
            alignContent: 'top',
            headerGap: {
              width: '40vw',
              height: '40vh'
            },
            gameContainer: {
              border: highlightRegions ? '1px solid orange' : 'none',
              display: 'flex',
              flexDirection: 'column',
              cardHeader: {
                border: highlightRegions ? '1px solid blue' : 'none',
                height: '20px',
              },
              card: {
                border: highlightRegions ? '1px solid red' : 'none',
                display: 'flex',
                flexDirection: 'row',
                minWidth: '25vw',
                info: {
                  border: highlightRegions ? '1px solid green' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignSelf: 'flex-start',
                  padding: '4px',
                  logo: {
                    border: highlightRegions ? '1px solid orange' : 'none',
                  },
                  name: {
                    border: highlightRegions ? '1px solid orange' : 'none',
                    fontWeight: 'bold',
                    fontSize: '18px',
                  },
                  record: {
                    border: highlightRegions ? '1px solid orange' : 'none',
                    fontWeight: 'light',
                    fontSize: '12px',
                    color: '#333333',
                  }
                },
                score: {
                  border: highlightRegions ? '1px solid purple' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  paddingTop: '12px',
                  paddingLeft: '12px',
                  fontSize: '36px',
                  textAlign: 'right',
                  minWidth: '10vw'
                }
              },
              state: {
                border: highlightRegions ? '1px solid blue' : 'none',
                display: 'flex',
                flexDirection: 'row',
                width: '10vw',
                possession: {
                  color: 'brown'
                },
                redZone: {
                  icon: {
                    color: 'red'
                  },
                  iconHidden: {
                    color: 'white'
                  }
                },
                fav: {
                  icon: {
                    color: 'pink'
                  },
                  iconHidden: {
                    color: 'white'
                  }
                },
                picked: {
                  color: 'orange'
                }
              }
            },
            statusPre: {
              border: highlightRegions ? '1px solid blue' : 'none',
              display: 'flex',
              flexDirection: 'column',
              width: '32.5vw',
              name: {
                fontSize: '10px',
                color: '#999999',
                paddingTop: '0',
                textAlign: 'center',
                textTransform: 'uppercase'
              },
              date: {
                fontSize: '10px',
                color: '#999999',
                paddingTop: '4px',
                textAlign: 'center',
                textTransform: 'uppercase'
              }
            },
            statusInProgress: {
              border: highlightRegions ? '1px solid blue' : 'none',
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              fontSize: '16px',
              width: '34vw',
              color: '#999999',
              displayClock: {
                // TODO
              },
              situation: {
                // TODO
              },
            },
            statusPost: {
              border: highlightRegions ? '1px solid blue' : 'none',
              display: 'flex',
              flexDirection: 'column',
              width: '34vw',
              name: {
                fontSize: '10px',
                color: '#999999',
                paddingTop: '18px',
                textAlign: 'center',
                textTransform: 'uppercase'
              }
            }
          },
        }
      }
    }
  };
  
  // View
  if (!games) {
    return <Box sx={{
      background: '#FFFFFF',
      color: '#000000',
      borderRadius: '16px',
      textAlign: 'center',
      padding: '16px',
      alignContent: 'center',
      justifyContent: 'center',
      textTransform: 'uppercase',
      fontSize: '16px'
    }}>
      No games to show
    </Box>
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
                  <ListItem sx={styles.listBox.list.listItemHeader}>
                    <Grid sx={styles.listBox.list.listItem.container.gameContainer}>
                      <Grid item sx={styles.listBox.list.listItem.container.gameContainer.cardHeader}>
                        <AirplanemodeActiveIcon sx={{ fontSize: 18, color: '#999999' }} />
                      </Grid>
                    </Grid>
                    <Grid item xs={3}>
                      <Box sx={styles.listBox.list.listItem.container.headerGap}>
                      </Box>
                    </Grid>

                    <Grid sx={styles.listBox.list.listItem.container.gameContainer}>
                      <Grid item sx={styles.listBox.list.listItem.container.gameContainer.cardHeader}>
                        <HomeIcon sx={{ fontSize: 18, color: '#999999' }} />
                      </Grid>
                    </Grid>
                  </ListItem>
                  { games.filter((g) => {
                          if (!showActiveFilterToggle) {
                            return g;
                          } else if (showActiveFilterToggle) {
                            if (g.gameStatus.status === GAME_STATUS.IN_PROGRESS) {
                              return g;
                            }
                          }
                        }).map((game, index) => {
                          return (
                            <ListItem
                              divider={index < games.length - 1}
                              key={game._id}
                              sx={styles.listBox.list.listItem}>
                                <Grid
                                  sx={styles.listBox.list.listItem.container.gameContainer}>
                                  <Grid item sx={styles.listBox.list.listItem.container.gameContainer.card}>
                                    <Box sx={styles.listBox.list.listItem.container.gameContainer.card.info}>
                                      <Box sx={styles.listBox.list.listItem.container.gameContainer.card.info.logo}>
                                        { LogoImage(game.awayTeam) }
                                      </Box>
                                      <Box sx={styles.listBox.list.listItem.container.gameContainer.card.info.name}>
                                        {game.awayTeam.abbreviation}
                                      </Box>
                                      {
                                        !isInProgressGame(game.gameStatus.status)
                                          && <Box sx={styles.listBox.list.listItem.container.gameContainer.card.info.record}>
                                              {getTeamRecord(game.awayTeam.id)}
                                            </Box>
                                      } 
                                    </Box>
                                    <Box sx={styles.listBox.list.listItem.container.gameContainer.card.score}>
                                      {game.awayTeam.score}
                                    </Box>
                                  </Grid>
                                  <Grid item sx={styles.listBox.list.listItem.container.gameContainer.state}>
                                    {
                                      game.gameStatus.status !== GAME_STATUS.PRE
                                        ? <Box sx={styles.listBox.list.listItem.container.gameContainer.state.picked}>
                                            <PopupState variant="popover" popupId="away-team-picks">
                                              {(popupStateAway) => (
                                                <React.Fragment>
                                                    {
                                                      isPickWinning(game.awayTeam.id, game, leaderboard.meta[game.gameId].winningTeam)
                                                        ? isPick('away', game)
                                                            ? <StarIcon sx={{ fontSize: styles.icons.size, border: '2px dashed green', borderRadius: '24px', padding: '3px', margin: '-3px' }} {...bindTrigger(popupStateAway)}/>
                                                            : <StarIcon sx={{ fontSize: styles.icons.size }} {...bindTrigger(popupStateAway)}/>
                                                        : isPick('away', game)
                                                            ? <StarOutlineIcon sx={{ fontSize: styles.icons.size, border: '2px dashed green', borderRadius: '24px', padding: '3px', margin: '-3px' }} {...bindTrigger(popupStateAway)}/>
                                                            : <StarOutlineIcon sx={{ fontSize: styles.icons.size }} {...bindTrigger(popupStateAway)}/>
                                                    }
                                                    {
                                                      game.gameStatus.status !== GAME_STATUS.PRE
                                                        && <Menu
                                                              disableAutoFocusItem={true}
                                                              variant='menu'
                                                              sx={{
                                                                maxHeight: 96 * 4.5,
                                                                width: '20ch',
                                                              }}
                                                              { ...bindMenu(popupStateAway) }
                                                              anchorOrigin={{
                                                                vertical: 'bottom',
                                                                horizontal: 0,
                                                              }}
                                                              transformOrigin={{
                                                                vertical: 'bottom',
                                                                horizontal: 'left',
                                                              }}>
                                                              {
                                                                leaderboard.meta[game.gameId].awayTeam.picks.map((pick) => {
                                                                  return (
                                                                    <MenuItem
                                                                      key={pick.username}
                                                                      sx={{ background: '#27272f', border: '1px solid #CCCCCC', color: '#FFFFFF', fontSize: '16px', borderRadius: '4px', margin: '3px' }}
                                                                      dense
                                                                      onClick={popupStateAway.close}>
                                                                      { pick.username }
                                                                    </MenuItem>
                                                                  )
                                                                })
                                                              }
                                                          </Menu>
                                                      }
                                                </React.Fragment>
                                              )}
                                            </PopupState>
                                          </Box>
                                        : <Box sx={styles.listBox.list.listItem.container.gameContainer.state.redZone}>
                                            <CircleIcon sx={styles.listBox.list.listItem.container.gameContainer.state.redZone.iconHidden} />
                                          </Box>
                                    }
                                    {
                                      isAwayPossession(game.awayTeam, game.gameStatus.situation)
                                        ? <Box sx={styles.listBox.list.listItem.container.gameContainer.state.possession}>
                                            <SportsFootballIcon sx={{ fontSize: styles.icons.size }} />
                                          </Box>
                                        : <Box sx={styles.listBox.list.listItem.container.gameContainer.state.redZone}>
                                            <CircleIcon sx={styles.listBox.list.listItem.container.gameContainer.state.redZone.iconHidden} />
                                          </Box>
                                    }
                                    {
                                      isAwayRedZone(game.awayTeam, game.gameStatus.situation)
                                        ? <Box sx={styles.listBox.list.listItem.container.gameContainer.state.redZone}>
                                            <TextureRoundedIcon sx={styles.listBox.list.listItem.container.gameContainer.state.redZone.icon} />
                                          </Box>
                                        : <Box sx={styles.listBox.list.listItem.container.gameContainer.state.redZone}>
                                            <CircleIcon sx={styles.listBox.list.listItem.container.gameContainer.state.redZone.iconHidden} />
                                          </Box>
                                    }
                                    {
                                      <Box sx={styles.listBox.list.listItem.container.gameContainer.state.picked}>
                                        <PopupState variant="popover" popupId="away-team-fav">
                                          {(popupStateAwayFav) => (
                                            <React.Fragment>
                                              {
                                                isFav('away', game.gameId)
                                                  ? <Box sx={styles.listBox.list.listItem.container.gameContainer.state.redZone}>
                                                      <FavoriteIcon sx={styles.listBox.list.listItem.container.gameContainer.state.fav.icon} {...bindTrigger(popupStateAwayFav)}/>
                                                    </Box>
                                                  : <Box sx={styles.listBox.list.listItem.container.gameContainer.state.redZone}>
                                                      <CircleIcon sx={styles.listBox.list.listItem.container.gameContainer.state.redZone.iconHidden} />
                                                    </Box>
                                              }
                                              {
                                              <Menu
                                                  disableAutoFocusItem={true}
                                                  variant='menu'
                                                  sx={{
                                                    maxHeight: 96 * 4.5,
                                                    width: '20ch',
                                                  }}
                                                  { ...bindMenu(popupStateAwayFav) }
                                                  anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 0,
                                                  }}
                                                  transformOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 0,
                                                  }}>
                                                    <MenuItem
                                                      key={game.gameId}
                                                      sx={{ background: '#27272f', border: '1px solid #CCCCCC', color: '#FFFFFF', fontSize: '16px', borderRadius: '4px', margin: '3px' }}
                                                      dense
                                                      onClick={popupStateAwayFav.close}>
                                                      { Math.abs(leaderboard.meta[game.gameId].spread) }
                                                    </MenuItem>
                                              </Menu>
                                              }
                                            </React.Fragment>
                                          )}
                                        </PopupState>
                                      </Box>
                                    }
                                  </Grid>
                                </Grid>
                                {
                                  // Pregame
                                  isPreGame(game.gameStatus.status)
                                    && <Grid item xs={3}>
                                          <Box sx={styles.listBox.list.listItem.container.statusPre}>
                                            <Box sx={styles.listBox.list.listItem.container.statusPre.name}>
                                              <Typography>{game.gameStatus.date}</Typography>
                                            </Box>
                                            <Box sx={styles.listBox.list.listItem.container.statusPre.date}>
                                              <Typography>{getStatusDate(game.clockStatus.date)}</Typography>
                                              <Typography>{getStatusTime(game.clockStatus.date)}</Typography>
                                            </Box>
                                          </Box>
                                      </Grid>
                                }
                                {
                                  // Game In Progress
                                  isInProgressGame(game.gameStatus.status)
                                    && <Grid item xs={3} sx={styles.listBox.list.listItem.container.statusInProgress}>
                                          <Box sx={styles.listBox.list.listItem.container.statusInProgress.displayClock}>
                                            <Typography>{game.gameStatus.shortDetail}</Typography>
                                          </Box>
                                          <Box sx={styles.listBox.list.listItem.container.statusInProgress.situation}>
                                            <Typography>{game.gameStatus.situation?.shortDownDistanceText}</Typography>
                                            <Typography>{game.gameStatus.situation?.possessionText}</Typography>
                                          </Box>
                                        </Grid>
                                }
                                {
                                  // Postgame
                                  isPostGame(game.gameStatus.status)
                                    && <Grid item xs={3}>
                                          <Box sx={styles.listBox.list.listItem.container.statusPost}>
                                            <Box sx={styles.listBox.list.listItem.container.statusPost.name}>
                                              <Typography>{getStatusText(game.gameStatus.name)}</Typography>
                                            </Box>
                                          </Box>
                                        </Grid>
                                }
                                <Grid
                                  sx={styles.listBox.list.listItem.container.gameContainer}>
                                  <Grid item sx={styles.listBox.list.listItem.container.gameContainer.card}>
                                    <Box sx={styles.listBox.list.listItem.container.gameContainer.card.info}>
                                      <Box sx={styles.listBox.list.listItem.container.gameContainer.card.info.logo}>
                                        { LogoImage(game.homeTeam) }
                                      </Box>
                                      <Box sx={styles.listBox.list.listItem.container.gameContainer.card.info.name}>
                                        {game.homeTeam.abbreviation}
                                      </Box>
                                      {
                                        !isInProgressGame(game.gameStatus.status)
                                          && <Box sx={styles.listBox.list.listItem.container.gameContainer.card.info.record}>
                                              {getTeamRecord(game.homeTeam.id)}
                                            </Box>
                                      } 
                                    </Box>
                                    <Box sx={styles.listBox.list.listItem.container.gameContainer.card.score}>
                                      {game.homeTeam.score}
                                    </Box>
                                  </Grid>
                                  <Grid item sx={styles.listBox.list.listItem.container.gameContainer.state}>
                                    {
                                      game.gameStatus.status !== GAME_STATUS.PRE
                                        ? <Box sx={styles.listBox.list.listItem.container.gameContainer.state.picked}>
                                            <PopupState variant="popover" popupId="home-team-picks">
                                              {(popupStateHome) => (
                                                <React.Fragment>
                                                  {
                                                      isPickWinning(game.homeTeam.id, game, leaderboard.meta[game.gameId].winningTeam)
                                                        ? isPick('home', game)
                                                            ? <StarIcon sx={{ fontSize: styles.icons.size, border: '2px dashed green', borderRadius: '24px', padding: '3px', margin: '-3px' }} {...bindTrigger(popupStateHome)}/>
                                                            : <StarIcon sx={{ fontSize: styles.icons.size }} {...bindTrigger(popupStateHome)}/>
                                                        : isPick('home', game)
                                                            ? <StarOutlineIcon sx={{ fontSize: styles.icons.size, border: '2px dashed green', borderRadius: '24px', padding: '3px', margin: '-3px' }} {...bindTrigger(popupStateHome)}/>
                                                            : <StarOutlineIcon sx={{ fontSize: styles.icons.size }} {...bindTrigger(popupStateHome)}/>
                                                    }
                                                  {
                                                      game.gameStatus.status !== GAME_STATUS.PRE
                                                        && <Menu
                                                              disableAutoFocusItem={true}
                                                              variant='menu'
                                                              sx={{
                                                                maxHeight: 96 * 4.5,
                                                                width: '20ch',
                                                              }}
                                                              { ...bindMenu(popupStateHome) }
                                                              anchorOrigin={{
                                                                vertical: 'bottom',
                                                                horizontal: 0,
                                                              }}
                                                              transformOrigin={{
                                                                vertical: 'bottom',
                                                                horizontal: 'left',
                                                              }}>
                                                              {
                                                                leaderboard.meta[game.gameId].homeTeam.picks.map((pick) => {
                                                                  return (
                                                                    <MenuItem
                                                                      key={pick.username}
                                                                      sx={{ background: '#27272f', border: '1px solid #CCCCCC', color: '#FFFFFF', fontSize: '16px', borderRadius: '4px', margin: '3px' }}
                                                                      dense
                                                                      onClick={popupStateHome.close}>
                                                                      { pick.username }
                                                                    </MenuItem>
                                                                  )
                                                                })
                                                              }
                                                            </Menu>
                                                  }
                                                </React.Fragment>
                                              )}
                                            </PopupState>
                                          </Box>
                                        : <Box sx={styles.listBox.list.listItem.container.gameContainer.state.redZone}>
                                            <CircleIcon sx={styles.listBox.list.listItem.container.gameContainer.state.redZone.iconHidden} />
                                          </Box>
                                    }
                                    {
                                      isHomePossession(game.homeTeam, game.gameStatus.situation)
                                        ? <Box sx={styles.listBox.list.listItem.container.gameContainer.state.possession}>
                                            <SportsFootballIcon sx={{ fontSize: styles.icons.size }} />
                                          </Box>
                                        : <Box sx={styles.listBox.list.listItem.container.gameContainer.state.redZone}>
                                            <CircleIcon sx={styles.listBox.list.listItem.container.gameContainer.state.redZone.iconHidden} />
                                          </Box>
                                    }
                                    {
                                      isHomeRedZone(game.homeTeam, game.gameStatus.situation)
                                        ? <Box sx={styles.listBox.list.listItem.container.gameContainer.state.redZone}>
                                            <TextureRoundedIcon sx={styles.listBox.list.listItem.container.gameContainer.state.redZone.icon} />
                                          </Box>
                                        : <Box sx={styles.listBox.list.listItem.container.gameContainer.state.redZone}>
                                            <CircleIcon sx={styles.listBox.list.listItem.container.gameContainer.state.redZone.iconHidden} />
                                          </Box>
                                    }
                                    {
                                      <Box sx={styles.listBox.list.listItem.container.gameContainer.state.picked}>
                                        <PopupState variant="popover" popupId="home-team-fav">
                                          {(popupStateHomeFav) => (
                                            <React.Fragment>
                                              {
                                                isFav('home', game.gameId)
                                                  ? <Box sx={styles.listBox.list.listItem.container.gameContainer.state.redZone}>
                                                      <FavoriteIcon sx={styles.listBox.list.listItem.container.gameContainer.state.fav.icon} {...bindTrigger(popupStateHomeFav)}/>
                                                    </Box>
                                                  : <Box sx={styles.listBox.list.listItem.container.gameContainer.state.redZone}>
                                                      <CircleIcon sx={styles.listBox.list.listItem.container.gameContainer.state.redZone.iconHidden} />
                                                    </Box>
                                              }
                                              {
                                              <Menu
                                                  disableAutoFocusItem={true}
                                                  variant='menu'
                                                  sx={{
                                                    maxHeight: 96 * 4.5,
                                                    width: '20ch',
                                                  }}
                                                  { ...bindMenu(popupStateHomeFav) }
                                                  anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 0,
                                                  }}
                                                  transformOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'left',
                                                  }}>
                                                    <MenuItem
                                                      key={game.gameId}
                                                      sx={{ background: '#27272f', border: '1px solid #CCCCCC', color: '#FFFFFF', fontSize: '16px', borderRadius: '4px', margin: '3px' }}
                                                      dense
                                                      onClick={popupStateHomeFav.close}>
                                                      { Math.abs(leaderboard.meta[game.gameId].spread) }
                                                    </MenuItem>
                                                </Menu>
                                              }
                                            </React.Fragment>
                                          )}
                                        </PopupState>
                                      </Box>
                                    }
                                  </Grid>
                                </Grid>
                            </ListItem>
                          )
                        })
                }
              </List>
            )
          : null
        }
      </nav>
    </Box>
  );
};
