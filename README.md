# Real-Time Collaborative Whiteboard

A full-stack real-time collaborative whiteboard application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Socket.io for real-time synchronization.

## Features

### Core Features
- User Authentication (JWT-based Register/Login/Logout)
- Create and Join Whiteboard Rooms via unique Room ID
- Real-time drawing synchronization using Socket.io
- Canvas tools: Pencil, Eraser, Clear Board
- Color picker and brush size selection
- Room-based multi-user collaboration
- Chat feature inside whiteboard room
- Persistent storage of whiteboard sessions in MongoDB
- Responsive UI using React Hooks

### Intermediate Features
- Undo/Redo functionality
- Save whiteboard snapshot as image
- User presence indicator
- Protected routes
- Role-based permissions (Host/Participant)
- Error handling and validation

### Advanced Features
- Dark/Light mode toggle
- Session management
- File sharing capabilities
- Real-time user cursors

## Tech Stack

- **Frontend**: React.js, Socket.io-client, Canvas API
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Communication**: Socket.io

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd collaborative-whiteboard
```

2. Install dependencies for all parts:
```bash
npm run install-deps
```

3. Environment Setup:
   - Copy `.env.example` to `.env` in the backend folder
   - Update the environment variables with your configuration

4. Start the development servers:
```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend development server (port 3000).

### Environment Variables

Create a `.env` file in the backend directory:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/collaborative-whiteboard
JWT_SECRET=your-jwt-secret-key
CORS_ORIGIN=http://localhost:3000
```

## Project Structure

```
collaborative-whiteboard/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Rooms
- `POST /api/rooms` - Create a new room
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms/:id/join` - Join a room

## Socket Events

### Client to Server
- `join-room` - Join a whiteboard room
- `drawing` - Send drawing data
- `clear-board` - Clear the whiteboard
- `chat-message` - Send chat message

### Server to Client
- `user-joined` - User joined the room
- `user-left` - User left the room
- `drawing` - Receive drawing data
- `board-cleared` - Board was cleared
- `chat-message` - Receive chat message

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.