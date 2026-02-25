import React from 'react';
import { Users, Crown, User } from 'lucide-react';

const UserList = ({ users, currentUser, hostId }) => {
  const getInitials = (username) => {
    return username
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (username) => {
    const colors = [
      '#ef4444', '#3b82f6', '#10b981', '#eab308',
      '#a855f7', '#ec4899', '#6366f1', '#14b8a6'
    ];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Users size={20} style={{ color: '#6b7280' }} />
          <h3 style={{
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>
            Participants ({users.length})
          </h3>
        </div>
      </div>

      {/* Users List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem'
      }}>
        {users.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#6b7280',
            padding: '2rem 0'
          }}>
            <Users size={48} style={{
              margin: '0 auto 0.5rem',
              opacity: 0.5
            }} />
            <p style={{ margin: 0 }}>No users online</p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {users.map((user) => (
              <div
                key={user.id}
                className="user-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  background: user.id === currentUser?.id ? '#eff6ff' : 'transparent',
                  border: user.id === currentUser?.id ? '1px solid #bfdbfe' : '1px solid transparent',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (user.id !== currentUser?.id) {
                    e.currentTarget.style.background = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (user.id !== currentUser?.id) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {/* Avatar */}
                <div style={{ position: 'relative' }}>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%'
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        backgroundColor: getAvatarColor(user.username)
                      }}
                    >
                      {getInitials(user.username)}
                    </div>
                  )}
                  
                  {/* Online indicator */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-0.125rem',
                    right: '-0.125rem',
                    width: '0.75rem',
                    height: '0.75rem',
                    background: '#10b981',
                    border: '2px solid white',
                    borderRadius: '50%'
                  }}></div>
                </div>

                {/* User Info */}
                <div style={{
                  flex: 1,
                  minWidth: 0
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#111827',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {user.username}
                    </p>
                    {user.id === currentUser?.id && (
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#3b82f6'
                      }}>
                        (You)
                      </span>
                    )}
                  </div>
                  
                  {/* Role indicator */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    marginTop: '0.125rem'
                  }}>
                    {user.id === hostId ? (
                      <>
                        <Crown size={12} style={{ color: '#eab308' }} />
                        <span style={{
                          fontSize: '0.75rem',
                          color: '#6b7280'
                        }}>
                          Host
                        </span>
                      </>
                    ) : (
                      <>
                        <User size={12} style={{ color: '#9ca3af' }} />
                        <span style={{
                          fontSize: '0.75rem',
                          color: '#6b7280'
                        }}>
                          Participant
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Status indicator */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <div style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    background: '#10b981',
                    borderRadius: '50%'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div style={{
          fontSize: '0.75rem',
          color: '#6b7280',
          textAlign: 'center'
        }}>
          {users.length} {users.length === 1 ? 'person' : 'people'} online
        </div>
      </div>
    </div>
  );
};

export default UserList;
