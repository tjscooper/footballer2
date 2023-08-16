import React, { useState } from 'react';
import { 
  Grid,
  Button,
  Drawer
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

export const Home = () => {

  const navigate = useNavigate();
  
  // Menu
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  // const [isBottomOpen, setIsBottomOpen] = useState(false);
  // const [isRightOpen, setIsRightOpen] = useState(false);
  // const [isTopOpen, setIsTopOpen] = useState(false);

  // Methods
  const toggleLeftNav = () => setIsLeftOpen(!isLeftOpen);
  
  const navigateTo = (pageName) => navigate(`/${pageName}`);

  return (
    <Grid container>
      <Grid mobile={6} tablet={4} laptop={3}>
        {/* Left */}
        <Drawer
          anchor={'left'}
          open={isLeftOpen}
          onClose={() => toggleLeftNav()}>
            <p><Button onClick={ () => navigateTo('picks') }>Picks</Button></p>
            <p>Blah Blah Blah Blah Blah Blah Blah</p>
            <p>Blah Blah Blah Blah Blah Blah Blah</p>
            <p>Blah Blah Blah Blah Blah Blah Blah</p>
            <p>Blah Blah Blah Blah Blah Blah Blah</p>
            <p>Blah Blah Blah Blah Blah Blah Blah</p>
        </Drawer>
        <Button onClick={() => toggleLeftNav()}>Menu</Button>

        {/* <Button onClick={() => toggleBottomNav()}>Menu B</Button>
        <Drawer
          anchor={'bottom'}
          open={isBottomOpen}
          onClose={() => toggleBottomNav()}
        >
          Blah Blah
        </Drawer>

        <Button onClick={() => toggleRightNav()}>Menu R</Button>
        <Drawer
          anchor={'right'}
          open={isRightOpen}
          onClose={() => toggleRightNav()}
        >
          Blah Blah
        </Drawer>

        <Button onClick={() => toggleTopNav()}>Menu T</Button>
        <Drawer
          anchor={'top'}
          open={isTopOpen}
          onClose={() => toggleTopNav()}
        >
          Blah Blah
        </Drawer> */}
      </Grid>
    </Grid>
  );
};
