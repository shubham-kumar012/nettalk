// Base API helper functions for backend endpoints
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Health check endpoint
export const checkHealth = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return await response.json();
};

// User endpoints
export const getUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`);
  return await response.json();
};

export const createUser = async (username) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
  return await response.json();
};

// Rooms API
export const getRooms = async () => {
  const response = await fetch(`${API_BASE_URL}/rooms`);
  return await response.json();
};

export const createRoom = async (name) => {
  const response = await fetch(`${API_BASE_URL}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  return await response.json();
};

// Messages API
export const getMessages = async (roomId) => {
  const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/messages`);
  return await response.json();
};

export const createMessage = async (roomId, senderId, content) => {
  const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ senderId, content })
  });
  return await response.json();
};

export default {
  API_BASE_URL,
  checkHealth,
  getUsers,
  createUser,
  getRooms,
  createRoom,
  getMessages,
  createMessage
};
