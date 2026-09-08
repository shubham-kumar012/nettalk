import { io } from 'socket.io-client';

// Socket.io client configuration foundation
// Real-time event listeners will be attached in Phase 2
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false // Set to false in Phase 1; will connect upon joining in Phase 2
});

export default socket;
