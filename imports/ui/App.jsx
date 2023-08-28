import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Pages
import { Home } from './Home';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { Picks } from './Picks';
import { Teams } from './Teams';
import { Settings } from './Settings';

// Routes
const footballerRoutes = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/sign-in", element: <SignIn /> },
  { path: "/sign-up", element: <SignUp /> },
  { path: "/picks", element: <Picks /> },
  { path: "/teams", element: <Teams /> },
  { path: "/settings", element: <Settings /> },
]);

const defaultSpacing = '8';

// View
export const App = () => {
  return (
    <ThemeProvider
      theme={createTheme({
        components: {
          // todo: remove once the issue is addressed: https://github.com/mui/material-ui/issues/31185
          MuiDialogContent: {
            styleOverrides: { root: { paddingTop: `${defaultSpacing}px !important` } },
          },
        },
        palette: {
          background: {
            default: '#27272f'
          },
          text: {
            primary: '#FFFFFF',
            secondary: '#CCCCCC',
            disabled: '#C5C5C5'
          },
        },
        breakpoints: {
          values: {
            laptop: 1024,
            tablet: 640,
            mobile: 0,
            desktop: 1280,
          },
        },
      })}>
        <React.Fragment>
          <RouterProvider router={footballerRoutes} />
        </React.Fragment>
    </ThemeProvider>
  );
};
