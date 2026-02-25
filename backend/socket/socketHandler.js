const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Room = require('../models/Room');
const { validateDrawingData, sanitizeChatMessage } = require('../utils/helpers');

// Store active users and their rooms
const activeUsers = new Map();
const roomUsers = new Map();

const socketHandler = (io) => {
  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.username} connected`);
    
    // Store active user
    activeUsers.set(socket.userId, {
      socketId: socket.id,
      user: socket.user,
      currentRoom: null
    });

    // Join room
    socket.on('join-room', async (data) => {
      try {
        const { roomId } = data;
        
        const room = await Room.findOne({ roomId });
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Leave previous room if any
        if (activeUsers.get(socket.userId)?.currentRoom) {
          const prevRoom = activeUsers.get(socket.userId).currentRoom;
          socket.leave(prevRoom);
          updateRoomUsers(prevRoom, socket.userId, 'leave');
        }

        // Join new room
        socket.join(roomId);
        activeUsers.get(socket.userId).currentRoom = roomId;
        updateRoomUsers(roomId, socket.userId, 'join');

        // Send current canvas data to the user
        socket.emit('canvas-data', { canvasData: room.canvasData });
        
        // Send room users to the new user
        const users = getRoomUsers(roomId);
        socket.emit('room-users', { users });
        
        // Notify others about new user
        socket.to(roomId).emit('user-joined', {
          user: {
            id: socket.user._id,
            username: socket.user.username,
            avatar: socket.user.avatar
          }
        });

        // Send updated user list to all users in room
        io.to(roomId).emit('room-users', { users: getRoomUsers(roomId) });

        console.log(`User ${socket.user.username} joined room ${roomId}`);
      } catch (error) {
        console.error('Join room error:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Handle drawing
    socket.on('drawing', async (data) => {
      try {
        const currentRoom = activeUsers.get(socket.userId)?.currentRoom;
        if (!currentRoom) return;

        if (!validateDrawingData(data)) {
          socket.emit('error', { message: 'Invalid drawing data' });
          return;
        }

        // Broadcast drawing to all users in the room except sender
        socket.to(currentRoom).emit('drawing', {
          ...data,
          userId: socket.userId,
          username: socket.user.username
        });

        // Save drawing to database
        await Room.findOneAndUpdate(
          { roomId: currentRoom },
          {
            $push: {
              drawingHistory: {
                action: 'draw',
                data: data,
                user: socket.userId
              }
            }
          }
        );
      } catch (error) {
        console.error('Drawing error:', error);
      }
    });

    // Handle canvas save
    socket.on('save-canvas', async (data) => {
      try {
        const currentRoom = activeUsers.get(socket.userId)?.currentRoom;
        if (!currentRoom) return;

        const { canvasData } = data;
        
        await Room.findOneAndUpdate(
          { roomId: currentRoom },
          { canvasData }
        );

        console.log(`Canvas saved for room ${currentRoom}`);
      } catch (error) {
        console.error('Save canvas error:', error);
      }
    });

    // Handle clear board
    socket.on('clear-board', async () => {
      try {
        const currentRoom = activeUsers.get(socket.userId)?.currentRoom;
        if (!currentRoom) return;

        // Clear canvas data in database
        await Room.findOneAndUpdate(
          { roomId: currentRoom },
          { 
            canvasData: '',
            $push: {
              drawingHistory: {
                action: 'clear',
                data: {},
                user: socket.userId
              }
            }
          }
        );

        // Broadcast clear to all users in the room
        io.to(currentRoom).emit('board-cleared', {
          userId: socket.userId,
          username: socket.user.username
        });

        console.log(`Board cleared in room ${currentRoom} by ${socket.user.username}`);
      } catch (error) {
        console.error('Clear board error:', error);
      }
    });

    // Handle chat messages
    socket.on('chat-message', async (data) => {
      try {
        const currentRoom = activeUsers.get(socket.userId)?.currentRoom;
        if (!currentRoom) return;

        const { message } = data;
        const sanitizedMessage = sanitizeChatMessage(message);
        
        if (!sanitizedMessage) {
          socket.emit('error', { message: 'Invalid message' });
          return;
        }

        const chatMessage = {
          user: socket.userId,
          username: socket.user.username,
          message: sanitizedMessage,
          timestamp: new Date()
        };

        // Save message to database
        await Room.findOneAndUpdate(
          { roomId: currentRoom },
          {
            $push: {
              chatMessages: chatMessage
            }
          }
        );

        // Broadcast message to all users in the room
        io.to(currentRoom).emit('chat-message', chatMessage);

        console.log(`Chat message in room ${currentRoom}: ${socket.user.username}: ${sanitizedMessage}`);
      } catch (error) {
        console.error('Chat message error:', error);
      }
    });

    // Handle cursor movement
    socket.on('cursor-move', (data) => {
      const currentRoom = activeUsers.get(socket.userId)?.currentRoom;
      if (!currentRoom) return;

      socket.to(currentRoom).emit('cursor-move', {
        userId: socket.userId,
        username: socket.user.username,
        x: data.x,
        y: data.y
      });
    });

    // Video call signaling
    socket.on('join-video', (data) => {
      const { roomId, userId } = data;
      socket.to(roomId).emit('user-video-joined', { userId });
      console.log(`User ${socket.user.username} joined video in room ${roomId}`);
    });

    socket.on('leave-video', (data) => {
      const { roomId, userId } = data;
      socket.to(roomId).emit('user-video-left', { userId });
      console.log(`User ${socket.user.username} left video in room ${roomId}`);
    });

    socket.on('video-offer', (data) => {
      const { roomId, offer, targetUserId } = data;
      const targetUser = activeUsers.get(targetUserId);
      if (targetUser) {
        io.to(targetUser.socketId).emit('video-offer', {
          offer,
          fromUserId: socket.userId
        });
      }
    });

    socket.on('video-answer', (data) => {
      const { roomId, answer, targetUserId } = data;
      const targetUser = activeUsers.get(targetUserId);
      if (targetUser) {
        io.to(targetUser.socketId).emit('video-answer', {
          answer,
          fromUserId: socket.userId
        });
      }
    });

    socket.on('ice-candidate', (data) => {
      const { roomId, candidate, targetUserId } = data;
      const targetUser = activeUsers.get(targetUserId);
      if (targetUser) {
        io.to(targetUser.socketId).emit('ice-candidate', {
          candidate,
          fromUserId: socket.userId
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${socket.user.username} disconnected`);
      
      const userData = activeUsers.get(socket.userId);
      if (userData?.currentRoom) {
        const roomId = userData.currentRoom;
        
        // Update room users
        updateRoomUsers(roomId, socket.userId, 'leave');
        
        // Notify others about user leaving
        socket.to(roomId).emit('user-left', {
          user: {
            id: socket.user._id,
            username: socket.user.username
          }
        });

        // Notify video call participants
        socket.to(roomId).emit('user-video-left', { userId: socket.userId });

        // Send updated user list to remaining users
        const users = getRoomUsers(roomId);
        socket.to(roomId).emit('room-users', { users });
      }
      
      // Remove from active users
      activeUsers.delete(socket.userId);
    });
  });

  // Helper functions
  function updateRoomUsers(roomId, userId, action) {
    if (!roomUsers.has(roomId)) {
      roomUsers.set(roomId, new Set());
    }

    const users = roomUsers.get(roomId);
    if (action === 'join') {
      users.add(userId);
    } else if (action === 'leave') {
      users.delete(userId);
      if (users.size === 0) {
        roomUsers.delete(roomId);
      }
    }
  }

  function getRoomUsers(roomId) {
    const userIds = roomUsers.get(roomId) || new Set();
    const users = [];
    
    for (const userId of userIds) {
      const userData = activeUsers.get(userId);
      if (userData) {
        users.push({
          id: userData.user._id,
          username: userData.user.username,
          avatar: userData.user.avatar
        });
      }
    }
    
    return users;
  }
};

module.exports = socketHandler;