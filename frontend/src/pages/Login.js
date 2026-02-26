import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, user, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    const result = await login(formData.email, formData.password);
    if (result.success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        maxWidth: '28rem',
        width: '100%',
        background: 'white',
        borderRadius: '1rem',
        padding: '2.5rem',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        animation: 'scaleIn 0.3s ease-out'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Sign in to your account
          </h2>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            Or{' '}
            <Link
              to="/register"
              style={{
                fontWeight: '600',
                color: '#667eea',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.target.style.color = '#5568d3'}
              onMouseLeave={(e) => e.target.style.color = '#667eea'}
            >
              create a new account
            </Link>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="email" style={{ display: 'none' }}>Email address</label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '0.75rem',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}>
                <Mail size={20} style={{ color: '#9ca3af' }} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                  outline: 'none'
                }}
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
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
          </div>
          
          <div>
            <label htmlFor="password" style={{ display: 'none' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '0.75rem',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}>
                <Lock size={20} style={{ color: '#9ca3af' }} />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 2.75rem 0.75rem 2.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                  outline: 'none'
                }}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
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
                type="button"
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '0.75rem',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} style={{ color: '#9ca3af' }} />
                ) : (
                  <Eye size={20} style={{ color: '#9ca3af' }} />
                )}
              </button>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {loading ? (
                <div className="animate-spin" style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  border: '2px solid white',
                  borderTopColor: 'transparent',
                  borderRadius: '50%'
                }}></div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div style={{
            marginTop: '1.5rem',
            position: 'relative',
            textAlign: 'center'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              background: '#e5e7eb'
            }}></div>
            <span style={{
              position: 'relative',
              background: 'white',
              padding: '0 1rem',
              color: '#6b7280',
              fontSize: '0.875rem'
            }}>
              Or continue with
            </span>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <a
              href={`${process.env.REACT_APP_SERVER_URL || 'http://localhost:5000'}/api/auth/google`}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'white',
                color: '#374151',
                border: '2px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M19.8055 10.2292C19.8055 9.55156 19.7501 8.86719 19.6323 8.19531H10.2002V12.0492H15.6014C15.3776 13.2911 14.6798 14.3898 13.6573 15.0875V17.5867H16.8589C18.6953 15.8828 19.8055 13.2911 19.8055 10.2292Z" fill="#4285F4"/>
                <path d="M10.2002 20.0008C12.9527 20.0008 15.2709 19.1039 16.8659 17.5867L13.6643 15.0875C12.8082 15.6977 11.7044 16.0422 10.2072 16.0422C7.54687 16.0422 5.29375 14.3242 4.52734 11.9766H1.22656V14.5633C2.85547 17.8023 6.34375 20.0008 10.2002 20.0008Z" fill="#34A853"/>
                <path d="M4.52031 11.9766C4.07812 10.7347 4.07812 9.37344 4.52031 8.13125V5.54453H1.22656C-0.0976562 8.08281 -0.0976562 11.0266 1.22656 13.5648L4.52031 11.9766Z" fill="#FBBC04"/>
                <path d="M10.2002 3.95781C11.7741 3.93281 13.2991 4.53906 14.4441 5.64844L17.2827 2.81016C15.1827 0.842188 12.4373 -0.230469 10.2002 -0.199219C6.34375 -0.199219 2.85547 2.00625 1.22656 5.24531L4.52031 7.83203C5.27969 5.47734 7.53984 3.95781 10.2002 3.95781Z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;