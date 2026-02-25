import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Mail, Github, Linkedin, Heart, Code } from 'lucide-react';

const Footer = () => {
  const { isDark } = useTheme();

  return (
    <footer style={{
      background: isDark 
        ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' 
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '2rem 1rem',
      marginTop: 'auto',
      transition: 'background 0.3s'
    }}>
      <div style={{
        maxWidth: '80rem',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        {/* Developer Info */}
        <div style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem',
            fontWeight: '600'
          }}>
            <Code size={20} />
            <span>Developed by</span>
          </div>
          
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Kushagra Saxena
          </div>

          {/* Contact Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            opacity: 0.9
          }}>
            <Mail size={16} />
            <a 
              href="mailto:kushagrasaxena0913@gmail.com"
              style={{
                color: 'white',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.textDecoration = 'underline';
                e.target.style.color = '#60a5fa';
              }}
              onMouseLeave={(e) => {
                e.target.style.textDecoration = 'none';
                e.target.style.color = 'white';
              }}
            >
              kushagrasaxena0913@gmail.com
            </a>
          </div>

          {/* Social Links */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '0.5rem'
          }}>
            <a
              href="https://github.com/kushagrasaxena"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                color: 'white',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              title="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/kushagra1309/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                color: 'white',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              title="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          width: '100%',
          height: '1px',
          background: 'rgba(255, 255, 255, 0.2)'
        }}></div>

        {/* Copyright & Tech Stack */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem',
          opacity: 0.8,
          textAlign: 'center'
        }}>
          <div>
            © {new Date().getFullYear()} Collaborative Whiteboard. All rights reserved.
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <span>Built with</span>
            <span style={{
              padding: '0.25rem 0.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              React
            </span>
            <span style={{
              padding: '0.25rem 0.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              Node.js
            </span>
            <span style={{
              padding: '0.25rem 0.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              MongoDB
            </span>
            <span style={{
              padding: '0.25rem 0.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              Socket.io
            </span>
            <span style={{
              padding: '0.25rem 0.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              WebRTC
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
