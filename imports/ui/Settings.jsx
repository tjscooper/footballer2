import React, { useState } from 'react';
import { 
  Grid,
  Button,
  Drawer
} from '@material-ui/core';

export const Settings = () => {
  
  // Menu
  const [isBottomOpen, setIsBottomOpen] = useState(false);
  
  // Methods
  const toggleBottomNav = () => setIsBottomOpen(!isBottomOpen);
  
  // View
  return (
    <Grid container>
      <Grid mobile={6} tablet={4} laptop={3}>
        <Button onClick={() => toggleBottomNav()}>Menu B</Button>
        
        {/* Navigation */}
        <Drawer
          anchor={'bottom'}
          open={isBottomOpen}
          onClose={() => toggleBottomNav()}>
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
