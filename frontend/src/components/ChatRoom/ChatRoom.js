import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import TagRoundedIcon from '@mui/icons-material/TagRounded';
import MessageInput from '../MessageInput/MessageInput';
import TypingIndicator from '../TypingIndicator/TypingIndicator';

// Initial sample messages for the conversation view
const STATIC_MESSAGES = [
  {
    id: 'm1',
    sender: 'Shubham',
    avatar: 'S',
    text: 'Hello everyone! Welcome to NetTalk.',
    timestamp: '11:15 AM',
    isSelf: true
  },
  {
    id: 'm2',
    sender: 'Rahul',
    avatar: 'R',
    text: 'Hi Shubham! The setup looks very clean and responsive.',
    timestamp: '11:18 AM',
    isSelf: false
  },
  {
    id: 'm3',
    sender: 'Priya',
    avatar: 'P',
    text: 'Glad to be here! Looking forward to testing the real-time chat in the next phase.',
    timestamp: '11:20 AM',
    isSelf: false
  }
];

const ChatRoom = ({ roomName = 'General', onlineCount = 3 }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#FBF9F4'
      }}
    >
      {/* Room Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderBottom: '1px solid #DDD6C8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FBF9F4'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TagRoundedIcon sx={{ color: '#756B56', fontSize: 22 }} />
          <Box>
            <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.2 }}>
              {roomName}
            </Typography>
            <Typography variant="caption" sx={{ color: '#716D64', fontWeight: 500 }}>
              {onlineCount} members online
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Messages Scrollable Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5
        }}
      >
        {STATIC_MESSAGES.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              flexDirection: msg.isSelf ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
              gap: 1.5,
              maxWidth: '80%',
              alignSelf: msg.isSelf ? 'flex-end' : 'flex-start'
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: msg.isSelf ? '#756B56' : '#EEE9DE',
                color: msg.isSelf ? '#FBF9F4' : '#292824',
                border: '1px solid #DDD6C8',
                mt: 0.2
              }}
            >
              {msg.avatar}
            </Avatar>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: msg.isSelf ? 'flex-end' : 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#292824' }}>
                  {msg.sender}
                </Typography>
                <Typography variant="caption" sx={{ color: '#969187' }}>
                  {msg.timestamp}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 1.6,
                  borderRadius: msg.isSelf ? '6px 2px 6px 6px' : '2px 6px 6px 6px',
                  backgroundColor: msg.isSelf ? '#756B56' : '#EEE9DE',
                  color: msg.isSelf ? '#FBF9F4' : '#292824',
                  border: msg.isSelf ? 'none' : '1px solid #DDD6C8',
                  fontSize: '0.92rem',
                  lineHeight: 1.45,
                  wordBreak: 'break-word'
                }}
              >
                {msg.text}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Typing Indicator */}
      <TypingIndicator typingUser={null} />

      {/* Bottom Message Input */}
      <MessageInput disabled={false} />
    </Box>
  );
};

export default ChatRoom;
