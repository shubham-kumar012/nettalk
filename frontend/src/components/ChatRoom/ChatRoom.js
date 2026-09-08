import React, { useEffect, useRef } from 'react';
import { Box, Typography, Avatar, CircularProgress, IconButton } from '@mui/material';
import TagRoundedIcon from '@mui/icons-material/TagRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MessageInput from '../MessageInput/MessageInput';
import TypingIndicator from '../TypingIndicator/TypingIndicator';

// Convert ISO timestamp strings into readable times like "10:42 AM"
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
  isLoadingHistory = false,
  onToggleMobileMenu = () => {}
}) => {
  const messagesEndRef = useRef(null);

  // Automatically scroll down when new messages or typing status updates arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        backgroundColor: '#FBF9F4',
        overflow: 'hidden'
      }}
    >
      {/* Room Top Header Bar */}
      <Box
        sx={{
          px: { xs: 1.5, sm: 3 },
          py: { xs: 1.2, sm: 1.8 },
          borderBottom: '1px solid #DDD6C8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FBF9F4',
          minHeight: '58px'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          {/* Mobile hamburger menu button to open sidebar drawer */}
          <IconButton
            onClick={onToggleMobileMenu}
            aria-label="Open chat rooms menu"
            size="small"
            sx={{
              display: { xs: 'flex', md: 'none' },
              color: '#756B56',
              p: 0.8,
              mr: 0.5,
              border: '1px solid #DDD6C8',
              borderRadius: '4px'
            }}
          >
            <MenuRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>

          <TagRoundedIcon sx={{ color: '#756B56', fontSize: { xs: 20, sm: 22 }, flexShrink: 0 }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontSize: { xs: '0.98rem', sm: '1.05rem' },
                fontWeight: 700,
                lineHeight: 1.2,
                color: '#292824'
              }}
            >
              {roomName}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#716D64',
                fontWeight: 500,
                display: 'block',
                fontSize: { xs: '0.72rem', sm: '0.75rem' }
              }}
            >
              {onlineCount} {onlineCount === 1 ? 'member' : 'members'} online
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Scrollable Messages Container */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: { xs: 1.5, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 1.5, sm: 2 }
        }}
      >
        {/* Loading state when switching rooms and fetching messages */}
        {isLoadingHistory ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              gap: 1.5
            }}
          >
            <CircularProgress size={26} sx={{ color: '#756B56' }} />
            <Typography variant="body2" sx={{ color: '#716D64', fontSize: '0.85rem' }}>
              Loading messages...
            </Typography>
          </Box>
        ) : messages.length === 0 ? (
          /* Empty room state when no messages exist yet */
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#969187',
              textAlign: 'center',
              px: 2
            }}
          >
            <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#716D64' }}>
              No messages yet in #{roomName}. Start the conversation!
            </Typography>
          </Box>
        ) : (
          /* Render list of chat messages */
          messages.map((msg) => {
            const senderObj = msg.sender || {};
            const senderId = senderObj._id || senderObj.id || senderObj;
            const senderName = senderObj.username || 'User';
            const initial = senderName.charAt(0).toUpperCase();

            // Check if this message was sent by the current user
            const isSelf =
              (currentUserId && senderId === currentUserId) ||
              (currentUsername && senderName === currentUsername);

            return (
              <Box
                key={msg._id || `${msg.createdAt}-${Math.random()}`}
                sx={{
                  display: 'flex',
                  flexDirection: isSelf ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: { xs: 1, sm: 1.5 },
                  maxWidth: { xs: '88%', sm: '75%' },
                  alignSelf: isSelf ? 'flex-end' : 'flex-start'
                }}
              >
                {/* User Avatar */}
                <Avatar
                  sx={{
                    width: { xs: 28, sm: 32 },
                    height: { xs: 28, sm: 32 },
                    fontSize: { xs: '0.72rem', sm: '0.8rem' },
                    fontWeight: 600,
                    backgroundColor: isSelf ? '#756B56' : '#EEE9DE',
                    color: isSelf ? '#FBF9F4' : '#292824',
                    border: '1px solid #DDD6C8',
                    mt: 0.2,
                    flexShrink: 0
                  }}
                >
                  {initial}
                </Avatar>

                {/* Message Bubble and Header */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isSelf ? 'flex-end' : 'flex-start',
                    minWidth: 0
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 0.4,
                      flexWrap: 'wrap'
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: '#292824',
                        fontSize: { xs: '0.72rem', sm: '0.75rem' }
                      }}
                    >
                      {senderName} {isSelf && '(You)'}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#969187',
                        fontSize: { xs: '0.68rem', sm: '0.72rem' }
                      }}
                    >
                      {formatTime(msg.createdAt)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: { xs: 1.2, sm: 1.5 },
                      borderRadius: isSelf ? '6px 2px 6px 6px' : '2px 6px 6px 6px',
                      backgroundColor: isSelf ? '#756B56' : '#EEE9DE',
                      color: isSelf ? '#FBF9F4' : '#292824',
                      border: isSelf ? 'none' : '1px solid #DDD6C8',
                      fontSize: { xs: '0.88rem', sm: '0.92rem' },
                      lineHeight: 1.45,
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word'
                    }}
                  >
                    {msg.content}
                  </Box>
                </Box>
              </Box>
            );
          })
        )}

        {/* Anchor point to auto-scroll down on new messages */}
        <div ref={messagesEndRef} />
      </Box>

      {/* Real-time typing notification */}
      <TypingIndicator typingUser={typingUser} />

      {/* Message composer input bar */}
      <MessageInput
        disabled={isLoadingHistory || !roomName}
        onSendMessage={onSendMessage}
        onTyping={onTyping}
      />
    </Box>
  );
};

export default ChatRoom;
