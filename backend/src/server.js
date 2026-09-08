const http = require('http');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

// Route imports
const healthRoutes = require('./routes/healthRoutes');
const userRoutes = require('./routes/users');
const roomRoutes = require('./routes/rooms');
const initializeSocket = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Set up Socket.io with CORS for real-time communication
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

initializeSocket(io);

// API Routes
app.use('/api', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);

// Server listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`NetTalk server running on port ${PORT}`);
});
