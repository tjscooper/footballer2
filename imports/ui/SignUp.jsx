import { Accounts } from 'meteor/accounts-base';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SignUp = () => {

  // References
  const navigate = useNavigate();
  
  // State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Methods
  const navigateTo = (pageName) => navigate(`/${pageName}`);

  const submit = e => {
    e.preventDefault();

    const options = {
      username,
      email,
      password
    };

    Accounts.createUser(options, (err) => {
      if (err) {
        console.error(err);
      }
      navigateTo('');
    });
  };

  return (
    <React.Fragment>
      <h1>Sign Up</h1>
      <form onSubmit={submit} className="login-form">
        
        <label htmlFor="username">Username</label>

        <input
          type="text"
          placeholder="Username"
          name="username"
          required
          onChange={e => setUsername(e.target.value)}
        />

        <label htmlFor="email">Email</label>

        <input
          type="text"
          placeholder="Email"
          name="email"
          required
          onChange={e => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>

        <input
          type="password"
          placeholder="Password"
          name="password"
          required
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit">Sign Up</button>
      </form>
    </React.Fragment>
  );
};