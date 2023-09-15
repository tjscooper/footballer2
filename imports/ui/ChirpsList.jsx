import React, { useState, useRef, useEffect} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import CampaignIcon from '@mui/icons-material/Campaign';

import { CHIRP_STATUS, GAME_STATUS } from '../model/entities';

import dayjs from 'dayjs';

export const ChirpsList = (props) => {

  // Data
  const { chirps, handleChirpDelete, toggleChirpsPanel, isLoading } = props;
  
  // Side Effect (new chirp is added to DB)
  useEffect(() => {
    if (chirps.length) {
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [chirps.length]);

  // State
  const [currentUsername, setCurrentUsername] = useState(Meteor.user().username);

  // References
  const ref = useRef(null);
  
  // Methods
  const getChirpOwner = (username) => {
    if (!currentUsername) {
      return 'chirpLeft';
    }
    
    return currentUsername === username
      ? 'chirpRight'
      : 'chirpLeft';
  }

  // Styles
  const highlightRegions = false;
  const styles = {
    box: {
      bgcolor: '#333333',
      borderRadius: '16px',
    },
    icons: {
      size: 24,
    },
    noGamesBox: {
      border: highlightRegions ? '1px solid blue' : 'none',
      display: 'flex',
      paddingTop: '300px',
      justifyContent: 'center',
      alignContent: 'center',
      height: '90vh',
      background: '#333333',
      color: '#f34cc5'
    },
    chirps: {
      display: 'flex',
      flexDirection: 'column',
      list: {
        border: highlightRegions ? '1px solid purple' : 'none',
        minHeight: '80vh',
        username: {
          border: highlightRegions ? '1px solid green' : 'none',
          fontSize: '12px',
          color: '#FFFFFF',
          marginTop: '-24px',
          marginLeft: '-8px',
          height: '16px'
        },
        text: {
          border: highlightRegions ? '1px solid green' : 'none',
          marginTop: '8px',
          marginBottom: '8px',
        },
        delete: {
          border: highlightRegions ? '1px solid green' : 'none',
          minWidth: '18px',
          maxWidth: '18px',
          marginTop: '-30px',
          marginLeft: '47vw',
          btn: {
            minWidth: '18px !important',
            maxWidth: '18px !important',
            paddingLeft: '16px',
            textAlign: 'center',
            marginLeft: 'auto',
            borderRadius: '18px',
            width: '18px',
            height: '18px',
            color: '#FFFFFF',
            border: 'none'
          }
        },
        createdAt: {
          border: highlightRegions ? '1px solid green' : 'none',
          fontSize: '8px',
          color: '#666666',
          height: '12px',
          textAlign: 'right',
        },
        chirpRight: {
          border: highlightRegions ? '1px solid yellow' : 'none',
          display: 'flex',
          flexDirection: 'column',
          width: '50vw',
          background: '#FFFFFF',
          borderTopLeftRadius: '16px',
          borderBottomRightRadius: '16px',
          borderBottomLeftRadius: '16px',
          padding: '8px',
          margin: '8px',
          marginTop: '26px',
          marginLeft: 'auto'
        },
        chirpLeft: {
          border: highlightRegions ? '1px solid orange' : 'none',
          display: 'flex',
          flexDirection: 'column',
          width: '50vw',
          background: '#999999',
          borderTopRightRadius: '16px',
          borderBottomRightRadius: '16px',
          borderBottomLeftRadius: '16px',
          padding: '8px',
          margin: '8px',
          marginTop: '26px',
          marginRight: 'auto'
        }, 
      },
      headerText: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        border: highlightRegions ? '1px solid yellow' : 'none',
        color: '#000000',
        width: '68vw',
        textAlign: 'center',
        fontSize: '14px',
        background: '#d0ff12',
        marginBottom: '48px'
      }
    }
  };
  
  // View
  if (!chirps) {
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
      No chirps to show
    </Box>
  }

  if (!currentUsername) {
    setCurrentUsername(Meteor.user().username);
  }

  // View
  return (
    <Box sx={styles.chirps}>
      <nav aria-label="chirps">
        { chirps.length > 0
            ? ( 
                <Box sx={styles.chirps.list}>
                  <Box sx={styles.chirps.headerText}>
                    <span style={{ marginTop: '4px', marginRight: '4px' }}>Last 25 </span><CampaignIcon sx={{ fontSize: 24 }} />
                  </Box>
                  { chirps.filter((c) => {
                      if (c.status !== CHIRP_STATUS.DELETED) {
                        return c;
                      }
                    }).map((chirp, index) => {
                      return (
                        <Box
                          key={index}
                          sx={ styles.chirps.list[getChirpOwner(chirp.username)] }>
                          {
                            currentUsername !== chirp.username
                              && <Box sx={ styles.chirps.list.username }>
                                   {chirp.username}
                                 </Box>
                          }
                          {
                            currentUsername === chirp.username
                              && <Box sx={ styles.chirps.list.delete }>
                                   <Button
                                     sx={styles.chirps.list.delete.btn}
                                     startIcon={<ClearIcon />}
                                     onClick={ () => handleChirpDelete(chirp._id) } />
                                  </Box>
                          }
                          <Box sx={ styles.chirps.list.text }>
                            {chirp.chirp}
                          </Box>
                          <Box sx={ styles.chirps.list.createdAt }>
                            { dayjs(chirp.createdAt).format('h:mm a - MM/DD/YY') }
                          </Box> 
                        </Box>
                      )
                    })
                  }
                  <div ref={ref}/>
              </Box>
            )
          : (
              <Box sx={styles.noGamesBox}>
                No Chirps Yet
              </Box>
            )
        }
      </nav>
    </Box>
  );
};
