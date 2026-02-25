import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Palette, Users, MessageCircle, Zap, Shield, Globe } from 'lucide-react';
import Footer from '../components/Footer';

const Home = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();

  const features = [
    {
      icon: <Palette className="w-8 h-8 text-blue-600" />,
      title: 'Real-time Drawing',
      description: 'Draw collaboratively with multiple users in real-time using various tools and colors.'
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: 'Multi-user Collaboration',
      description: 'Create or join rooms and collaborate with team members seamlessly.'
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-purple-600" />,
      title: 'Integrated Chat',
      description: 'Communicate with your team while working on the whiteboard.'
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: 'Instant Sync',
      description: 'All changes are synchronized instantly across all connected users.'
    },
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: 'Secure Rooms',
      description: 'Protected rooms with authentication and role-based permissions.'
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-600" />,
      title: 'Interview Practice',
      description: 'AI-powered interview board with DSA templates, timer, and code editor for placement prep.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero-section" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '5rem 1rem',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1
      }}>
        <div style={{ 
          maxWidth: '80rem', 
          margin: '0 auto', 
          padding: '0 1rem',
          width: '100%',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{ 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: '800',
              color: 'white',
              marginBottom: '1.5rem',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              animation: 'fadeInUp 0.8s ease-out',
              lineHeight: '1.2',
              textAlign: 'center'
            }}>
              Collaborative
              <span style={{ 
                display: 'block', 
                color: '#60a5fa',
                marginTop: '0.5rem'
              }}>
                Whiteboard
              </span>
            </h1>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: '2rem',
              maxWidth: '600px',
              margin: '0 auto 2rem',
              animation: 'fadeInUp 0.8s ease-out 0.2s both',
              lineHeight: '1.6',
              textAlign: 'center',
              padding: '0 1rem'
            }}>
              Real-time collaborative whiteboard application built with MERN stack. 
              Draw, chat, and collaborate with your team in real-time.
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '1rem',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginTop: '1rem'
            }}>
              {user ? (
                <Link
                  to="/dashboard"
                  style={{
                    padding: '0.875rem 2.5rem',
                    background: 'white',
                    color: '#667eea',
                    borderRadius: '0.75rem',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    fontSize: '1.125rem',
                    display: 'inline-block',
                    cursor: 'pointer',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }}
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    style={{
                      padding: '0.875rem 2.5rem',
                      background: 'white',
                      color: '#667eea',
                      borderRadius: '0.75rem',
                      fontWeight: '600',
                      textDecoration: 'none',
                      transition: 'all 0.3s',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      fontSize: '1.125rem',
                      display: 'inline-block',
                      cursor: 'pointer',
                      border: 'none',
                      userSelect: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    }}
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    style={{
                      padding: '0.875rem 2.5rem',
                      background: 'transparent',
                      color: 'white',
                      border: '2px solid white',
                      borderRadius: '0.75rem',
                      fontWeight: '600',
                      textDecoration: 'none',
                      transition: 'all 0.3s',
                      fontSize: '1.125rem',
                      display: 'inline-block',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.color = '#667eea';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ 
        padding: '5rem 1rem', 
        background: isDark ? '#111827' : 'white',
        width: '100%',
        transition: 'background 0.3s'
      }}>
        <div style={{ 
          maxWidth: '80rem', 
          margin: '0 auto', 
          padding: '0 1rem',
          width: '100%'
        }}>
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '4rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: '700',
              color: isDark ? '#e5e7eb' : '#111827',
              marginBottom: '1rem',
              textAlign: 'center',
              transition: 'color 0.3s'
            }}>
              Powerful Features
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.125rem)',
              color: isDark ? '#9ca3af' : '#6b7280',
              maxWidth: '42rem',
              margin: '0 auto',
              textAlign: 'center',
              lineHeight: '1.6',
              transition: 'color 0.3s'
            }}>
              Everything you need for effective team collaboration and visual communication.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            width: '100%',
            justifyItems: 'center'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card stagger-item"
                style={{
                  padding: '2rem',
                  background: isDark ? '#1f2937' : 'white',
                  borderRadius: '1rem',
                  boxShadow: isDark 
                    ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
                    : '0 4px 6px rgba(0, 0, 0, 0.07)',
                  transition: 'all 0.3s',
                  border: '1px solid',
                  borderColor: isDark ? '#374151' : '#e5e7eb',
                  animationDelay: `${index * 0.1}s`,
                  width: '100%',
                  maxWidth: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  cursor: 'default',
                  userSelect: 'none'
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
              >
                <div style={{ 
                  marginBottom: '1rem',
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: isDark ? '#e5e7eb' : '#111827',
                  marginBottom: '0.75rem',
                  transition: 'color 0.3s'
                }}>
                  {feature.title}
                </h3>
                <p style={{ 
                  color: isDark ? '#9ca3af' : '#6b7280',
                  lineHeight: '1.6',
                  fontSize: '0.95rem',
                  transition: 'color 0.3s'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;