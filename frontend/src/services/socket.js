import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket;
    }

    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
    
    this.socket = io(serverUrl, {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Room events
  joinRoom(roomId) {
    if (this.socket) {
      this.socket.emit('join-room', { roomId });
    }
  }

  leaveRoom(roomId) {
    if (this.socket) {
      this.socket.emit('leave-room', { roomId });
    }
  }

  // Drawing events
  sendDrawing(drawingData) {
    if (this.socket) {
      this.socket.emit('drawing', drawingData);
    }
  }

  saveCanvas(canvasData) {
    if (this.socket) {
      this.socket.emit('save-canvas', { canvasData });
    }
  }

  clearBoard() {
    if (this.socket) {
      this.socket.emit('clear-board');
    }
  }

  // Chat events
  sendChatMessage(message) {
    if (this.socket) {
      this.socket.emit('chat-message', { message });
    }
  }

  // Cursor events
  sendCursorMove(x, y) {
    if (this.socket) {
      this.socket.emit('cursor-move', { x, y });
    }
  }

  // Event listeners
  onDrawing(callback) {
    if (this.socket) {
      this.socket.on('drawing', callback);
    }
  }

  onCanvasData(callback) {
    if (this.socket) {
      this.socket.on('canvas-data', callback);
    }
  }

  onBoardCleared(callback) {
    if (this.socket) {
      this.socket.on('board-cleared', callback);
    }
  }

  onChatMessage(callback) {
    if (this.socket) {
      this.socket.on('chat-message', callback);
    }
  }

  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on('user-joined', callback);
    }
  }

  onUserLeft(callback) {
    if (this.socket) {
      this.socket.on('user-left', callback);
    }
  }

  onRoomUsers(callback) {
    if (this.socket) {
      this.socket.on('room-users', callback);
    }
  }

  onCursorMove(callback) {
    if (this.socket) {
      this.socket.on('cursor-move', callback);
    }
  }

  onError(callback) {
    if (this.socket) {
      this.socket.on('error', callback);
    }
  }

  // Remove event listeners
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

const socketService = new SocketService();

export default socketService;