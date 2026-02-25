import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { roomsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Users, Calendar, ArrowRight, Hash } from 'lucide-react';
import Footer from '../components/Footer';

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomsAPI.getRooms();
      setRooms(response.data.rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) {
      toast.error('Please enter a room name');
      return;
    }

    setCreating(true);
    try {
      const response = await roomsAPI.createRoom(roomName.trim());
      const newRoom = response.data.room;
      toast.success('Room created successfully!');
      setShowCreateModal(false);
      setRoomName('');
      navigate(`/room/${newRoom.roomId}`);
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Failed to create room');
    } finally {
      setCreating(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!joinRoomId.trim()) {
      toast.error('Please enter a room ID');
      return;
    }

    setJoining(true);
    try {
      await roomsAPI.joinRoom(joinRoomId.trim().toUpperCase());
      toast.success('Joined room successfully!');
      setShowJoinModal(false);
      setJoinRoomId('');
      navigate(`/room/${joinRoomId.trim().toUpperCase()}`);
    } catch (error) {
      console.error('Error joining room:', error);
      const message = error.response?.data?.message || 'Failed to join room';
      toast.error(message);
    } finally {
      setJoining(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
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
          <p style={{ color: 'white', fontSize: '1.125rem' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark 
        ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' 
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem 1rem',
      transition: 'background 0.3s'
    }}>
      <div style={{
        maxWidth: '80rem',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '2rem',
          animation: 'fadeInUp 0.6s ease-out'
        }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: '800',
            color: isDark ? '#e5e7eb' : '#111827',
            marginBottom: '0.5rem',
            transition: 'color 0.3s'
          }}>
            Welcome back, {user?.username}! 👋
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: isDark ? '#9ca3af' : '#6b7280',
            transition: 'color 0.3s'
          }}>
            Manage your whiteboard rooms and start collaborating.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          animation: 'fadeInUp 0.6s ease-out 0.1s both'
        }}>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.875rem 1.5rem',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            }}
          >
            <Plus size={20} style={{ marginRight: '0.5rem' }} />
            Create New Room
          </button>
          <button
            onClick={() => setShowJoinModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.875rem 1.5rem',
              background: 'white',
              color: '#667eea',
              border: '2px solid #667eea',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#667eea';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'white';
              e.target.style.color = '#667eea';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <Hash size={20} style={{ marginRight: '0.5rem' }} />
            Join Room
          </button>
          <button
            onClick={() => navigate('/interview-board')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.875rem 1.5rem',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
            }}
          >
            🎯 Interview Practice
          </button>
        </div>

        {/* Rooms Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {rooms.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '4rem 1rem',
              background: 'white',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
              animation: 'scaleIn 0.5s ease-out'
            }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                margin: '0 auto 1rem',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={32} style={{ color: 'white' }} />
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                No rooms yet
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#6b7280',
                marginBottom: '1.5rem'
              }}>
                Create your first room to start collaborating with your team.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Create Room
              </button>
            </div>
          ) : (
            rooms.map((room, index) => (
              <div
                key={room.id}
                className="stagger-item"
                style={{
                  background: isDark ? '#1f2937' : 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: isDark 
                    ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
                    : '0 4px 6px rgba(0, 0, 0, 0.07)',
                  border: '1px solid',
                  borderColor: isDark ? '#374151' : '#e5e7eb',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  animationDelay: `${index * 0.1}s`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = isDark
                    ? '0 20px 40px rgba(102, 126, 234, 0.3)'
                    : '0 20px 40px rgba(102, 126, 234, 0.2)';
                  e.currentTarget.style.borderColor = '#667eea';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = isDark
                    ? '0 4px 6px rgba(0, 0, 0, 0.3)'
                    : '0 4px 6px rgba(0, 0, 0, 0.07)';
                  e.currentTarget.style.borderColor = isDark ? '#374151' : '#e5e7eb';
                }}
                onClick={() => navigate(`/room/${room.roomId}`)}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: isDark ? '#e5e7eb' : '#111827',
                      marginBottom: '0.25rem',
                      transition: 'color 0.3s'
                    }}>
                      {room.name}
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: isDark ? '#9ca3af' : '#6b7280',
                      transition: 'color 0.3s'
                    }}>
                      Room ID: {room.roomId}
                    </p>
                  </div>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: room.isActive ? 'linear-gradient(135deg, #10b981, #059669)' : '#e5e7eb',
                    color: room.isActive ? 'white' : '#6b7280'
                  }}>
                    {room.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.875rem',
                  color: isDark ? '#9ca3af' : '#6b7280',
                  marginBottom: '1rem',
                  gap: '1rem',
                  transition: 'color 0.3s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Users size={16} />
                    <span>{room.participantCount} participants</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={16} />
                    <span>{formatDate(room.updatedAt)}</span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '1rem',
                  borderTop: '1px solid',
                  borderColor: isDark ? '#374151' : '#e5e7eb',
                  transition: 'border-color 0.3s'
                }}>
                  <div style={{
                    fontSize: '0.875rem',
                    color: isDark ? '#9ca3af' : '#6b7280',
                    transition: 'color 0.3s'
                  }}>
                    Host: {room.host.username}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#667eea',
                    fontWeight: '600',
                    fontSize: '0.875rem'
                  }}>
                    Join
                    <ArrowRight size={16} style={{ marginLeft: '0.25rem' }} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={() => setShowCreateModal(false)}
        >
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '90%',
            width: '28rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'scaleIn 0.3s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              color: '#111827'
            }}>
              Create New Room
            </h2>
            <form onSubmit={handleCreateRoom}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Room Name
                </label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  placeholder="Enter room name"
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setRoomName('');
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    background: 'white',
                    color: '#374151',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.background = 'white'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: creating ? 'not-allowed' : 'pointer',
                    opacity: creating ? 0.7 : 1,
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    if (!creating) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoinModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={() => setShowJoinModal(false)}
        >
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '90%',
            width: '28rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'scaleIn 0.3s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              color: '#111827'
            }}>
              Join Room
            </h2>
            <form onSubmit={handleJoinRoom}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Room ID
                </label>
                <input
                  type="text"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    outline: 'none',
                    textTransform: 'uppercase'
                  }}
                  placeholder="Enter room ID"
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowJoinModal(false);
                    setJoinRoomId('');
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    background: 'white',
                    color: '#374151',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.background = 'white'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={joining}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: joining ? 'not-allowed' : 'pointer',
                    opacity: joining ? 0.7 : 1,
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    if (!joining) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {joining ? 'Joining...' : 'Join'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;