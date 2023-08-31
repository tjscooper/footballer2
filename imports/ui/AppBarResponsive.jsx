import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Drawer } from '@mui/material';
import { SportsFootballOutlined } from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';

export const AppBarResponsive = (props) => {

  // References
  const navigate = useNavigate();

  // Routing
  const navigateTo = (pageName) => navigate(`/${pageName}`);

  // State
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [primaryNavOpen, setPrimaryNavOpen] = useState(false);

  // Methods
  const handleSignOut = () => { 
    // Close user navigation
    handleCloseUserNav();
    Meteor.logout((err) => {
      if (err) {
        console.error(err);
      }
      navigateTo('sign-in');
    });
  };

  const handleOpenUserNav = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserNav = () => {
    setAnchorElUser(null);
  };

  const togglePrimaryNav = () => setPrimaryNavOpen(!primaryNavOpen);

  return (
    <>
      <AppBar position="static" sx={{ background: '#27272f', color: '#FFFFFF' }}>
        <Container maxWidth="sm">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={togglePrimaryNav}
                color="inherit"
              >
                <SportsFootballOutlined />
              </IconButton>
            </Box>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              FOOTBALLER
            </Typography>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserNav} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserNav}
              >
                <MenuItem key={'sign-out'} onClick={ () => handleSignOut() }>
                  <Typography textAlign="center">Sign Out</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* <Menu> (Hidden Drawer) */}
        <Drawer
        sx={{ width: '90vw' }}
        anchor={'left'}
        open={primaryNavOpen}
        onClose={() => togglePrimaryNav()}>
          <p><Button onClick={ () => navigateTo('sign-up') }>Sign Up</Button></p>
          <p><Button onClick={ () => navigateTo('sign-in') }>Sign In</Button></p>
          <p><Button onClick={ () => signOut() }>Sign Out</Button></p>
          <p><Button onClick={ () => navigateTo('settings') }>Settings</Button></p>
          <p><Button onClick={ () => navigateTo('picks') }>Picks</Button></p>
          <p><Button onClick={ () => navigateTo('teams') }>Teams</Button></p>
      </Drawer>
    </>
  );
}