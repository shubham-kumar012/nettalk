import React from 'react';
import { Box, Typography } from '@mui/material';

// Placeholder component for typing indicator
// Real-time socket event handling will be added in Phase 2
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
