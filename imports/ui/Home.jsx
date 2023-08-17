import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { 
  Grid,
  Button,
  Drawer
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

export const Home = () => {

  // References
  const navigate = useNavigate();
  
  // Menu
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  
  // Methods
  const toggleLeftNav = () => setIsLeftOpen(!isLeftOpen);
  
  const navigateTo = (pageName) => navigate(`/${pageName}`);

  const getCurrentUserId = () => Meteor.userId();
  
  const currentUser = useTracker(() => {
    const _id = getCurrentUserId();
    return Meteor.users.find({ _id }).fetch()[0];
  });

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

  // View
  if (!currentUser) {
    // TODO Replace with MUI skeleton
    return null;
    navigateTo('sign-in');
  }

  return (
    <Grid container>
      <Grid mobile={6} tablet={4} laptop={3}>
        {/* View */}
        <h1>Welcome, { currentUser.username }!</h1>
        <Button onClick={() => toggleLeftNav()}>Menu</Button>
      </Grid>
      {/* Left Navigation */}
      <Drawer
          anchor={'left'}
          open={isLeftOpen}
          onClose={() => toggleLeftNav()}>
            <p><Button onClick={ () => navigateTo('sign-up') }>Sign Up</Button></p>
            <p><Button onClick={ () => navigateTo('sign-in') }>Sign In</Button></p>
            <p><Button onClick={ () => signOut() }>Sign Out</Button></p>
            <p><Button onClick={ () => navigateTo('settings') }>Settings</Button></p>
            <p><Button onClick={ () => navigateTo('picks') }>Picks</Button></p>
        </Drawer>
    </Grid>

  );
};
