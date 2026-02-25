import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hi! 👋 I\'m your Whiteboard assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const botResponses = {
    greeting: [
      'Hello! How can I assist you with the whiteboard today?',
      'Hi there! What would you like to know?',
      'Hey! I\'m here to help you with any questions.'
    ],
    features: [
      'Our whiteboard has amazing features! 🎨\n\n✓ Real-time collaborative drawing\n✓ Multiple drawing tools (pencil, eraser)\n✓ Color picker with custom colors\n✓ Integrated chat system\n✓ User presence indicators\n✓ Room-based collaboration\n✓ Canvas save and download\n✓ Video calling with teammates\n✓ AI Interview Practice Board 🎯\n\nWhat would you like to know more about?'
    ],
    interview: [
      'AI Interview Practice Board! 🎯\n\nPerfect for coding interviews and DSA prep:\n\n✓ Timer mode (30/45/60 min)\n✓ Code editor with multiple languages\n✓ DSA templates (Trees, Graphs, etc.)\n✓ Drawing canvas for diagrams\n✓ Notes panel\n✓ Save sessions as JSON\n✓ Mock interview simulation\n\nIdeal for placement preparation! Access it from the Dashboard.'
    ],
    howToStart: [
      'Getting started is easy! 🚀\n\n1. Click "Get Started" or "Sign In"\n2. Create an account or log in\n3. Go to Dashboard\n4. Choose:\n   • Create/Join Room (collaborative)\n   • Interview Practice (solo prep)\n5. Start drawing and collaborating!\n\nNeed help with any specific step?'
    ],
    rooms: [
      'Rooms are collaborative spaces! 🏠\n\n• Create your own room from the Dashboard\n• Share the Room ID with team members\n• Join existing rooms using Room ID\n• Each room has its own canvas and chat\n• Host can manage room settings\n• Video call with participants\n\nWant to create your first room?'
    ],
    tools: [
      'We have several drawing tools! 🎨\n\n• Pencil - Draw freehand\n• Eraser - Remove drawings\n• Color Picker - Choose any color\n• Brush Size - Adjust thickness\n• Undo/Redo - Fix mistakes\n• Clear Board - Start fresh\n• Download - Save your work\n\nWhich tool interests you?'
    ],
    chat: [
      'The chat feature lets you communicate! 💬\n\n• Real-time messaging\n• See who sent each message\n• Timestamps on all messages\n• Works alongside drawing\n• Notifications for new messages\n\nPerfect for team collaboration!'
    ],
    video: [
      'Video calling feature! 📹\n\n• HD video quality (720p)\n• Real-time audio/video\n• Multiple participants\n• Camera on/off toggle\n• Microphone mute/unmute\n• Expand/collapse view\n• Peer-to-peer connections\n\nCollaborate face-to-face while drawing!'
    ],
    help: [
      'I can help you with:\n\n📌 Features overview\n📌 Getting started guide\n📌 Room management\n📌 Drawing tools\n📌 Chat functionality\n📌 Video calling\n📌 Interview Practice Board 🎯\n📌 Account questions\n📌 Technical support\n\nWhat would you like to know?'
    ],
    default: [
      'I\'m not sure about that. Could you rephrase your question?',
      'Hmm, I didn\'t quite understand. Can you ask in a different way?',
      'I\'m here to help with whiteboard features, getting started, rooms, and tools. What would you like to know?'
    ]
  };

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Greeting patterns
    if (message.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/)) {
      return botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)];
    }
    
    // Features
    if (message.includes('feature') || message.includes('what can') || message.includes('capabilities')) {
      return botResponses.features[0];
    }
    
    // Getting started
    if (message.includes('start') || message.includes('begin') || message.includes('how to use') || message.includes('tutorial')) {
      return botResponses.howToStart[0];
    }
    
    // Rooms
    if (message.includes('room') || message.includes('create') || message.includes('join')) {
      return botResponses.rooms[0];
    }
    
    // Tools
    if (message.includes('tool') || message.includes('draw') || message.includes('pencil') || message.includes('eraser') || message.includes('color')) {
      return botResponses.tools[0];
    }
    
    // Chat
    if (message.includes('chat') || message.includes('message') || message.includes('communicate')) {
      return botResponses.chat[0];
    }
    
    // Video
    if (message.includes('video') || message.includes('call') || message.includes('camera') || message.includes('webcam')) {
      return botResponses.video[0];
    }
    
    // Interview Practice
    if (message.includes('interview') || message.includes('practice') || message.includes('placement') || message.includes('dsa') || message.includes('coding') || message.includes('algorithm')) {
      return botResponses.interview[0];
    }
    
    // Help
    if (message.includes('help') || message.includes('support') || message.includes('assist')) {
      return botResponses.help[0];
    }
    
    // Default response
    return botResponses.default[Math.floor(Math.random() * botResponses.default.length)];
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    // Add user message
    const userMsg = {
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      const botMsg = {
        type: 'bot',
        text: botResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const quickActions = [
    { label: 'Features', message: 'What features do you have?' },
    { label: 'Get Started', message: 'How do I get started?' },
    { label: 'Interview Prep', message: 'Tell me about interview practice' },
    { label: 'Video Call', message: 'How does video calling work?' }
  ];

  return (
    <>
      {/* Chatbot Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s',
            zIndex: 1000,
            animation: 'pulse 2s ease-in-out infinite'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 30px rgba(102, 126, 234, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
          }}
          aria-label="Open chatbot"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '380px',
            maxWidth: 'calc(100vw - 2rem)',
            height: '600px',
            maxHeight: 'calc(100vh - 4rem)',
            background: 'white',
            borderRadius: '1rem',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            animation: 'scaleIn 0.3s ease-out',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'white'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Bot size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
                  Whiteboard Assistant
                </h3>
                <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.9 }}>
                  🟢 Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              aria-label="Close chatbot"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              background: '#f9fafb'
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  animation: 'slideIn 0.3s ease-out'
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    display: 'flex',
                    flexDirection: msg.type === 'user' ? 'row-reverse' : 'row',
                    gap: '0.5rem',
                    alignItems: 'flex-start'
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '50%',
                      background: msg.type === 'bot' 
                        ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                        : '#e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {msg.type === 'bot' ? (
                      <Bot size={16} style={{ color: 'white' }} />
                    ) : (
                      <User size={16} style={{ color: '#6b7280' }} />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div>
                    <div
                      style={{
                        padding: '0.75rem',
                        borderRadius: '0.75rem',
                        background: msg.type === 'bot' ? 'white' : 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: msg.type === 'bot' ? '#111827' : 'white',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        whiteSpace: 'pre-line',
                        fontSize: '0.875rem',
                        lineHeight: '1.5'
                      }}
                    >
                      {msg.text}
                    </div>
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: '#9ca3af',
                        marginTop: '0.25rem',
                        textAlign: msg.type === 'user' ? 'right' : 'left'
                      }}
                    >
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div
                  style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Bot size={16} style={{ color: 'white' }} />
                </div>
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    background: 'white',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    gap: '0.25rem'
                  }}
                >
                  <div className="animate-pulse" style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    borderRadius: '50%',
                    background: '#667eea'
                  }}></div>
                  <div className="animate-pulse" style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    borderRadius: '50%',
                    background: '#667eea',
                    animationDelay: '0.2s'
                  }}></div>
                  <div className="animate-pulse" style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    borderRadius: '50%',
                    background: '#667eea',
                    animationDelay: '0.4s'
                  }}></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderTop: '1px solid #e5e7eb',
                background: 'white'
              }}
            >
              <p style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                margin: '0 0 0.5rem 0'
              }}>
                Quick actions:
              </p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputMessage(action.message);
                      setTimeout(() => {
                        handleSendMessage({ preventDefault: () => {} });
                      }, 100);
                    }}
                    style={{
                      padding: '0.375rem 0.75rem',
                      background: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      color: '#374151',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#667eea';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = '#667eea';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f3f4f6';
                      e.currentTarget.style.color = '#374151';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div
            style={{
              padding: '1rem',
              borderTop: '1px solid #e5e7eb',
              background: 'white'
            }}
          >
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
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
                disabled={!inputMessage.trim()}
                style={{
                  padding: '0.75rem',
                  background: inputMessage.trim() 
                    ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                    : '#e5e7eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: inputMessage.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  minWidth: '2.75rem'
                }}
                onMouseEnter={(e) => {
                  if (inputMessage.trim()) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
