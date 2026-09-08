import React from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';

// Static placeholder online users list for Phase 1
const DEFAULT_ONLINE_USERS = [
  { id: '1', name: 'Shubham', initial: 'S', isCurrent: true },
  { id: '2', name: 'Rahul', initial: 'R', isCurrent: false },
  { id: '3', name: 'Priya', initial: 'P', isCurrent: false }
];

const OnlineUsersList = ({ users = DEFAULT_ONLINE_USERS }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="caption"
        sx={{
          textTransform: 'uppercase',
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: '#716D64',
          px: 1,
          display: 'block',
          mb: 1
        }}
      >
        Online Users ({users.length})
      </Typography>

      <List disablePadding>
        {users.map((user) => (
          <ListItem
            key={user.id}
            disableGutters
            sx={{
              px: 1,
              py: 0.6,
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ListItemAvatar sx={{ minWidth: 32, mr: 1.2 }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  sx={{
                    width: 26,
                    height: 26,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: '#EEE9DE',
                    color: '#756B56',
                    border: '1px solid #DDD6C8'
                  }}
                >
                  {user.initial}
                </Avatar>
                {/* Online green indicator dot */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#4E8652',
                    border: '1.5px solid #FBF9F4'
                  }}
                />
              </Box>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: user.isCurrent ? 600 : 500,
                    color: '#292824',
                    fontSize: '0.85rem'
                  }}
                >
                  {user.name} {user.isCurrent && '(You)'}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default OnlineUsersList;
