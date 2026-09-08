const Message = require('../models/Message');

// Keep track of connected sockets and their current room in memory
// Key: socket.id -> Value: { userId, username, roomId }
const connectedUsers = {};

// Helper function to get the list of unique online users in a specific room
const getOnlineUsersInRoom = (roomId) => {
  const usersInRoom = [];
  const seenUserIds = new Set();

  for (const socketId in connectedUsers) {
    const user = connectedUsers[socketId];
    if (user.roomId === roomId && !seenUserIds.has(user.userId)) {
      seenUserIds.add(user.userId);
      usersInRoom.push({
        _id: user.userId,
        id: user.userId,
        username: user.username
      });
    }
  }

  return usersInRoom;
};

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected with socket ID: ${socket.id}`);

    // Join a specific chat room
    socket.on('joinRoom', ({ roomId, userId, username }) => {
      if (!roomId) return;

      // If user was previously in another room, leave it first
      const previousRoom = connectedUsers[socket.id]?.roomId;
      if (previousRoom && previousRoom !== roomId) {
        socket.leave(previousRoom);
        delete connectedUsers[socket.id];
        
        // Notify the previous room of the updated user list
        io.to(previousRoom).emit('onlineUsers', getOnlineUsersInRoom(previousRoom));
      }

      // Join the new room in Socket.io
      socket.join(roomId);

      // Save user session info on the socket mapping
      connectedUsers[socket.id] = { userId, username, roomId };

      // Broadcast the updated online users list to everyone in this room
      io.to(roomId).emit('onlineUsers', getOnlineUsersInRoom(roomId));
    });

    // Handle incoming chat messages
    socket.on('chatMessage', async ({ roomId, senderId, content }) => {
      // Validate that the message has content
      if (!roomId || !senderId || !content || !content.trim()) {
        return;
      }

      try {
        // Save the message to MongoDB so it persists in chat history
        const message = await Message.create({
          room: roomId,
          sender: senderId,
          content: content.trim()
        });

        // Populate sender info (like username) before broadcasting
        await message.populate('sender', 'username');

        // Broadcast the saved message to everyone currently in the room
        io.to(roomId).emit('chatMessage', message);
      } catch (error) {
        console.error('Failed to save and broadcast message:', error.message);
      }
    });

    // Notify other users in the room when someone is typing
    socket.on('typing', ({ roomId, username, isTyping }) => {
      if (!roomId) return;

      // socket.to sends to everyone in the room EXCEPT the sender
      socket.to(roomId).emit('typing', { username, isTyping });
    });

    // Broadcast newly created rooms in real time to all connected clients
    socket.on('createRoom', (newRoom) => {
      if (!newRoom) return;
      // io.emit broadcasts globally to all connected sockets
      io.emit('roomCreated', newRoom);
    });

    // Handle user disconnection (browser close, network drop, etc.)
    socket.on('disconnect', () => {
      const user = connectedUsers[socket.id];

      if (user) {
        const { roomId } = user;
        // Remove user from active tracking
        delete connectedUsers[socket.id];

        // Let remaining room members know the updated online list
        io.to(roomId).emit('onlineUsers', getOnlineUsersInRoom(roomId));
      }

      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = initializeSocket;
