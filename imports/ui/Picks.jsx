import React, { useState } from 'react';
import { 
  Grid,
  Button,
  Drawer
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

export const Picks = () => {

  // References
  const navigate = useNavigate();
  
  // Menu
  const [isBottomOpen, setIsBottomOpen] = useState(false);
  
  // Methods
  const toggleBottomNav = () => setIsBottomOpen(!isBottomOpen);

  const navigateTo = (pageName) => navigate(`/${pageName}`);  
  
  // View
  return (
    <Grid container>
      <Grid mobile={6} tablet={4} laptop={3}>
        <h1>Picks</h1>
        <Button onClick={() => toggleBottomNav()}>Menu B</Button>
        
        {/* Navigation */}
        <Drawer
          anchor={'bottom'}
          open={isBottomOpen}
          onClose={() => toggleBottomNav()}>
            <p><Button onClick={ () => navigateTo('') }>Home</Button></p>
            <p>Blah Blah Blah Blah Blah Blah Blah</p>
            <p>Blah Blah Blah Blah Blah Blah Blah</p>
            <p>Blah Blah Blah Blah Blah Blah Blah</p>
            <p>Blah Blah Blah Blah Blah Blah Blah</p>
            <p>Blah Blah Blah Blah Blah Blah Blah</p>
        </Drawer>
      </Grid>
    </Grid>
  );
};
