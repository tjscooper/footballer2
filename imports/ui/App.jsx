import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { MuiThemeProvider, createTheme } from '@material-ui/core';

// Pages
import { Home } from './Home';
import { Settings } from './Settings';
import { Picks } from './Picks';

// Routes
const footballerRoutes = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/picks", element: <Picks /> },
  { path: "/settings", element: <Settings /> },
]);

// View
export const App = () => {
  return (
    <MuiThemeProvider
      theme={createTheme({
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
    </MuiThemeProvider>
  );
};
