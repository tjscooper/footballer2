import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { TeamsCollection } from '../db/teams';

import { TeamsList } from './TeamsList';

export const Teams = () => {

  // References
  const navigate = useNavigate();

  // Authenticated Route
  // Force login if no meteor token is found
  if (!localStorage.getItem('Meteor.loginToken')) {
    navigateTo('sign-in');
  }

  // Data
  const { teams, isLoading } = useTracker(() => {
    const handler = Meteor.subscribe('teams');
    if (!handler.ready()) {
      return { teams: null, isLoading: true };
    }
    const teams = TeamsCollection.find({}).fetch();
    return { teams, isLoading: false };
  });
  
  // Menu
  const [isBottomOpen, setIsBottomOpen] = useState(false);
  
  // Methods
  const toggleBottomNav = () => setIsBottomOpen(!isBottomOpen);

  const navigateTo = (pageName) => navigate(`/${pageName}`);  
  
  // Styles
  const styles = {
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      primary: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#FFFFFF',
        minWidth: '310px'
      }
    }
  }

  // View
  return (
    <Grid container>
      <Grid mobile={6} tablet={4} laptop={3}>
        
      {/* <Header> */}
        <Box sx={styles.header}>
          {/* Title */}
          <Typography sx={styles.header.primary}>
            Teams
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
      {/* </Header> */}
        
        {/* Options */}
        {/* TODO Filter component */}

        {/* List */}
        <TeamsList teams={teams} isLoading={isLoading} />
        
        {/* Menu (Hidden Drawer) */}
        <Drawer
          anchor={'bottom'}
          open={isBottomOpen}
          onClose={() => toggleBottomNav()}>
            <p><Button onClick={ () => navigateTo('') }>Home</Button></p>
        </Drawer>
      </Grid>
    </Grid>
  );
};
