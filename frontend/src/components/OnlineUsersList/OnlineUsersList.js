import React from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';

// Sidebar component displaying real-time connected users in the active room
const OnlineUsersList = ({ users = [], currentUserId = null, currentUsername = null }) => {
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

      {users.length === 0 ? (
        <Typography variant="caption" sx={{ px: 1, color: '#969187', fontStyle: 'italic', display: 'block' }}>
          No one else is in this room
        </Typography>
      ) : (
        <List disablePadding>
          {users.map((user) => {
            const userId = user._id || user.id;
            const username = user.username || user.name || 'User';
            const initial = username.charAt(0).toUpperCase();
            const isMe = (currentUserId && userId === currentUserId) || (currentUsername && username === currentUsername);

            return (
              <ListItem
                key={userId || username}
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
                      {initial}
                    </Avatar>
                    {/* Subtle green dot showing active connection */}
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
                        fontWeight: isMe ? 600 : 500,
                        color: '#292824',
                        fontSize: '0.85rem'
                      }}
                    >
                      {username} {isMe && '(You)'}
                    </Typography>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
};

export default OnlineUsersList;
