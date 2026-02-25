import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Maximize2, Minimize2 } from 'lucide-react';
import socketService from '../services/socket';

const VideoCall = ({ roomId, currentUser, users }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [peerConnections, setPeerConnections] = useState({});
  
  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef({});

  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    if (!socketService.socket) return;

    // Listen for WebRTC signaling events
    socketService.socket.on('video-offer', handleVideoOffer);
    socketService.socket.on('video-answer', handleVideoAnswer);
    socketService.socket.on('ice-candidate', handleIceCandidate);
    socketService.socket.on('user-video-joined', handleUserVideoJoined);
    socketService.socket.on('user-video-left', handleUserVideoLeft);

    return () => {
      if (socketService.socket) {
        socketService.socket.off('video-offer', handleVideoOffer);
        socketService.socket.off('video-answer', handleVideoAnswer);
        socketService.socket.off('ice-candidate', handleIceCandidate);
        socketService.socket.off('user-video-joined', handleUserVideoJoined);
        socketService.socket.off('user-video-left', handleUserVideoLeft);
      }
    };
  }, []);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });

      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setIsCallActive(true);

      // Notify other users that we joined video
      socketService.socket.emit('join-video', { roomId, userId: currentUser.id });

      // Create peer connections for existing users
      users.forEach(user => {
        if (user.id !== currentUser.id) {
          createPeerConnection(user.id, stream);
        }
      });
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Could not access camera/microphone. Please check permissions.');
    }
  };

  const endCall = () => {
    // Stop all tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    // Close all peer connections
    Object.values(peerConnections).forEach(pc => pc.close());
    setPeerConnections({});
    setRemoteStreams({});
    setIsCallActive(false);

    // Notify others
    socketService.socket.emit('leave-video', { roomId, userId: currentUser.id });
  };

  const createPeerConnection = async (userId, stream) => {
    const peerConnection = new RTCPeerConnection(configuration);

    // Add local stream tracks to peer connection
    stream.getTracks().forEach(track => {
      peerConnection.addTrack(track, stream);
    });

    // Handle incoming tracks
    peerConnection.ontrack = (event) => {
      setRemoteStreams(prev => ({
        ...prev,
        [userId]: event.streams[0]
      }));
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketService.socket.emit('ice-candidate', {
          roomId,
          candidate: event.candidate,
          targetUserId: userId
        });
      }
    };

    setPeerConnections(prev => ({
      ...prev,
      [userId]: peerConnection
    }));

    // Create and send offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socketService.socket.emit('video-offer', {
      roomId,
      offer,
      targetUserId: userId
    });

    return peerConnection;
  };

  const handleVideoOffer = async ({ offer, fromUserId }) => {
    if (!localStream) return;

    let peerConnection = peerConnections[fromUserId];
    
    if (!peerConnection) {
      peerConnection = new RTCPeerConnection(configuration);

      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });

      peerConnection.ontrack = (event) => {
        setRemoteStreams(prev => ({
          ...prev,
          [fromUserId]: event.streams[0]
        }));
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socketService.socket.emit('ice-candidate', {
            roomId,
            candidate: event.candidate,
            targetUserId: fromUserId
          });
        }
      };

      setPeerConnections(prev => ({
        ...prev,
        [fromUserId]: peerConnection
      }));
    }

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socketService.socket.emit('video-answer', {
      roomId,
      answer,
      targetUserId: fromUserId
    });
  };

  const handleVideoAnswer = async ({ answer, fromUserId }) => {
    const peerConnection = peerConnections[fromUserId];
    if (peerConnection) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleIceCandidate = async ({ candidate, fromUserId }) => {
    const peerConnection = peerConnections[fromUserId];
    if (peerConnection) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const handleUserVideoJoined = ({ userId }) => {
    if (userId !== currentUser.id && localStream) {
      createPeerConnection(userId, localStream);
    }
  };

  const handleUserVideoLeft = ({ userId }) => {
    // Close peer connection
    if (peerConnections[userId]) {
      peerConnections[userId].close();
      setPeerConnections(prev => {
        const newPCs = { ...prev };
        delete newPCs[userId];
        return newPCs;
      });
    }

    // Remove remote stream
    setRemoteStreams(prev => {
      const newStreams = { ...prev };
      delete newStreams[userId];
      return newStreams;
    });
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  useEffect(() => {
    // Update remote video refs when streams change
    Object.entries(remoteStreams).forEach(([userId, stream]) => {
      if (remoteVideoRefs.current[userId]) {
        remoteVideoRefs.current[userId].srcObject = stream;
      }
    });
  }, [remoteStreams]);

  const getUsernameById = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : 'Unknown';
  };

  if (!isCallActive) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '6rem',
        right: '2rem',
        zIndex: 999
      }}>
        <button
          onClick={startCall}
          style={{
            padding: '0.875rem 1.5rem',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
          }}
        >
          <Video size={20} />
          Start Video Call
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: isExpanded ? '1rem' : '1rem',
      right: isExpanded ? '1rem' : '2rem',
      width: isExpanded ? 'calc(100vw - 2rem)' : '320px',
      maxWidth: isExpanded ? '1200px' : '320px',
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
      zIndex: 999,
      overflow: 'hidden',
      transition: 'all 0.3s'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Video size={18} />
          <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
            Video Call ({Object.keys(remoteStreams).length + 1} participants)
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            padding: '0.25rem',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* Video Grid */}
      <div style={{
        padding: '1rem',
        display: 'grid',
        gridTemplateColumns: isExpanded 
          ? 'repeat(auto-fill, minmax(280px, 1fr))' 
          : '1fr',
        gap: '1rem',
        maxHeight: isExpanded ? '600px' : '400px',
        overflowY: 'auto',
        background: '#1f2937'
      }}>
        {/* Local Video */}
        <div style={{
          position: 'relative',
          borderRadius: '0.5rem',
          overflow: 'hidden',
          background: '#111827',
          aspectRatio: '16/9'
        }}>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scaleX(-1)'
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: '0.5rem',
            left: '0.5rem',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: '500'
          }}>
            You {!isVideoEnabled && '(Camera Off)'}
          </div>
          {!isVideoEnabled && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '3rem',
              height: '3rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Remote Videos */}
        {Object.entries(remoteStreams).map(([userId, stream]) => (
          <div
            key={userId}
            style={{
              position: 'relative',
              borderRadius: '0.5rem',
              overflow: 'hidden',
              background: '#111827',
              aspectRatio: '16/9'
            }}
          >
            <video
              ref={el => remoteVideoRefs.current[userId] = el}
              autoPlay
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '0.5rem',
              left: '0.5rem',
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              {getUsernameById(userId)}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{
        padding: '1rem',
        display: 'flex',
        justifyContent: 'center',
        gap: '0.75rem',
        background: '#f9fafb',
        borderTop: '1px solid #e5e7eb'
      }}>
        <button
          onClick={toggleVideo}
          style={{
            padding: '0.75rem',
            borderRadius: '50%',
            border: 'none',
            background: isVideoEnabled ? '#f3f4f6' : '#ef4444',
            color: isVideoEnabled ? '#374151' : 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            width: '3rem',
            height: '3rem'
          }}
          onMouseEnter={(e) => {
            if (isVideoEnabled) {
              e.currentTarget.style.background = '#e5e7eb';
            }
          }}
          onMouseLeave={(e) => {
            if (isVideoEnabled) {
              e.currentTarget.style.background = '#f3f4f6';
            }
          }}
          title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
        >
          {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
        </button>

        <button
          onClick={toggleAudio}
          style={{
            padding: '0.75rem',
            borderRadius: '50%',
            border: 'none',
            background: isAudioEnabled ? '#f3f4f6' : '#ef4444',
            color: isAudioEnabled ? '#374151' : 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            width: '3rem',
            height: '3rem'
          }}
          onMouseEnter={(e) => {
            if (isAudioEnabled) {
              e.currentTarget.style.background = '#e5e7eb';
            }
          }}
          onMouseLeave={(e) => {
            if (isAudioEnabled) {
              e.currentTarget.style.background = '#f3f4f6';
            }
          }}
          title={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
        >
          {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
        </button>

        <button
          onClick={endCall}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '9999px',
            border: 'none',
            background: '#ef4444',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s',
            fontWeight: '600',
            fontSize: '0.875rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#dc2626';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ef4444';
          }}
        >
          <PhoneOff size={18} />
          End Call
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
