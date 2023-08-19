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
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Avatar sx={{ m: 1 }}>
          <SportsFootballIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
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
            autoFocus/>
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
            autoComplete="current-password"/>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Grid container>
            <Grid
              item>
              <Link
                href="/sign-up">
                {'Sign Up'}
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
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
};