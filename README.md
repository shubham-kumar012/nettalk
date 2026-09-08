# NetTalk

NetTalk is a lightweight, real-time team chat application designed for simple and distraction-free communication across multiple topic rooms.

Built with a **Node.js/Express** backend and a **React + Material UI** frontend, the project emphasizes a clean, modular structure, responsive desktop design, and scalable real-time communication using **Socket.io**.

---

## Features (Current & Roadmap)

- **Desktop-first Chat Layout**: Clean side-by-side interface with channel navigation, active members list, and conversation feed.
- **Custom Warm Visual Theme**: Designed with an understated, warm cream/earthy color palette for comfortable long-form reading without eye strain.
- **Room-based Navigation**: Switch seamlessly between channels like `# General`, `# Developers`, and `# Random`.
- **Active Presence & Typing Indicators**: Visual cues for online team members and real-time typing status.
- **Modular Component Architecture**: Decoupled UI components and service layers for easy maintenance and testing.

---

## Tech Stack

### Frontend
- **React.js** (Create React App)
- **Material UI (MUI)** — Component library & customized theme system
- **Socket.io Client** — Real-time event communication

### Backend
- **Node.js & Express** — REST API & HTTP server
- **Socket.io** — Bi-directional WebSocket communication
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
│   │   ├── config/               # Database and server config
│   │   ├── controllers/          # API route controllers
│   │   ├── models/               # Mongoose data models
│   │   ├── routes/               # Express route declarations
│   │   ├── socket/               # Socket connection and event handlers
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

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/)

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

## Development Notes

- **Backend Health Check**: `GET /api/health` returns server status and timestamp.
- **Environment Variables**: Configure port and database strings in `backend/.env` (reference `backend/.env.example`).
