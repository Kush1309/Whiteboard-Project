import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const VoiceToText = ({ onTextGenerated, isOpen, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const recognitionRef = useRef(null);
  const restartTimeoutRef = useRef(null);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      setErrorMessage('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    // Check if running on HTTPS or localhost
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isSecure = window.location.protocol === 'https:';
    
    if (!isLocalhost && !isSecure) {
      setIsSupported(false);
      setErrorMessage('Voice recognition requires localhost. Please access via http://localhost:3000 instead of IP address.');
      return;
    }

    // Initialize Speech Recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Changed to false for better stability
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Voice recognition started');
      setIsListening(true);
      setErrorMessage('');
    };

    recognition.onresult = (event) => {
      let interimText = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcriptPiece + ' ';
        } else {
          interimText += transcriptPiece;
        }
      }

      if (finalText) {
        setTranscript(prev => prev + finalText);
        setInterimTranscript('');
        // Auto-restart for continuous listening
        if (isListening) {
          restartTimeoutRef.current = setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.log('Recognition already started');
            }
          }, 100);
        }
      } else {
        setInterimTranscript(interimText);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'no-speech') {
        // Auto-restart on no-speech
        if (isListening) {
          restartTimeoutRef.current = setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.log('Recognition already started');
            }
          }, 100);
        }
        return;
      }
      
      setIsListening(false);
      
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setErrorMessage('Microphone access denied. Please allow microphone access in browser settings.');
        toast.error('Microphone access denied');
      } else if (event.error === 'network') {
        setErrorMessage('Network error. Please ensure: 1) Internet is connected 2) Using http://localhost:3000 3) Browser can access internet');
        toast.error('Network error - Check internet connection');
      } else if (event.error === 'audio-capture') {
        setErrorMessage('No microphone detected. Please connect a microphone and try again.');
        toast.error('No microphone found');
      } else if (event.error === 'service-not-allowed') {
        setErrorMessage('Speech service blocked. Use http://localhost:3000 (not IP address).');
        toast.error('Service not allowed');
      } else if (event.error === 'aborted') {
        // Silently handle aborted
        return;
      } else {
        setErrorMessage(`Error: ${event.error}`);
        toast.error(`Error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      console.log('Voice recognition ended');
      // Only set to false if we're not trying to restart
      if (!restartTimeoutRef.current) {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Recognition already stopped');
        }
      }
    };
  }, [isListening]);

  const startListening = async () => {
    if (!isSupported) {
      toast.error('Speech recognition is not supported');
      return;
    }

    // Request microphone permission first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the test stream
      
      if (recognitionRef.current && !isListening) {
        try {
          setErrorMessage('');
          recognitionRef.current.start();
          toast.success('🎤 Listening... Speak now!');
        } catch (error) {
          console.error('Error starting recognition:', error);
          if (error.name === 'InvalidStateError') {
            // Already running, stop and restart
            recognitionRef.current.stop();
            setTimeout(() => {
              recognitionRef.current.start();
            }, 100);
          } else {
            setErrorMessage('Failed to start voice recognition');
            toast.error('Failed to start');
          }
        }
      }
    } catch (error) {
      console.error('Microphone permission error:', error);
      setErrorMessage('Microphone access denied. Please allow microphone in browser settings.');
      toast.error('Microphone access denied');
    }
  };

  const stopListening = () => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
        toast.success('Stopped listening');
      } catch (error) {
        console.log('Already stopped');
      }
    }
  };

  const handleAddToBoard = () => {
    if (transcript.trim()) {
      onTextGenerated(transcript.trim());
      toast.success('Text added to board!');
      setTranscript('');
      setInterimTranscript('');
      onClose();
    } else {
      toast.error('No text to add. Please speak first.');
    }
  };

  const handleClear = () => {
    setTranscript('');
    setInterimTranscript('');
    toast.success('Text cleared');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '600px',
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
      zIndex: 1000,
      animation: 'scaleIn 0.3s ease-out'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        padding: '1rem',
        borderTopLeftRadius: '1rem',
        borderTopRightRadius: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Volume2 size={20} />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
            Voice to Text
          </h3>
        </div>
        <button
          onClick={onClose}
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
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '1.5rem' }}>
        {/* Error Message Banner */}
        {errorMessage && (
          <div style={{
            padding: '1rem',
            background: '#fef2f2',
            border: '2px solid #fca5a5',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            color: '#991b1b',
            lineHeight: '1.5',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem'
          }}>
            <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
            <div>
              <strong>⚠️ Error</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Microphone Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={!isSupported}
            style={{
              width: '5rem',
              height: '5rem',
              borderRadius: '50%',
              border: 'none',
              background: isListening 
                ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              cursor: isSupported ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s',
              boxShadow: isListening 
                ? '0 0 30px rgba(239, 68, 68, 0.5)' 
                : '0 4px 12px rgba(102, 126, 234, 0.3)',
              animation: isListening ? 'pulse 1.5s ease-in-out infinite' : 'none',
              opacity: isSupported ? 1 : 0.5
            }}
            onMouseEnter={(e) => {
              if (isSupported) {
                e.currentTarget.style.transform = 'scale(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {isListening ? <MicOff size={32} /> : <Mic size={32} />}
          </button>
        </div>

        {/* Status */}
        <div style={{
          textAlign: 'center',
          marginBottom: '1rem',
          fontSize: '0.875rem',
          color: isListening ? '#ef4444' : '#6b7280',
          fontWeight: '600'
        }}>
          {isListening ? '🔴 Listening...' : '⚪ Click microphone to start'}
        </div>

        {/* Transcript Display */}
        <div style={{
          minHeight: '150px',
          maxHeight: '300px',
          overflowY: 'auto',
          padding: '1rem',
          background: '#f9fafb',
          borderRadius: '0.5rem',
          border: '2px solid #e5e7eb',
          marginBottom: '1rem',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          color: '#111827'
        }}>
          {transcript || interimTranscript ? (
            <>
              <span>{transcript}</span>
              <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                {interimTranscript}
              </span>
            </>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#9ca3af',
              textAlign: 'center'
            }}>
              <Mic size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
              <p style={{ margin: 0 }}>Your speech will appear here...</p>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem' }}>
                Speak clearly into your microphone
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '0.75rem'
        }}>
          <button
            onClick={handleClear}
            disabled={!transcript && !interimTranscript}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'white',
              color: '#6b7280',
              border: '2px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: transcript || interimTranscript ? 'pointer' : 'not-allowed',
              opacity: transcript || interimTranscript ? 1 : 0.5,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (transcript || interimTranscript) {
                e.currentTarget.style.background = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
            }}
          >
            Clear
          </button>
          <button
            onClick={handleAddToBoard}
            disabled={!transcript.trim()}
            style={{
              flex: 2,
              padding: '0.75rem',
              background: transcript.trim() 
                ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                : '#e5e7eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: transcript.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (transcript.trim()) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Check size={18} />
            Add to Board
          </button>
        </div>

        {/* Tips */}
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: '#eff6ff',
          borderRadius: '0.5rem',
          fontSize: '0.75rem',
          color: '#1e40af',
          lineHeight: '1.5'
        }}>
          <strong>💡 How to Fix Network Error:</strong>
          <ul style={{ margin: '0.25rem 0 0 0', paddingLeft: '1.25rem' }}>
            <li><strong>Step 1:</strong> Close this tab and open <strong>http://localhost:3000</strong></li>
            <li><strong>Step 2:</strong> Check your internet connection is working</li>
            <li><strong>Step 3:</strong> Use Chrome or Edge browser (recommended)</li>
            <li><strong>Step 4:</strong> Allow microphone access when prompted</li>
            <li><strong>Step 5:</strong> Speak clearly after clicking microphone</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VoiceToText;
