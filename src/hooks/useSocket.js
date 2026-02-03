import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Socket useEffect triggered');
    console.log('User exists:', !!user);
    console.log('Token exists:', !!token);
    console.log('Token value:', token ? token.substring(0, 20) + '...' : 'null');
    
    if (user && token) {
      console.log('Initializing socket connection...');
      console.log('User:', user);
      
      // Initialize socket connection
      const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5004', {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'] // Add fallback transports
      });

      socketRef.current = newSocket;

      // Connection events
      newSocket.on('connect', () => {
        console.log('Connected to chat server');
        setConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from chat server');
        setConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        console.error('Error details:', error.message);
        setConnected(false);
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [user]);

  // Socket event handlers
  const joinCase = (caseId) => {
    if (socket) {
      socket.emit('join_case', caseId);
    }
  };

  const leaveCase = (caseId) => {
    if (socket) {
      socket.emit('leave_case', caseId);
    }
  };

  const sendMessage = (data) => {
    if (socket) {
      socket.emit('send_message', data);
    }
  };

  const startTyping = (data) => {
    if (socket) {
      socket.emit('typing_start', data);
    }
  };

  const stopTyping = (data) => {
    if (socket) {
      socket.emit('typing_stop', data);
    }
  };

  const markAsRead = (caseId) => {
    if (socket) {
      socket.emit('mark_read', caseId);
    }
  };

  return {
    socket,
    connected,
    joinCase,
    leaveCase,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead
  };
};

export default useSocket;
