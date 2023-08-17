import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SignIn = () => {

  // References
  const navigate = useNavigate();
  
  // State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Methods
  const navigateTo = (pageName) => navigate(`/${pageName}`);

  const submit = e => {
    e.preventDefault();

    Meteor.loginWithPassword({ username }, password, (err) => {
      if (err) {
        console.error({err});
        return;
      }
      navigateTo('');
    });
  };

  return (
    <React.Fragment>
      <h1>Sign In</h1>
      <form onSubmit={submit} className="login-form">
        <label htmlFor="username">Username</label>

        <input
          type="text"
          placeholder="Username"
          name="username"
          required
          onChange={e => setUsername(e.target.value)}
        />

        <label htmlFor="password">Password</label>

        <input
          type="password"
          placeholder="Password"
          name="password"
          required
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit">Log In</button>
      </form>

    </React.Fragment>
  );
};