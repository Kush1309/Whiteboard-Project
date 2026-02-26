import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { roomsAPI } from '../services/api';
import socketService from '../services/socket';
import toast from 'react-hot-toast';
import Canvas from '../components/Canvas';
import Toolbar from '../components/Toolbar';
import Chat from '../components/Chat';
import UserList from '../components/UserList';
import VideoCall from '../components/VideoCall';
import VoiceToText from '../components/VoiceToText';
import { ArrowLeft, Users, MessageCircle, Mic } from 'lucide-react';

const Whiteboard = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { isDark } = useTheme();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showVoiceToText, setShowVoiceToText] = useState(false);
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const initializeRoom = async () => {
      try {
        // Fetch room details
        const response = await roomsAPI.getRoom(roomId);
        setRoom(response.data.room);
        setMessages(response.data.room.chatMessages || []);

        // Connect to socket
        socketService.connect(token);
        
        // Set up socket event listeners
        setupSocketListeners();
        
        // Join the room
        socketService.joinRoom(roomId);
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing room:', error);
        toast.error('Failed to join room');
        navigate('/dashboard');
      }
    };

    initializeRoom();

    return () => {
      socketService.disconnect();
    };
  }, [roomId, token, navigate]);

  const setupSocketListeners = () => {
    // Remove existing listeners first to prevent duplicates
    socketService.off('canvas-data');
    socketService.off('drawing');
    socketService.off('board-cleared');
    socketService.off('chat-message');
    socketService.off('user-joined');
    socketService.off('user-left');
    socketService.off('room-users');
    socketService.off('error');
    
    socketService.onCanvasData((data) => {
      if (canvasRef.current && data.canvasData) {
        canvasRef.current.loadCanvas(data.canvasData);
      }
    });

    socketService.onDrawing((data) => {
      if (canvasRef.current) {
        canvasRef.current.handleRemoteDrawing(data);
      }
    });

    socketService.onBoardCleared(() => {
      if (canvasRef.current) {
        canvasRef.current.clearCanvas();
      }
      toast.success('Board cleared by another user');
    });

    socketService.onChatMessage((message) => {
      setMessages(prev => {
        // Check if message already exists to prevent duplicates
        const exists = prev.some(m => 
          m.timestamp === message.timestamp && 
          m.user === message.user && 
          m.message === message.message
        );
        if (exists) return prev;
        return [...prev, message];
      });
    });

    socketService.onUserJoined((data) => {
      toast.success(`${data.user.username} joined the room`);
    });

    socketService.onUserLeft((data) => {
      toast.success(`${data.user.username} left the room`);
    });

    socketService.onRoomUsers((data) => {
      setUsers(data.users);
    });

    socketService.onError((error) => {
      toast.error(error.message);
    });

    // Connection status
    if (socketService.socket) {
      socketService.socket.off('connect');
      socketService.socket.off('disconnect');
      
      socketService.socket.on('connect', () => {
        setConnected(true);
        toast.success('Connected to room');
      });

      socketService.socket.on('disconnect', () => {
        setConnected(false);
        toast.error('Disconnected from room');
      });
    }
  };

  const handleDrawing = (drawingData) => {
    socketService.sendDrawing(drawingData);
  };

  const handleSaveCanvas = (canvasData) => {
    socketService.saveCanvas(canvasData);
  };

  const handleClearBoard = () => {
    if (window.confirm('Are you sure you want to clear the board? This action cannot be undone.')) {
      socketService.clearBoard();
      if (canvasRef.current) {
        canvasRef.current.clearCanvas();
      }
    }
  };

  const handleSendMessage = (message) => {
    socketService.sendChatMessage(message);
  };

  const handleDownloadCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.downloadCanvas();
    }
  };

  const handleUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  };

  const handleRedo = () => {
    if (canvasRef.current) {
      canvasRef.current.redo();
    }
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin" style={{
            width: '3rem',
            height: '3rem',
            border: '4px solid white',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: 'white', fontSize: '1.125rem' }}>Loading room...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'white', fontSize: '1.25rem', marginBottom: '1rem' }}>Room not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: isDark ? '#1f2937' : '#f3f4f6',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '0.75rem 1rem',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '0.5rem',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: 'white',
                margin: 0
              }}>
                {room.name}
              </h1>
              <p style={{
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: 0
              }}>
                Room ID: {room.roomId} • {connected ? '🟢 Connected' : '🔴 Disconnected'}
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <button
              onClick={() => setShowUsers(!showUsers)}
              style={{
                padding: '0.5rem',
                background: showUsers ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.target.style.background = showUsers ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)'}
            >
              <Users size={20} />
            </button>
            <button
              onClick={() => setShowChat(!showChat)}
              style={{
                padding: '0.5rem',
                background: showChat ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.target.style.background = showChat ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)'}
            >
              <MessageCircle size={20} />
            </button>
            <button
              onClick={() => setShowVoiceToText(true)}
              style={{
                padding: '0.5rem',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
              title="Voice to Text"
            >
              <Mic size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Toolbar */}
        <div style={{
          background: 'white',
          borderRight: '1px solid #e5e7eb',
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.05)'
        }}>
          <Toolbar
            tool={tool}
            setTool={setTool}
            color={color}
            setColor={setColor}
            brushSize={brushSize}
            setBrushSize={setBrushSize}
            onClear={handleClearBoard}
            onDownload={handleDownloadCanvas}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={canvasRef.current?.canUndo?.() || false}
            canRedo={canvasRef.current?.canRedo?.() || false}
          />
        </div>

        {/* Canvas Area */}
        <div style={{
          flex: 1,
          position: 'relative',
          background: 'white',
          minHeight: 0,
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}>
            <Canvas
              ref={canvasRef}
              tool={tool}
              color={color}
              brushSize={brushSize}
              onDrawing={handleDrawing}
              onSave={handleSaveCanvas}
            />
          </div>
        </div>

        {/* Side Panels */}
        {showUsers && (
          <div style={{
            width: '16rem',
            background: 'white',
            borderLeft: '1px solid #e5e7eb',
            boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.05)',
            animation: 'slideInRight 0.3s ease-out'
          }}>
            <UserList users={users} currentUser={user} hostId={room?.host?.id} />
          </div>
        )}

        {showChat && (
          <div style={{
            width: '20rem',
            background: 'white',
            borderLeft: '1px solid #e5e7eb',
            boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.05)',
            animation: 'slideInRight 0.3s ease-out'
          }}>
            <Chat
              messages={messages}
              onSendMessage={handleSendMessage}
              currentUser={user}
            />
          </div>
        )}
      </div>

      {/* Voice to Text Component */}
      <VoiceToText
        isOpen={showVoiceToText}
        onClose={() => setShowVoiceToText(false)}
        onTextGenerated={(text) => {
          // Add text to canvas or chat
          socketService.sendChatMessage(`🎤 Voice: ${text}`);
        }}
      />

      {/* Video Call Component */}
      <VideoCall roomId={roomId} currentUser={user} users={users} />
    </div>
  );
};

export default Whiteboard;