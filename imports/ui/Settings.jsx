import React, { useState } from 'react';
import { 
  Grid,
  Button,
  Drawer
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

export const Settings = () => {
  
  // References
  const navigate = useNavigate();

  // State
  const [isBottomOpen, setIsBottomOpen] = useState(false);
  
  // Methods
  const toggleBottomNav = () => setIsBottomOpen(!isBottomOpen);

  const navigateTo = (pageName) => navigate(`/${pageName}`);
  
  // View
  return (
    <Grid container>
      <Grid mobile={6} tablet={4} laptop={3}>
        <h1>Settings</h1>
        <Button onClick={() => toggleBottomNav()}>Menu B</Button>
        
        {/* Navigation */}
        <Drawer
          anchor={'bottom'}
          open={isBottomOpen}
          onClose={() => toggleBottomNav()}>
            <p><Button onClick={ () => navigateTo('') }>Home</Button></p>
            <p><Button onClick={ () => navigateTo('sign-up') }>Sign Up</Button></p>
            <p><Button onClick={ () => navigateTo('sign-in') }>Sign In</Button></p>
            <p><Button onClick={ () => signOut() }>Sign Out</Button></p>
            <p><Button onClick={ () => navigateTo('picks') }>Picks</Button></p>
        </Drawer>
      </Grid>
    </Grid>
  );
};
