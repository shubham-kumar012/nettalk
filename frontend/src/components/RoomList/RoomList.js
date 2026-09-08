import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import TagRoundedIcon from '@mui/icons-material/TagRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

const RoomList = ({
  rooms = [],
  activeRoomId = '',
  onSelectRoom = () => {},
  onCreateRoom = () => {}
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleOpenDialog = () => {
    setNewRoomName('');
    setErrorText('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewRoomName('');
    setErrorText('');
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) {
      setErrorText('Room name cannot be empty');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorText('');
      await onCreateRoom(newRoomName.trim());
      handleCloseDialog();
    } catch (err) {
      setErrorText(err.message || 'Failed to create room');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ px: 2, py: 1.5 }}>
      {/* Rooms header with create action */}
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
          onClick={handleOpenDialog}
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
        >
          New Room
        </Button>
      </Box>

      {/* Available chat rooms list */}
      <List disablePadding>
        {rooms.map((room) => {
          const roomId = room._id || room.id;
          const isSelected = roomId === activeRoomId;

          return (
            <ListItemButton
              key={roomId}
              selected={isSelected}
              onClick={() => onSelectRoom(roomId)}
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

      {/* Dialog for creating a new room */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            backgroundColor: '#FBF9F4',
            border: '1px solid #DDD6C8',
            borderRadius: '6px',
            p: 1,
            width: '100%',
            maxWidth: '380px',
            mx: 2
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#292824', pb: 1 }}>
          Create New Room
        </DialogTitle>
        <Box component="form" onSubmit={handleCreateSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            <TextField
              autoFocus
              fullWidth
              size="small"
              label="Room Name"
              placeholder="e.g. Design, Announcements"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              error={Boolean(errorText)}
              helperText={errorText}
              sx={{
                backgroundColor: '#FFFFFF',
                borderRadius: '4px'
              }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseDialog} sx={{ color: '#716D64' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || !newRoomName.trim()}
              sx={{
                backgroundColor: '#756B56',
                color: '#FBF9F4',
                '&:hover': { backgroundColor: '#5C5443' }
              }}
            >
              Create
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default RoomList;
