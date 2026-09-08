import React from 'react';
import { Box, Typography } from '@mui/material';

// Displays an active typing notice when another user is composing a message
const TypingIndicator = ({ typingUser = null }) => {
  if (!typingUser) {
    return null;
  }

  return (
    <Box sx={{ px: 3, py: 0.5 }}>
      <Typography variant="caption" sx={{ color: '#969187', fontStyle: 'italic' }}>
        {typingUser} is typing...
      </Typography>
    </Box>
  );
};

export default TypingIndicator;
