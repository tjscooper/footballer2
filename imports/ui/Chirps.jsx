import React, { useState } from 'react';

import { Box, TextField, Button, Grid } from '@mui/material';
import { CircularProgress } from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useTracker } from 'meteor/react-meteor-data';

import { ChirpsCollection } from '../db/chirps';

import { ChirpsList } from './ChirpsList';

/*
  Chirps - Description

  each chirp has a username, userId, channel, and message

  user can delete their own messages

  message status - draft, active, removed

  home page is subscribed
  
*/

export const Chirps = (props) => {

  // Data
  const { toggleChirpsPanel } = props;
  const { chirps, isLoading } = useTracker(() => {
    
    // Hydrate chirps
    const chirpsHandler = Meteor.subscribe('chirps');

    if (!chirpsHandler.ready()) {
      return { chirps: null, isLoading: true };
    }

    const chirps = ChirpsCollection
      .find({})
      .fetch();
    
    // Return data
    return { chirps, isLoading: false };
  });

  // State
  const [chirpText, setChirpText] = useState('');

  // Methods
  const handleChirpDelete = (_id) => {
    if (!_id) {
      return null;
    }
    Meteor.call('chirps.removeChirp', _id, (err) => {
      if (err) {
        console.error({err});
        return;
      }
      setChirpText('');
    });
  }

  const handleCloseButton = () => {
    toggleChirpsPanel();
  }

  const onChirpTextInput = (e) => setChirpText(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const chirpObj = {
      _chirp: data.get('chirp'),
      _chirpedAt: null,
      _createdAt: Date.now()
    };
   
    Meteor.call('chirps.addChirp', chirpObj, (err) => {
      if (err) {
        console.error({err});
        return;
      }
      setChirpText('');
    });
  };
  
  // Styles
  const highlightRegions = false;
  const styles = {
    chirpsLoading: {
      border: highlightRegions ? '1px solid blue' : 'none',
      display: 'flex',
      paddingTop: '300px',
      justifyContent: 'center',
      alignContent: 'center',
      height: '90vh',
      background: '#333333'
    },
    chirps: {
      border: highlightRegions ? '1px solid green' : 'none',
      display: 'flex',
      flexDirection: 'column',
      background: '#333333',
      marginTop: '12px',
      height: '98vh',
      width: '70vw',
      chirpList: {
        border: highlightRegions ? '1px solid red' : 'none',
        height: '84vh',
        overflowY: 'scroll',
        overflowX: 'hidden'
      },
      chirpForm: {
        border: highlightRegions ? '1px solid red' : 'none',
        height: '16vh',
        textAlign: 'right',
        color: '#FFFFFF',
      },
      cancelBtn: {
        marginRight: '8px',
        height: '48px',
        color: '#FFFFFF',
        background: '#000000',
        borderRadius: '16px',
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'monospace',
      },
      chirpBtn: {
        marginRight: '-8px',
        height: '48px',
        color: '#FFFFFF',
        background: '#f34cc5',
        borderRadius: '16px',
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'monospace',
      }
    },
  }

  // View
  if (isLoading) {
    return (
      <Box sx={styles.chirpsLoading}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Grid container>
      <Grid mobile={6} tablet={4} laptop={3}>
        {/* <List> */}
        <Box sx={styles.chirps}>
          <Box sx={styles.chirps.chirpList}>
            <ChirpsList
              chirps={chirps}
              handleChirpDelete={handleChirpDelete}
              isLoading={isLoading} />
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={ styles.chirps.chirpForm }>
              <TextField
                margin="normal"
                required
                fullWidth
                onInput={onChirpTextInput}
                value={chirpText}
                id="chirp"
                name="chirp"
                autoFocus
                sx={{
                  width: '70vw',
                  background: '#999999',
                  border: '4px solid #d0ff12',
                  color: '#FFFFFF',
                  maxWidth: '320px'
                }}
              />
              <Button
                variant="contained"
                onClick={ () => handleCloseButton() }
                sx={styles.chirps.cancelBtn}
                startIcon={<ArrowBackIcon />}>
                  Close
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={styles.chirps.chirpBtn}
                endIcon={<CampaignIcon />}>
                  Send
              </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
