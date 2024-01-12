import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Drawer } from '@mui/material';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MenuIcon from '@mui/icons-material/Menu';

import { useNavigate } from 'react-router-dom';

export const AppBarResponsive = (props) => {

  // References
  const navigate = useNavigate();

  // Routing
  const navigateTo = (pageName) => {
    setPrimaryNavOpen(false);
    navigate(`/${pageName}`);
  }

  // State
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [primaryNavOpen, setPrimaryNavOpen] = useState(false);

  // Methods
  const getUsername = () => {
    if (!Meteor.user()) {
      return '?';
    }
    const { username } = Meteor.user();
    return !username ? '?' : username.toUpperCase();
  }

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

  const stringToColor = (string) => {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
  const stringAvatar = (name, styles) => {
    if (name.split(' ').length > 1) {
      return {
        sx: { 
          ...styles,
          bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
      };
    }
    return {
      sx: { 
        ...styles,
        bgcolor: stringToColor(name),
      },
      children: `${name.slice(0,1)}`,
    };
  }

  const isAdminUser = () => {
    const username = getUsername();
    return username === 'TIMBRO' || username === 'RACH';
  }

  const togglePrimaryNav = () => setPrimaryNavOpen(!primaryNavOpen);

  return (
    <>
      <AppBar position="static" sx={{ background: '#27272f', color: '#FFFFFF', borderTopRightRadius: '16px', borderTopLeftRadius: '16px' }}>
        <Container maxWidth="sm">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={ () => togglePrimaryNav() }
                color="inherit"
              >
                <MenuIcon />
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
              <Tooltip title="Open User Options">
                <IconButton onClick={handleOpenUserNav} sx={{ p: 0 }}>
                  <Avatar {...stringAvatar(getUsername(), { borderRadius: '12px', marginRight: '-8px' })} />
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
        anchor={'left'}
        open={primaryNavOpen}
        onClose={() => togglePrimaryNav()}>
        <List
          sx={{ background: '#27272f', color: '#FFFFFF', fontSize: '24px', padding: '24px', margin: '0px', height: '100%' }}>
          <ListItem key={'home'} disablePadding>
            <ListItemButton onClick={() => navigateTo('') }>
              <ListItemIcon>
                <SportsFootballIcon sx={{ color: 'brown' }} />
              </ListItemIcon>
              <ListItemText >Home</ListItemText>
            </ListItemButton>
          </ListItem>

          <ListItem key={'picks'} disablePadding>
            <ListItemButton onClick={() => navigateTo('picks') }>
              <ListItemIcon>
                <CheckCircleIcon sx={{ color: 'green' }} />
              </ListItemIcon>
              <ListItemText>My Picks</ListItemText>
            </ListItemButton>
          </ListItem>

          {/* Admins */}
          {
            isAdminUser()
              ? (
                  <ListItem key={'settings'} disablePadding>
                    <ListItemButton onClick={() => navigateTo('settings') }>
                      <ListItemIcon>
                        <SettingsApplicationsIcon sx={{ color: 'grey' }} />
                      </ListItemIcon>
                      <ListItemText>Settings</ListItemText>
                    </ListItemButton>
                  </ListItem>
                )
              : null
          }
        </List>
      </Drawer>
    </>
  );
}