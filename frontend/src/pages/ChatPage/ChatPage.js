import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import RoomList from '../../components/RoomList/RoomList';
import OnlineUsersList from '../../components/OnlineUsersList/OnlineUsersList';
import ChatRoom from '../../components/ChatRoom/ChatRoom';
import socket from '../../services/socket';
import { getRooms, createRoom, getMessages, createUser, getUsers } from '../../services/api';

const ChatPage = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    // Retrieve previously saved user identity from localStorage if available
    const saved = localStorage.getItem('nettalk_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [usernameInput, setUsernameInput] = useState('');
  const [userModalOpen, setUserModalOpen] = useState(!currentUser);
  const [userError, setUserError] = useState('');

  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Handle initial user creation or login
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const trimmed = usernameInput.trim();
    if (!trimmed) {
      setUserError('Please enter a username');
      return;
    }

    try {
      setUserError('');
      // Try creating user or find existing user with same username
      let user;
      try {
        user = await createUser(trimmed);
      } catch (err) {
        // If already exists or error, fetch all users and match
        const all = await getUsers();
        user = all.find((u) => u.username.toLowerCase() === trimmed.toLowerCase());
      }

      if (!user || !user._id) {
        // If createUser returned an error response object
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

  // Load rooms from backend on initial mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        let availableRooms = await getRooms();

        // If no rooms exist in database yet, create default "General" room
        if (!availableRooms || availableRooms.length === 0) {
          const generalRoom = await createRoom('General');
          availableRooms = [generalRoom];
        }

        setRooms(availableRooms);

        // Select the first room by default if none is selected
        if (availableRooms.length > 0) {
          setActiveRoomId((prevId) => prevId || availableRooms[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
      }
    };

    fetchRooms();
  }, []);

  // Connect socket on mount and disconnect on unmount
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  // Load chat history using REST API when active room changes
  useEffect(() => {
    if (!activeRoomId) return;

    let isMounted = true;
    setIsLoadingHistory(true);
    setMessages([]); // Clear previous room messages to prevent mixing rooms

    getMessages(activeRoomId)
      .then((history) => {
        if (isMounted) {
          setMessages(Array.isArray(history) ? history : []);
          setIsLoadingHistory(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load room messages:', err);
        if (isMounted) setIsLoadingHistory(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeRoomId]);

  // Join the selected Socket.io room and set up event listeners
  useEffect(() => {
    if (!currentUser || !activeRoomId) return;

    // Join the current room in Socket.io
    socket.emit('joinRoom', {
      roomId: activeRoomId,
      userId: currentUser._id,
      username: currentUser.username
    });

    // Reset typing state when switching rooms
    setTypingUser(null);

    // Listen for incoming chat messages in this room
    const handleChatMessage = (newMessage) => {
      const msgRoomId = newMessage.room?._id || newMessage.room;
      if (msgRoomId === activeRoomId) {
        setMessages((prev) => {
          // Avoid duplicate messages if received twice
          const alreadyExists = prev.some((m) => m._id === newMessage._id);
          if (alreadyExists) return prev;
          return [...prev, newMessage];
        });
      }
    };

    // Listen for updated online users in this room
    const handleOnlineUsers = (usersList) => {
      setOnlineUsers(Array.isArray(usersList) ? usersList : []);
    };

    // Listen for typing notifications from other users
    const handleTyping = ({ username, isTyping }) => {
      if (username === currentUser.username) return; // Don't show typing for self
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

    // Clean up socket listeners when switching rooms or unmounting
    return () => {
      socket.off('chatMessage', handleChatMessage);
      socket.off('onlineUsers', handleOnlineUsers);
      socket.off('typing', handleTyping);
      socket.off('roomCreated', handleRoomCreated);
    };
  }, [currentUser, activeRoomId]);

  // Send a new message through Socket.io
  const handleSendMessage = useCallback((content) => {
    if (!currentUser || !activeRoomId || !content.trim()) return;

    socket.emit('chatMessage', {
      roomId: activeRoomId,
      senderId: currentUser._id,
      content: content.trim()
    });
  }, [currentUser, activeRoomId]);

  // Emit typing indicator event through Socket.io
  const handleTyping = useCallback((isTyping) => {
    if (!currentUser || !activeRoomId) return;

    socket.emit('typing', {
      roomId: activeRoomId,
      username: currentUser.username,
      isTyping
    });
  }, [currentUser, activeRoomId]);

  // Create a new room, switch to it, and broadcast it in real time
  const handleCreateRoom = async (name) => {
    const newRoom = await createRoom(name);
    if (newRoom && newRoom._id) {
      // Broadcast the newly created room to all other connected users
      socket.emit('createRoom', newRoom);

      setRooms((prev) => {
        const exists = prev.some((r) => r._id === newRoom._id);
        if (exists) return prev;
        return [...prev, newRoom];
      });
      setActiveRoomId(newRoom._id);
    }
  };

  const currentRoom = rooms.find((r) => r._id === activeRoomId) || { name: 'General' };

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
              <Box sx={{ flex: 1 }}>
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
                  onClick={() => setUserModalOpen(true)}
                  sx={{
                    color: '#716D64',
                    fontWeight: 500,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  {currentUser ? `User: ${currentUser.username}` : 'Set username'}
                </Typography>
              </Box>
            </Box>

            {/* Room List Navigation */}
            <RoomList
              rooms={rooms}
              activeRoomId={activeRoomId}
              onSelectRoom={(id) => setActiveRoomId(id)}
              onCreateRoom={handleCreateRoom}
            />
          </Box>

          {/* Bottom Section: Online Users */}
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

        {/* Main Chat Area */}
        <Box sx={{ flex: 1, height: '100%', overflow: 'hidden' }}>
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
            maxWidth: '360px'
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
    </Box>
  );
};

export default ChatPage;
