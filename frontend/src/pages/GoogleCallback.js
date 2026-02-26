import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Google authentication failed');
      navigate('/login');
      return;
    }

    if (token) {
      // Store token and fetch user data
      localStorage.setItem('token', token);
      setAuthData(token);
      toast.success('Successfully logged in with Google!');
      navigate('/dashboard');
    } else {
      toast.error('Authentication failed');
      navigate('/login');
    }
  }, [searchParams, navigate, setAuthData]);

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
        <p style={{ color: 'white', fontSize: '1.125rem' }}>Completing Google sign in...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
