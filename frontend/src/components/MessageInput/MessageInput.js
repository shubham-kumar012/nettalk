import React, { useState, useRef } from 'react';
import { Box, TextField, Button } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

// Bottom composer bar for drafting and sending chat messages
const MessageInput = ({ disabled = false, onSendMessage, onTyping }) => {
  const [messageText, setMessageText] = useState('');
  const typingTimeoutRef = useRef(null);

  // Handle typing indicator trigger
  const handleChange = (e) => {
    const text = e.target.value;
    setMessageText(text);

    if (onTyping) {
      // Let the room know we started typing
      onTyping(true);

      // Clear any existing timer and reset the 1.5s stop-typing timer
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 1500);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    // Send the message text to the parent handler
    if (onSendMessage) {
      onSendMessage(messageText.trim());
    }

    // Stop typing notification immediately upon sending
    if (onTyping) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      onTyping(false);
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
        placeholder="Type a message... (Press Enter to send)"
        value={messageText}
        onChange={handleChange}
        disabled={disabled}
        variant="outlined"
        autoComplete="off"
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
        disabled={disabled || !messageText.trim()}
        endIcon={<SendRoundedIcon sx={{ fontSize: 18 }} />}
        sx={{
          backgroundColor: '#756B56',
          color: '#FBF9F4',
          px: 2.5,
          py: 1,
          fontWeight: 600,
          '&:hover': {
            backgroundColor: '#5C5443'
          },
          '&.Mui-disabled': {
            backgroundColor: '#DDD6C8',
            color: '#969187'
          }
        }}
      >
        Send
      </Button>
    </Box>
  );
};

export default MessageInput;
