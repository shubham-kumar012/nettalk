# NetTalk

NetTalk is a modern, full-stack, real-time team chat application built for distraction-free communication across dedicated topic rooms. It combines a persistent document database with low-latency bi-directional WebSockets and a clean, responsive user interface.

---

## Live Demo & Deployment

| Service | Platform | URL |
| :--- | :--- | :--- |
| **Frontend Web App** | Vercel | [https://frontend-olive-five-40.vercel.app](https://frontend-olive-five-40.vercel.app) |
| **Backend API** | Render | [https://nettalk-2hsr.onrender.com/api](https://nettalk-2hsr.onrender.com/api) |
| **Backend Health Check** | Render | [https://nettalk-2hsr.onrender.com/api/health](https://nettalk-2hsr.onrender.com/api/health) |

---

## What is NetTalk & Why Was It Built?

### The "What"
NetTalk is a collaborative workspace chat platform where users can create topics/rooms, switch between channels, see who is active in real time, and exchange instant messages backed by database persistence.

### The "Why"
- **Dual-Protocol Efficiency**: Traditional HTTP polling introduces lag and unnecessary overhead, while pure in-memory WebSockets lose conversation history on server restarts. NetTalk uses a **dual-protocol architecture**: REST APIs for initial state/history hydration, and Socket.io WebSockets for instant, low-latency messaging.
- **Room Isolation & Privacy**: Messages and typing indicators sent in `# General` never bleed into `# Developers` or `# Random`. Each channel functions as an isolated broadcast namespace.
- **Persistent Chat History**: Every message is committed to MongoDB before broadcasting, ensuring that new or returning team members immediately see full context.
- **Distraction-Free, Human-Centric UI**: Instead of overwhelming noise, NetTalk uses a custom warm, earthy color palette and a clean layout designed for comfortable extended use.
- **Adaptive Across All Devices**: Full responsiveness with a permanent split-pane layout on desktop and an intuitive sliding drawer on mobile devices.

---

## Key Features

- 💬 **Real-Time Room-Based Chat**: Instant messaging powered by Socket.io with zero-refresh broadcasting.
- 📂 **Multi-Room Channel Navigation**: Seamlessly create and switch between channels with immediate message history hydration.
- 👥 **Dynamic Live Presence**: Real-time tracking of active online members per room with automatic join/leave updates.
- ✍️ **Typing Indicators**: Visual feedback when room participants are composing a message.
- 💾 **Message Persistence**: All conversations are stored in MongoDB with full sender association and timestamps.
- 📱 **Responsive Dual-Mode UI**:
  - **Desktop (≥900px)**: Side-by-side split view with room list, chat stream, and active members sidebar.
  - **Mobile (<900px)**: Compact view with a slide-out navigation drawer accessible via the top app bar.
- 🎨 **Custom Warm Aesthetic**: Custom Material UI theme with warm cream and earthy tones for low eye strain.
- 🛡️ **Validation & Error Handling**: Input sanitization, empty-message prevention, network state recovery, and accessible components.

---

## System Architecture & Data Flow

```text
┌─────────────────────────────────────────────────────────┐
│                    React Frontend Client                │
│                                                         │
│  ┌───────────────────────┐   ┌───────────────────────┐  │
│  │   REST API Services   │   │   Socket.io Client    │  │
│  │      (Axios/Fetch)    │   │ (Real-Time Messaging) │  │
│  └───────────┬───────────┘   └───────────┬───────────┘  │
└──────────────┼───────────────────────────┼──────────────┘
               │ HTTP Requests             │ WebSocket Events
               │ (Initial Load / History)  │ (Live Broadcasts)
               ▼                           ▼
┌─────────────────────────────────────────────────────────┐
│                   Node.js / Express Server              │
│                                                         │
│  ┌───────────────────────┐   ┌───────────────────────┐  │
│  │     REST Routes       │   │  Socket.io Handler    │  │
│  │ (Users, Rooms, Msgs)  │   │  (joinRoom, typing,   │  │
│  │                       │   │   chatMessage, etc.)  │  │
│  └───────────┬───────────┘   └───────────┬───────────┘  │
└──────────────┼───────────────────────────┼──────────────┘
               │                           │
               ▼                           ▼
┌─────────────────────────────────────────────────────────┐
│                  MongoDB Database Layer                 │
│         (Collections: Users, Rooms, Messages)           │
└─────────────────────────────────────────────────────────┘
```

### Real-Time Message Flow
1. User types and submits a message in an active room.
2. Frontend emits `chatMessage` event with `{ roomId, senderId, content }`.
3. Server validates and persists the document into MongoDB.
4. Server populates sender details (`username`, `id`) and broadcasts the message: `io.to(roomId).emit("chatMessage", message)`.
5. All connected clients in that room receive the payload and update their message list immediately.

---

## Tech Stack

### Frontend
- **React.js** (Create React App) — Component-based UI library
- **Material UI (MUI v5)** — Component design system & custom theme engine
- **Socket.io Client** — Client-side WebSocket connection & event subscription
- **Axios** — HTTP client for REST API communication

### Backend
- **Node.js & Express** — REST API endpoints and HTTP server
- **Socket.io** — WebSocket server for room management and real-time broadcasting
- **MongoDB & Mongoose** — Document database & ODM schema modeling
- **Cors & Dotenv** — Cross-origin resource sharing and environment management

---

## Project Structure

```text
NetTalk/
├── frontend/                     # React web client
│   ├── public/                   # Static assets, favicon, & index.html
│   ├── src/
│   │   ├── components/           # Modular UI components
│   │   │   ├── ChatRoom/         # Room header, message feed, & message bubbles
│   │   │   ├── MessageInput/     # Input composer, send action, & typing dispatch
│   │   │   ├── OnlineUsersList/  # Live active room members panel
│   │   │   ├── RoomList/         # Channel switcher & room creation dialog
│   │   │   └── TypingIndicator/  # Animated typing status indicator
│   │   ├── pages/
│   │   │   └── ChatPage/         # Primary container orchestrating state, REST & Sockets
│   │   ├── services/
│   │   │   ├── api.js            # Axios REST API client methods
│   │   │   └── socket.js         # Socket.io connection initialization
│   │   ├── App.js                # Root application with MUI ThemeProvider
│   │   ├── index.js              # DOM entry point
│   │   ├── index.css             # Global CSS reset & typography styles
│   │   └── theme.js              # Custom warm color palette configuration
│   └── package.json
│
├── backend/                      # Node.js Express server
│   ├── src/
│   │   ├── config/               # Database connection configuration
│   │   ├── controllers/          # Business logic for REST endpoints
│   │   │   ├── healthController.js
│   │   │   ├── userController.js
│   │   │   ├── roomController.js
│   │   │   └── messageController.js
│   │   ├── models/               # Mongoose data schemas
│   │   │   ├── User.js           # User schema (username, timestamps)
│   │   │   ├── Room.js           # Chat room schema (name, description)
│   │   │   └── Message.js        # Message schema (room, sender, content)
│   │   ├── routes/               # Express route definitions
│   │   │   ├── healthRoutes.js
│   │   │   ├── users.js
│   │   │   ├── rooms.js
│   │   │   └── messages.js
│   │   ├── socket/
│   │   │   └── socketHandler.js  # Socket.io room lifecycle & event handlers
│   │   └── server.js             # HTTP server setup & startup script
│   ├── .env.example              # Backend environment variables template
│   └── package.json
│
└── README.md                     # Project documentation
```

---

## API & Real-Time Event Reference

### REST Endpoints

#### Health Check
- `GET /api/health` — Returns server health status.

#### Users
- `POST /api/users` — Register / initialize a user session.  
  *Body:* `{"username": "Shubham"}`
- `GET /api/users` — Fetch all registered users.

#### Rooms
- `POST /api/rooms` — Create a new topic room.  
  *Body:* `{"name": "Designers"}`
- `GET /api/rooms` — Fetch list of all existing rooms.

#### Messages
- `POST /api/rooms/:roomId/messages` — Create and store a new message.  
  *Body:* `{"senderId": "<userId>", "content": "Hello team!"}`
- `GET /api/rooms/:roomId/messages` — Fetch full chronological message history for a given room.

---

### Socket.io Real-Time Events

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `joinRoom` | Client ➔ Server | `{ roomId, userId, username }` | Joins a room, leaves prior room, updates online list |
| `chatMessage` | Client ➔ Server | `{ roomId, senderId, content }` | Submits a message to be saved and broadcast |
| `chatMessage` | Server ➔ Client | `Message` object | Broadcasts newly saved message to room members |
| `typing` | Client ➔ Server | `{ roomId, username, isTyping }` | Informs room participants of typing activity |
| `typing` | Server ➔ Client | `{ username, isTyping }` | Broadcasts typing state to other members in room |
| `onlineUsers` | Server ➔ Client | `Array<User>` | Broadcasts updated list of active users in the room |
| `createRoom` | Client ➔ Server | `Room` object | Notifies server of newly created room |
| `roomCreated` | Server ➔ Client | `Room` object | Globally broadcasts new room to all connected clients |
| `disconnect` | Internal | — | Automatically cleans up presence on socket drop |

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (Local database or MongoDB Atlas connection string)

---

### 1. Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create your environment configuration
cp .env.example .env

# 4. Start the backend development server
npm run dev
```

The backend server will start on `http://localhost:5000`. You can verify it is running by checking `http://localhost:5000/api/health`.

---

### 2. Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create your environment configuration
cp .env.example .env

# 4. Start the React development server
npm start
```

The application will automatically launch in your browser at `http://localhost:3000`.

---

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/nettalk
```

### Frontend (`frontend/.env`)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## License

This project is licensed under the MIT License — feel free to use and adapt it for your own projects.

