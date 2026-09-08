import { io } from 'socket.io-client';

// Socket.io client setup for real-time communication
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false // Connect manually when entering a room
});

export default socket;
