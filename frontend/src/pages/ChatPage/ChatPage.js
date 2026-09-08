import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Drawer,
  Snackbar,
  Alert
} from '@mui/material';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import RoomList from '../../components/RoomList/RoomList';
import OnlineUsersList from '../../components/OnlineUsersList/OnlineUsersList';
import ChatRoom from '../../components/ChatRoom/ChatRoom';
import socket from '../../services/socket';
import { getRooms, createRoom, getMessages, createUser, getUsers } from '../../services/api';

const ChatPage = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    // Load existing user from localStorage if previously stored
    const saved = localStorage.getItem('nettalk_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [usernameInput, setUsernameInput] = useState('');
  const [userModalOpen, setUserModalOpen] = useState(!currentUser);
  const [userError, setUserError] = useState('');

  // Mobile drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Room and message states
  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Global notification snackbar for errors
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Handle setting a username identity
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const trimmed = usernameInput.trim();
    if (!trimmed) {
      setUserError('Please enter a username');
      return;
    }

    try {
      setUserError('');
      let user;
      try {
        user = await createUser(trimmed);
      } catch (err) {
        // If user already exists or error occurs, match against all users
        const all = await getUsers();
        user = all.find((u) => u.username.toLowerCase() === trimmed.toLowerCase());
      }

      if (!user || !user._id) {
        const all = await getUsers();
        user = all.find((u) => u.username.toLowerCase() === trimmed.toLowerCase());
      }

      if (user && user._id) {
        setCurrentUser(user);
        localStorage.setItem('nettalk_user', JSON.stringify(user));
        setUserModalOpen(false);
      } else {
        setUserError('Could not set username. Please try again.');
      }
    } catch (err) {
      setUserError('Error connecting to backend server');
    }
  };

  // Load available rooms from backend API on mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        let availableRooms = await getRooms();

        // If no rooms exist yet in the database, seed default "General" room
        if (!availableRooms || availableRooms.length === 0) {
          const generalRoom = await createRoom('General');
          availableRooms = [generalRoom];
        }

        setRooms(availableRooms);

        // Default to the first available room
        if (availableRooms.length > 0) {
          setActiveRoomId((prevId) => prevId || availableRooms[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
        setSnackbarMessage('Failed to load rooms from server');
      }
    };

    fetchRooms();
  }, []);

  // Connect socket when entering chat page, disconnect on leave
  useEffect(() => {
    socket.connect();

    const handleConnectError = () => {
      setSnackbarMessage('Socket disconnected. Reconnecting...');
    };

    socket.on('connect_error', handleConnectError);

    return () => {
      socket.off('connect_error', handleConnectError);
      socket.disconnect();
    };
  }, []);

  // Load chat history using REST API when switching active rooms
  useEffect(() => {
    if (!activeRoomId) return;

    let isMounted = true;
    setIsLoadingHistory(true);
    setMessages([]); // Clear previous room messages immediately

    getMessages(activeRoomId)
      .then((history) => {
        if (isMounted) {
          setMessages(Array.isArray(history) ? history : []);
          setIsLoadingHistory(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load room messages:', err);
        if (isMounted) {
          setIsLoadingHistory(false);
          setSnackbarMessage('Failed to load message history');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeRoomId]);

  // Join the selected Socket.io room and bind real-time event listeners
  useEffect(() => {
    if (!currentUser || !activeRoomId) return;

    // Join room in Socket.io
    socket.emit('joinRoom', {
      roomId: activeRoomId,
      userId: currentUser._id,
      username: currentUser.username
    });

    // Reset typing state on room change
    setTypingUser(null);

    // Receive incoming real-time messages in this room
    const handleChatMessage = (newMessage) => {
      const msgRoomId = newMessage.room?._id || newMessage.room;
      if (msgRoomId === activeRoomId) {
        setMessages((prev) => {
          const alreadyExists = prev.some((m) => m._id === newMessage._id);
          if (alreadyExists) return prev;
          return [...prev, newMessage];
        });
      }
    };

    // Update list of online users in this room
    const handleOnlineUsers = (usersList) => {
      setOnlineUsers(Array.isArray(usersList) ? usersList : []);
    };

    // Handle typing indicator from other room members
    const handleTyping = ({ username, isTyping }) => {
      if (username === currentUser.username) return; // Do not show indicator for oneself
      setTypingUser(isTyping ? username : null);
    };

    // Listen for new rooms created by any user in real time
    const handleRoomCreated = (newRoom) => {
      if (!newRoom || !newRoom._id) return;
      setRooms((prev) => {
        const alreadyExists = prev.some((r) => r._id === newRoom._id);
        if (alreadyExists) return prev;
        return [...prev, newRoom];
      });
    };

    socket.on('chatMessage', handleChatMessage);
    socket.on('onlineUsers', handleOnlineUsers);
    socket.on('typing', handleTyping);
    socket.on('roomCreated', handleRoomCreated);

    // Clean up listeners when room changes or component unmounts
    return () => {
      socket.off('chatMessage', handleChatMessage);
      socket.off('onlineUsers', handleOnlineUsers);
      socket.off('typing', handleTyping);
      socket.off('roomCreated', handleRoomCreated);
    };
  }, [currentUser, activeRoomId]);

  // Send message via Socket.io
  const handleSendMessage = useCallback((content) => {
    if (!currentUser || !activeRoomId || !content.trim()) return;

    socket.emit('chatMessage', {
      roomId: activeRoomId,
      senderId: currentUser._id,
      content: content.trim()
    });
  }, [currentUser, activeRoomId]);

  // Emit typing status
  const handleTyping = useCallback((isTyping) => {
    if (!currentUser || !activeRoomId) return;

    socket.emit('typing', {
      roomId: activeRoomId,
      username: currentUser.username,
      isTyping
    });
  }, [currentUser, activeRoomId]);

  // Handle room selection and auto-close mobile drawer
  const handleSelectRoom = (roomId) => {
    setActiveRoomId(roomId);
    setMobileDrawerOpen(false);
  };

  // Create a new room and broadcast to all users
  const handleCreateRoom = async (name) => {
    try {
      const newRoom = await createRoom(name);
      if (newRoom && newRoom._id) {
        socket.emit('createRoom', newRoom);

        setRooms((prev) => {
          const exists = prev.some((r) => r._id === newRoom._id);
          if (exists) return prev;
          return [...prev, newRoom];
        });
        setActiveRoomId(newRoom._id);
        setMobileDrawerOpen(false);
      }
    } catch (err) {
      setSnackbarMessage('Failed to create room. Please try again.');
    }
  };

  const currentRoom = rooms.find((r) => r._id === activeRoomId) || { name: 'General' };

  // Reusable Sidebar Content (Used in both Desktop Sidebar and Mobile Drawer)
  const sidebarContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        backgroundColor: '#F4F0E8',
        width: '100%'
      }}
    >
      {/* Top Section: App Branding & Room List */}
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
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <ForumRoundedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
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
            <Typography
              variant="caption"
              noWrap
              onClick={() => {
                setUserModalOpen(true);
                setMobileDrawerOpen(false);
              }}
              sx={{
                color: '#716D64',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'block',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              {currentUser ? `User: ${currentUser.username}` : 'Set username'}
            </Typography>
          </Box>
        </Box>

        {/* Room Navigation List */}
        <RoomList
          rooms={rooms}
          activeRoomId={activeRoomId}
          onSelectRoom={handleSelectRoom}
          onCreateRoom={handleCreateRoom}
        />
      </Box>

      {/* Bottom Section: Online Users in Current Room */}
      <Box
        sx={{
          borderTop: '1px solid #DDD6C8',
          backgroundColor: '#EEE9DE'
        }}
      >
        <OnlineUsersList
          users={onlineUsers}
          currentUserId={currentUser?._id}
          currentUsername={currentUser?.username}
        />
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        maxWidth: '100vw',
        overflowX: 'hidden',
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
          border: { xs: 'none', sm: '1px solid #DDD6C8' },
          display: 'flex',
          overflow: 'hidden'
        }}
      >
        {/* Desktop Permanent Left Sidebar */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            width: '270px',
            minWidth: '270px',
            borderRight: '1px solid #DDD6C8',
            height: '100%'
          }}
        >
          {sidebarContent}
        </Box>

        {/* Mobile Responsive Navigation Drawer */}
        <Drawer
          variant="temporary"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          ModalProps={{
            keepMounted: true // Improves mobile opening performance
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: 270,
              maxWidth: '85vw',
              backgroundColor: '#F4F0E8',
              borderRight: '1px solid #DDD6C8',
              boxSizing: 'border-box'
            }
          }}
        >
          {sidebarContent}
        </Drawer>

        {/* Main Chat Conversation Area */}
        <Box sx={{ flex: 1, height: '100%', overflow: 'hidden', display: 'flex' }}>
          <ChatRoom
            roomName={currentRoom.name}
            onlineCount={onlineUsers.length || 1}
            messages={messages}
            currentUserId={currentUser?._id}
            currentUsername={currentUser?.username}
            typingUser={typingUser}
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
            isLoadingHistory={isLoadingHistory}
            onToggleMobileMenu={() => setMobileDrawerOpen(true)}
          />
        </Box>
      </Box>

      {/* Modal for setting username identity */}
      <Dialog
        open={userModalOpen}
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            backgroundColor: '#FBF9F4',
            border: '1px solid #DDD6C8',
            borderRadius: '6px',
            p: 1,
            width: '100%',
            maxWidth: '360px',
            mx: 2
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#292824', pb: 1 }}>
          Enter Chat Name
        </DialogTitle>
        <Box component="form" onSubmit={handleUserSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            <Typography variant="body2" sx={{ color: '#716D64', mb: 2 }}>
              Choose a display name to join the conversation rooms.
            </Typography>
            <TextField
              autoFocus
              fullWidth
              size="small"
              placeholder="e.g. Shubham, Alex"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              error={Boolean(userError)}
              helperText={userError}
              inputProps={{
                'aria-label': 'Username'
              }}
              sx={{
                backgroundColor: '#FFFFFF',
                borderRadius: '4px'
              }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={!usernameInput.trim()}
              sx={{
                backgroundColor: '#756B56',
                color: '#FBF9F4',
                fontWeight: 600,
                width: '100%',
                py: 1,
                '&:hover': { backgroundColor: '#5C5443' }
              }}
            >
              Join NetTalk
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Simple error notification snackbar */}
      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarMessage('')}
          severity="info"
          sx={{
            backgroundColor: '#EEE9DE',
            color: '#292824',
            border: '1px solid #DDD6C8',
            fontWeight: 500,
            '& .MuiAlert-icon': {
              color: '#756B56'
            }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChatPage;
