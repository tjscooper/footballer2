import { Accounts } from 'meteor/accounts-base';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export const SignUp = () => {

  // References
  const navigate = useNavigate();
  
  // Methods
  const navigateTo = (pageName) => navigate(`/${pageName}`);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const userObj = {
      username: data.get('username'),
      email: data.get('email'),
      password: data.get('password'),
    };
    console.log({ userObj });

    Accounts.createUser(userObj, (err) => {
      if (err) {
        console.error(err);
      }
      navigateTo('');
    });
  };

  const Copyright = (props) => {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
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
      id="sign-up-container"
      component="main"
      maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
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
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                sx={{ width: '90vw', background: '#FFFFFF', color: '#000000' }} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                sx={{ width: '90vw', background: '#FFFFFF', color: '#000000' }} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                sx={{ width: '90vw', background: '#FFFFFF', color: '#000000' }} />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, height: '60px', background: '#d0ff12', color: '#000000', fontWeight: 'bold' }}>
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item sx={{ mb: 6, width: '100%', textAlign: 'center' }}>
              <Link
                href="/sign-in"
                sx={{ textDecoration: 'none', color: '#3ef3e2', background: '#333333', padding: '6px', textTransform: 'uppercase' }}>
                Sign In
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
    </Container>
  );
};