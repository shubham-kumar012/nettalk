import React, { useEffect, useRef } from 'react';
import { Box, Typography, Avatar, CircularProgress } from '@mui/material';
import TagRoundedIcon from '@mui/icons-material/TagRounded';
import MessageInput from '../MessageInput/MessageInput';
import TypingIndicator from '../TypingIndicator/TypingIndicator';

// Helper to format ISO timestamps into clean readable times like "11:15 AM"
const formatTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatRoom = ({
  roomName = 'General',
  onlineCount = 1,
  messages = [],
  currentUserId = null,
  currentUsername = null,
  typingUser = null,
  onSendMessage = () => {},
  onTyping = () => {},
  isLoadingHistory = false
}) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom whenever new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

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
              {onlineCount} {onlineCount === 1 ? 'member' : 'members'} online
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Messages Scrollable Feed */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {isLoadingHistory ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress size={28} sx={{ color: '#756B56' }} />
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#969187' }}>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              No messages yet in #{roomName}. Start the conversation!
            </Typography>
          </Box>
        ) : (
          messages.map((msg) => {
            const senderObj = msg.sender || {};
            const senderId = senderObj._id || senderObj.id || senderObj;
            const senderName = senderObj.username || 'User';
            const initial = senderName.charAt(0).toUpperCase();

            // Determine if the message was sent by the current active user
            const isSelf = (currentUserId && senderId === currentUserId) || (currentUsername && senderName === currentUsername);

            return (
              <Box
                key={msg._id || `${msg.createdAt}-${Math.random()}`}
                sx={{
                  display: 'flex',
                  flexDirection: isSelf ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  maxWidth: '75%',
                  alignSelf: isSelf ? 'flex-end' : 'flex-start'
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    backgroundColor: isSelf ? '#756B56' : '#EEE9DE',
                    color: isSelf ? '#FBF9F4' : '#292824',
                    border: '1px solid #DDD6C8',
                    mt: 0.2
                  }}
                >
                  {initial}
                </Avatar>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isSelf ? 'flex-end' : 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#292824' }}>
                      {senderName} {isSelf && '(You)'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#969187' }}>
                      {formatTime(msg.createdAt)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: isSelf ? '6px 2px 6px 6px' : '2px 6px 6px 6px',
                      backgroundColor: isSelf ? '#756B56' : '#EEE9DE',
                      color: isSelf ? '#FBF9F4' : '#292824',
                      border: isSelf ? 'none' : '1px solid #DDD6C8',
                      fontSize: '0.92rem',
                      lineHeight: 1.45,
                      wordBreak: 'break-word'
                    }}
                  >
                    {msg.content}
                  </Box>
                </Box>
              </Box>
            );
          })
        )}

        {/* Anchor point to auto-scroll to the newest message */}
        <div ref={messagesEndRef} />
      </Box>

      {/* Real-time typing notification */}
      <TypingIndicator typingUser={typingUser} />

      {/* Message input bar */}
      <MessageInput
        disabled={isLoadingHistory || !roomName}
        onSendMessage={onSendMessage}
        onTyping={onTyping}
      />
    </Box>
  );
};

export default ChatRoom;
