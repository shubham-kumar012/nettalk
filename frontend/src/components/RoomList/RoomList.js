import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button
} from '@mui/material';
import TagRoundedIcon from '@mui/icons-material/TagRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

const DEFAULT_ROOMS = [
  { id: 'general', name: 'General', description: 'General discussion' },
  { id: 'developers', name: 'Developers', description: 'Tech & coding discussions' },
  { id: 'random', name: 'Random', description: 'Casual conversations' }
];

const RoomList = ({
  rooms = DEFAULT_ROOMS,
  activeRoomId = 'general',
  onSelectRoom = () => {}
}) => {
  return (
    <Box sx={{ px: 2, py: 1.5 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1,
          mb: 1
        }}
      >
        <Typography
          variant="caption"
          sx={{
            textTransform: 'uppercase',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#716D64'
          }}
        >
          Chat Rooms
        </Typography>

        <Button
          size="small"
          startIcon={<AddRoundedIcon sx={{ fontSize: 16 }} />}
          sx={{
            color: '#756B56',
            fontSize: '0.78rem',
            p: '2px 8px',
            minWidth: 0,
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#EEE9DE'
            }
          }}
          onClick={() => {
            // Placeholder click action for new room creation
          }}
        >
          New Room
        </Button>
      </Box>

      <List disablePadding>
        {rooms.map((room) => {
          const isSelected = room.id === activeRoomId;
          return (
            <ListItemButton
              key={room.id}
              selected={isSelected}
              onClick={() => onSelectRoom(room.id)}
              sx={{
                borderRadius: '4px',
                px: 1.5,
                py: 0.8,
                mb: 0.5,
                transition: 'background-color 0.15s ease',
                backgroundColor: isSelected ? '#EEE9DE' : 'transparent',
                '&:hover': {
                  backgroundColor: isSelected ? '#EEE9DE' : 'rgba(238, 233, 222, 0.5)'
                },
                '&.Mui-selected': {
                  backgroundColor: '#EEE9DE',
                  '&:hover': {
                    backgroundColor: '#EEE9DE'
                  }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 26, color: isSelected ? '#756B56' : '#969187' }}>
                <TagRoundedIcon sx={{ fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText
                primary={room.name}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? '#292824' : '#716D64'
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
};

export default RoomList;
