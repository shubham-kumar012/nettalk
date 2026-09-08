const http = require('http');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

// Route imports
const healthRoutes = require('./routes/healthRoutes');
const initializeSocket = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Initialize Socket.io server foundation
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

initializeSocket(io);

// API Routes
app.use('/api', healthRoutes);

// Server listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`NetTalk server running on port ${PORT}`);
});
