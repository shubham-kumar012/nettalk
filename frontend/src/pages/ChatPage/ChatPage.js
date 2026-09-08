import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import RoomList from '../../components/RoomList/RoomList';
import OnlineUsersList from '../../components/OnlineUsersList/OnlineUsersList';
import ChatRoom from '../../components/ChatRoom/ChatRoom';

const ROOMS_DATA = [
  { id: 'general', name: 'General' },
  { id: 'developers', name: 'Developers' },
  { id: 'random', name: 'Random' }
];

const ChatPage = () => {
  const [activeRoomId, setActiveRoomId] = useState('general');

  const currentRoom = ROOMS_DATA.find((r) => r.id === activeRoomId) || ROOMS_DATA[0];

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#F4F0E8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 0, sm: 2 }
      }}
    >
      {/* Main Container Shell */}
      <Box
        sx={{
          height: { xs: '100%', sm: '92vh' },
          width: { xs: '100%', sm: '94vw', md: '1100px' },
          backgroundColor: '#FBF9F4',
          borderRadius: { xs: 0, sm: '6px' },
          border: '1px solid #DDD6C8',
          display: 'flex',
          overflow: 'hidden'
        }}
      >
        {/* Left Sidebar */}
        <Box
          sx={{
            width: { xs: '240px', sm: '270px' },
            minWidth: { xs: '240px', sm: '270px' },
            borderRight: '1px solid #DDD6C8',
            backgroundColor: '#F4F0E8',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%'
          }}
        >
          {/* Top Section: App Branding & Rooms */}
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
            {/* Branding Header */}
            <Box
              sx={{
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                borderBottom: '1px solid #DDD6C8'
              }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '4px',
                  backgroundColor: '#756B56',
                  color: '#FBF9F4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ForumRoundedIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    color: '#292824'
                  }}
                >
                  NetTalk
                </Typography>
                <Typography variant="caption" sx={{ color: '#716D64', fontWeight: 500 }}>
                  Team Chat
                </Typography>
              </Box>
            </Box>

            {/* Room List Navigation */}
            <RoomList
              rooms={ROOMS_DATA}
              activeRoomId={activeRoomId}
              onSelectRoom={(id) => setActiveRoomId(id)}
            />
          </Box>

          {/* Bottom Section: Online Users */}
          <Box
            sx={{
              borderTop: '1px solid #DDD6C8',
              backgroundColor: '#EEE9DE'
            }}
          >
            <OnlineUsersList />
          </Box>
        </Box>

        {/* Main Chat Area */}
        <Box sx={{ flex: 1, height: '100%', overflow: 'hidden' }}>
          <ChatRoom
            roomName={currentRoom.name}
            onlineCount={3}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ChatPage;
