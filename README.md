# NetTalk

NetTalk is a lightweight, real-time team chat application designed for simple and distraction-free communication across multiple topic rooms.

Built with a **Node.js/Express** backend and a **React + Material UI** frontend, the project emphasizes a clean, modular structure, responsive desktop design, and scalable real-time communication using **Socket.io**.

---

## Features

- **Desktop-first Chat Layout**: Clean side-by-side interface with channel navigation, active members list, and conversation feed.
- **Custom Warm Visual Theme**: Designed with an understated, warm cream/earthy color palette for comfortable reading without eye strain.
- **Room-based Real-Time Communication**: Switch seamlessly between channels like `# General`, `# Developers`, and `# Random`.
- **Instant Messaging & Broadcasting**: Messages are saved to MongoDB and broadcasted in real-time to active room members via Socket.io.
- **Room Isolation**: Messages sent in one room are delivered strictly to users in that room.
- **Active Presence**: Dynamic online users list showing connected members per room with status indicators.
- **Typing Indicator**: Real-time feedback when another participant is typing.
- **Persistent Chat History**: Previous room messages are loaded from MongoDB upon joining a channel.
- **Modular Component Architecture**: Decoupled UI components, MongoDB data models, and service layers for easy maintenance and testing.

---

## Tech Stack

### Frontend
- **React.js** (Create React App)
- **Material UI (MUI)** — Component library & customized theme system
- **Socket.io Client** — Real-time bi-directional WebSocket communication

### Backend
- **Node.js & Express** — REST API & HTTP server
- **Socket.io** — Real-time event communication engine
- **MongoDB & Mongoose** — Document database & data modeling
- **Cors & Dotenv** — Middleware configuration and environment management

---

## Project Structure

```text
NetTalk/
│
├── frontend/                     # React web client
│   ├── public/                   # Static HTML template & web manifest
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── ChatRoom/         # Room header & scrollable message feed
│   │   │   ├── MessageInput/     # Message composer with send button & typing trigger
│   │   │   ├── OnlineUsersList/  # Active online members list
│   │   │   ├── RoomList/         # Channels list & room creation dialog
│   │   │   └── TypingIndicator/  # Active typing status component
│   │   ├── pages/
│   │   │   └── ChatPage/         # Main chat container connecting Socket.io & REST
│   │   ├── services/
│   │   │   ├── api.js            # REST API client helper
│   │   │   └── socket.js         # Socket.io connection setup
│   │   ├── App.js                # App entry with MUI ThemeProvider
│   │   ├── index.js              # DOM root mount
│   │   ├── index.css             # Base reset & typography styling
│   │   └── theme.js              # Custom warm color palette configuration
│   └── package.json
│
├── backend/                      # Node.js Express server
│   ├── src/
│   │   ├── config/               # Database and server config
│   │   ├── controllers/          # API route controllers
│   │   │   ├── healthController.js
│   │   │   ├── userController.js
│   │   │   ├── roomController.js
│   │   │   └── messageController.js
│   │   ├── models/               # Mongoose data models
│   │   │   ├── User.js
│   │   │   ├── Room.js
│   │   │   └── Message.js
│   │   ├── routes/               # Express route declarations
│   │   │   ├── healthRoutes.js
│   │   │   ├── users.js
│   │   │   ├── rooms.js
│   │   │   └── messages.js
│   │   ├── socket/               # Socket.io connection & event handlers
│   │   └── server.js             # Server entry point
│   ├── .env.example              # Environment variables template
│   ├── .env                      # Local environment settings
│   ├── package.json
│   └── .gitignore
│
├── README.md
└── .gitignore
```

---

## Phase 3 — Real-Time Chat with Socket.io

Phase 3 connects the React frontend, Express backend, and MongoDB database using Socket.io for live communication:

- **Socket.io Connection**: Persistent WebSocket connection with automatic reconnection.
- **Joining Chat Rooms (`joinRoom`)**: Users join specific room channels and leave previous ones.
- **Real-Time Messaging (`chatMessage`)**: Messages sent by any user are instantly delivered to all participants in the active room.
- **MongoDB Message Persistence**: Every message is stored in MongoDB before broadcast, preserving full chat history.
- **Room-Based Isolation**: Messages and notifications in `# General` do not leak into `# Developers` or other rooms.
- **Live Online Users (`onlineUsers`)**: In-memory tracking of currently connected sockets per room with instant join/leave updates.
- **Typing Indicator (`typing`)**: Lightweight typing status notification that clears automatically on send or inactivity.
- **Chat History Loading**: REST API (`GET /api/rooms/:roomId/messages`) loads stored conversation history upon entering any room.
- **Room Switching**: Seamlessly switches channels, loads past history, and updates online members without page reloads.

### Real-Time Socket.io Flow

```text
User types message
        ↓
socket.emit("chatMessage", { roomId, senderId, content })
        ↓
Server receives message & saves it to MongoDB
        ↓
Server broadcasts: io.to(roomId).emit("chatMessage", savedMessage)
        ↓
Connected room participants receive message & update UI instantly
```

---

## API Documentation

### Health Check
- `GET /api/health` — Verify backend server status

### Users
- `POST /api/users` — Create a new user identity  
  *Body:* `{"username": "Shubham"}`
- `GET /api/users` — Get all users

### Rooms
- `POST /api/rooms` — Create a new chat room  
  *Body:* `{"name": "Developers"}`
- `GET /api/rooms` — Get all chat rooms

### Messages
- `POST /api/rooms/:roomId/messages` — Create and store a new message in a room  
  *Body:* `{"senderId": "<userId>", "content": "Hello everyone!"}`
- `GET /api/rooms/:roomId/messages` — Get chronological chat history for a room (with populated sender info)

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)

---

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The backend server will run on `http://localhost:5000`.  
You can test the server status by opening `http://localhost:5000/api/health`.

---

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The application will open in your browser at `http://localhost:3000`.

---

## Environment Variables

Create `backend/.env` based on `backend/.env.example`:

```env
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/nettalk
```
