import { io } from 'socket.io-client';

// Socket.io client instance
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false // Connect explicitly when entering chat
});

export default socket;
