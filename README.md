# NetTalk

NetTalk is a lightweight, real-time team chat application designed for simple and distraction-free communication across multiple topic rooms.

Built with a **Node.js/Express** backend and a **React + Material UI** frontend, the project emphasizes a clean, modular structure, responsive desktop design, and scalable real-time communication using **Socket.io**.

---

## Features (Current & Roadmap)

- **Desktop-first Chat Layout**: Clean side-by-side interface with channel navigation, active members list, and conversation feed.
- **Custom Warm Visual Theme**: Designed with an understated, warm cream/earthy color palette for comfortable long-form reading without eye strain.
- **Room-based Navigation**: Switch seamlessly between channels like `# General`, `# Developers`, and `# Random`.
- **Active Presence & Typing Indicators**: Visual cues for online team members and real-time typing status.
- **Modular Component Architecture**: Decoupled UI components, MongoDB data models, and service layers for easy maintenance and testing.

---

## Tech Stack

### Frontend
- **React.js** (Create React App)
- **Material UI (MUI)** — Component library & customized theme system
- **Socket.io Client** — Real-time event communication

### Backend
- **Node.js & Express** — REST API & HTTP server
- **Socket.io** — Bi-directional WebSocket communication foundation
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
│   │   │   ├── ChatRoom/         # Room header & message feed
│   │   │   ├── MessageInput/     # Message composer with send button
│   │   │   ├── OnlineUsersList/  # Active online members list
│   │   │   ├── RoomList/         # Channels & room navigation
│   │   │   └── TypingIndicator/  # Typing feedback component
│   │   ├── pages/
│   │   │   └── ChatPage/         # Main chat container shell
│   │   ├── services/
│   │   │   ├── api.js            # REST API client & health check
│   │   │   └── socket.js         # Socket.io connection setup
│   │   ├── App.js                # App entry with MUI ThemeProvider
│   │   ├── index.js              # DOM root mount
│   │   ├── index.css             # Base reset & typography styling
│   │   └── theme.js              # Custom warm color palette configuration
│   └── package.json
│
├── backend/                      # Node.js Express server
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js             # MongoDB connection setup
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
│   │   ├── socket/               # Socket connection handlers
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

## Phase 2 Implementation

Phase 2 introduces the MongoDB database layer, data modeling, validation, and REST APIs for user identities, room channels, and chat message history:

**Implemented:**
- **MongoDB Connection**: Direct Mongoose database connection setup in `backend/src/config/db.js`.
- **User Model**: Mongoose schema supporting unique, trimmed `username` and timestamps.
- **Room Model**: Mongoose schema supporting unique, trimmed room `name` and timestamps.
- **Message Model**: Schema referencing `Room` and `User` with message content validation and chronological sorting.
- **User APIs**: User creation and listing endpoints.
- **Room APIs**: Room channel creation and listing endpoints.
- **Message / Chat History APIs**: Fetching populated message histories per room and message storage in MongoDB.
- **Basic Validation**: Prevention of empty inputs, duplicate usernames/rooms, and invalid ID handling.

> *Note: Real-time Socket.io events (e.g. `joinRoom`, `sendMessage`, `typing`) will be wired in Phase 3.*

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
MONGO_URI=mongodb://localhost:27017/nettalk
```
