import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, CssBaseline, Container, Typography, TextField, Link, Button, Grid } from '@mui/material';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';

export const SignIn = () => {

  // References
  const navigate = useNavigate();

  // Methods
  const navigateTo = (pageName) => navigate(`/${pageName}`);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const userObj = {
      username: data.get('username'),
      password: data.get('password'),
    };

    Meteor.loginWithPassword({ username: userObj.username }, userObj.password, (err) => {
      if (err) {
        console.error({err});
        return;
      }
      navigateTo('');
    });
  };

  const Copyright = (props) => {
    return (
      <Typography
        variant="body2"
        align="center" {...props}
        sx={{ color: '#FFFFFF' }}>
        {'Copyright © '}
        <Link color="inherit" href="http://hypnochip.com/">
          Hypnochip
        </Link>
        {` ${ new Date().getFullYear() }.`}
      </Typography>
    );
  }

  return (
    <Container
      id="sign-in-container"
      component="main"
      maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Typography sx={{ fontSize: 54, marginTop: '16px', color: '#FFFFFF' }}>
          FOOTBALLER
        </Typography>
        <Avatar sx={{ m: 1, background: '#211b1d', width: '100px', height: '100px' }}>
          <SportsFootballIcon sx={{ m: 1, color: '#FFFFFF', width: '80px', height: '80px' }} />
        </Avatar>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
            sx={{ width: '90vw', background: '#FFFFFF', color: '#000000' }} />
          <TextField
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            sx={{ width: '90vw', background: '#FFFFFF', color: '#000000' }} />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, height: '60px', background: '#d0ff12', color: '#000000', fontWeight: 'bold' }}>
            Sign In
          </Button>
          <Grid container>
            <Grid item sx={{ mb: 6, width: '100%', textAlign: 'center' }}>
              <Link 
                href="/sign-up"
                sx={{ textDecoration: 'none', color: '#3ef3e2', background: '#333333', padding: '8px', textTransform: 'uppercase' }}>
                Sign Up
              </Link>
            </Grid>
            {/* <Grid item>
              <Link href="#">
                Forgot password?
              </Link>
            </Grid> */}
          </Grid>
        </Box>
      </Box>
      {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
    </Container>
  );
};