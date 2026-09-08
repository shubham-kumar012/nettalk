// Socket.io initialization foundation for NetTalk
// Specific real-time events (join-room, send-message, typing, etc.) will be added in Phase 2

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = initializeSocket;
