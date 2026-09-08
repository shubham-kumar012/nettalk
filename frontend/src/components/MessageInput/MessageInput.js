import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

// Bottom composer bar for drafting and sending chat messages
const MessageInput = ({ disabled = false, onSendMessage }) => {
  const [messageText, setMessageText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    if (onSendMessage) {
      onSendMessage(messageText.trim());
    }
    setMessageText('');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 2,
        backgroundColor: '#FBF9F4',
        borderTop: '1px solid #DDD6C8',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5
      }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder="Type a message..."
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        disabled={disabled}
        variant="outlined"
        sx={{
          backgroundColor: '#FFFFFF',
          borderRadius: '4px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '4px',
            '& fieldset': {
              borderColor: '#DDD6C8'
            },
            '&:hover fieldset': {
              borderColor: '#756B56'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#756B56'
            }
          },
          '& .MuiInputBase-input': {
            fontSize: '0.92rem',
            color: '#292824',
            py: 1.2
          }
        }}
      />
      <Button
        type="submit"
        variant="contained"
        endIcon={<SendRoundedIcon sx={{ fontSize: 18 }} />}
        sx={{
          backgroundColor: '#756B56',
          color: '#FBF9F4',
          px: 2.5,
          py: 1,
          fontWeight: 600,
          '&:hover': {
            backgroundColor: '#5C5443'
          }
        }}
      >
        Send
      </Button>
    </Box>
  );
};

export default MessageInput;
