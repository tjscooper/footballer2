import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';

import { useNavigate } from 'react-router-dom';

export const TeamsList = (props) => {

  // References
  const navigate = useNavigate();

  // Data
  const { teams } = props;
  
  // Methods
  const toggleBottomNav = () => setIsBottomOpen(!isBottomOpen);

  const navigateTo = (pageName) => navigate(`/${pageName}`);

  const handleClick = (team) => {
    console.log('clicked team', team.name);
  }

  // Styles
  const styles = {
    box: {
      bgcolor: '#FFFFFF',
      borderRadius: '16px',
      width: '90vw'
    },
    list: {
      listItem: {
        teamInfo: {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          name: {
            minWidth: '140px'
          },
          record: {
            minWidth: '60px'
          }
        }
      }
    },
    noTeamsFound: {
      bgcolor: '#FFFFFF',
      borderRadius: '16px',
      width: '90vw'
    }
  };
  
  if (!teams) {
    return (
      <Box sx={styles.noTeamsFound}>
        <Typography>
          No Teams found.
        </Typography>
      </Box>
    );
  }
  
  // View
  return (
    <Box sx={styles.box}>
      <nav aria-label="teams">
        { teams.length > 0
            ? ( 
                <List>
                  { teams.map(team => (
                      <ListItem
                        sx={styles.list.listItem}
                        key={team._id}
                        disablePadding>
                        <ListItemButton onClick={ () => handleClick(team) }>
                          <ListItemIcon>
                            <img
                              src={team.logo}
                              width={32}
                              height={32}
                              srcSet={team.logo}
                              alt={team.name}
                              loading="lazy"
                            />
                          </ListItemIcon>
                          <div style={styles.list.listItem.teamInfo}>
                            <span style={styles.list.listItem.teamInfo.name}>
                              {team.name}
                            </span>
                            <span style={styles.list.listItem.teamInfo.record}>
                              {team.record}
                            </span>
                          </div>
                        </ListItemButton>
                      </ListItem>
                  )) }
              </List>
            )
          : <div>No Teams found.</div>
        }
      </nav>
    </Box>
  );
};
