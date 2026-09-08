# NetTalk

A simple real-time chat application built as a full-stack technical assessment project.

## Tech Stack

**Frontend:**
- React (Create React App)
- Material UI (MUI)
- Socket.io Client

**Backend:**
- Node.js
- Express
- Socket.io
- MongoDB / Mongoose

---

## Project Structure

```text
NetTalk/
│
├── frontend/                     # React client application (CRA)
│   ├── public/                   # Static assets and index.html
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── ChatRoom/         # Active room header & message feed
│   │   │   ├── MessageInput/     # Message composer and send action
│   │   │   ├── OnlineUsersList/  # Active online members sidebar list
│   │   │   ├── RoomList/         # Channel / Room navigation
│   │   │   └── TypingIndicator/  # Typing status indicator (Phase 2 foundation)
│   │   ├── pages/
│   │   │   └── ChatPage/         # Main desktop chat page shell
│   │   ├── services/
│   │   │   ├── api.js            # REST API configuration & health client
│   │   │   └── socket.js         # Socket.io client setup
│   │   ├── App.js                # App root with Material UI ThemeProvider
│   │   ├── index.js              # React DOM render entry point
│   │   ├── index.css             # Base reset & font styling
│   │   └── theme.js              # Material UI theme configuration
│   └── package.json
│
├── backend/                      # Express & Socket.io server
│   ├── src/
│   │   ├── config/               # Database and configuration helpers
│   │   ├── controllers/          # Request handlers (e.g., health check)
│   │   ├── models/               # MongoDB Mongoose models (Phase 2)
│   │   ├── routes/               # Express API route definitions
│   │   ├── socket/               # Socket.io connection handlers
│   │   └── server.js             # Main server entry point
│   ├── .env.example              # Environment variables template
│   ├── .env                      # Local environment configuration
│   ├── package.json
│   └── .gitignore
│
├── README.md
└── .gitignore
```

---

## Current Status (Phase 1)

Phase 1 establishes the clean project foundation:
- **Frontend**: A desktop-first Material UI chat shell with custom warm cream/off-white theme, static room navigation, placeholder messages, online users display, and socket/api client scaffolding.
- **Backend**: Express server configuration with CORS, Socket.io initialization, environment variables support, and a `/api/health` status verification route.

> **Note:** Real-time Socket.io events, message persistence with MongoDB, user authentication, and active typing listeners will be implemented in subsequent phases.

---

## Running Locally

### 1. Backend Server

```bash
cd backend
npm install
npm run dev
```

The backend server will start on `http://localhost:5000`. You can verify it with `GET http://localhost:5000/api/health`.

### 2. Frontend Application

```bash
cd frontend
npm install
npm start
```

The React development server will start on `http://localhost:3000`.
