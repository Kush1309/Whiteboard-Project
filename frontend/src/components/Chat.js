import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Send, MessageCircle } from 'lucide-react';

const Chat = ({ messages, onSendMessage, currentUser }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      inputRef.current?.focus();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
        borderBottom: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
        background: isDark ? '#374151' : 'white'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <MessageCircle size={20} style={{ color: isDark ? '#9ca3af' : '#6b7280' }} />
          <h3 style={{
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>
            Chat
          </h3>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        {messages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#6b7280',
            padding: '2rem 0'
          }}>
            <MessageCircle size={48} style={{
              margin: '0 auto 0.5rem',
              opacity: 0.5
            }} />
            <p style={{ margin: '0 0 0.25rem 0' }}>No messages yet</p>
            <p style={{
              fontSize: '0.875rem',
              margin: 0
            }}>
              Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className="chat-message"
              style={{
                display: 'flex',
                justifyContent: msg.user === currentUser?.id ? 'flex-end' : 'flex-start'
              }}
            >
              <div
                className="chat-bubble"
                style={{
                  maxWidth: '20rem',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  background: msg.user === currentUser?.id 
                    ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                    : '#f3f4f6',
                  color: msg.user === currentUser?.id ? 'white' : '#111827'
                }}
              >
                {msg.user !== currentUser?.id && (
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    marginBottom: '0.25rem',
                    opacity: 0.75
                  }}>
                    {msg.username}
                  </div>
                )}
                <div style={{ fontSize: '0.875rem' }}>{msg.message}</div>
                <div style={{
                  fontSize: '0.75rem',
                  marginTop: '0.25rem',
                  opacity: 0.75,
                  color: msg.user === currentUser?.id ? 'rgba(255, 255, 255, 0.9)' : '#6b7280'
                }}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid #e5e7eb'
      }}>
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          gap: '0.5rem'
        }}>
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: '0.5rem 0.75rem',
              border: '2px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            maxLength={500}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            type="submit"
            disabled={!message.trim()}
            style={{
              padding: '0.5rem 0.75rem',
              background: message.trim() ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#e5e7eb',
              color: 'white',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: message.trim() ? 'pointer' : 'not-allowed',
              opacity: message.trim() ? 1 : 0.5,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              if (message.trim()) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
