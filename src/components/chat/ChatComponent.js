import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Form, Button, Badge, Spinner } from 'react-bootstrap';
import { Send, Check } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';
import { chatService } from '../../services/chatService';
import { useAuth } from '../../context/AuthContext';

const ChatComponent = ({ caseId, caseTitle, receiverId, receiverName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  const { socket, connected, joinCase, leaveCase, sendMessage, startTyping, stopTyping, markAsRead } = useSocket();
  const { user } = useAuth();

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        const response = await chatService.getCaseMessages(caseId);
        setMessages(response.data);
        
        // Mark messages as read
        await markAsRead(caseId);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    if (caseId) {
      loadMessages();
    }
  }, [caseId, markAsRead]);

  // Join case room when component mounts
  useEffect(() => {
    if (connected && caseId) {
      joinCase(caseId);
      
      return () => {
        leaveCase(caseId);
      };
    }
  }, [connected, caseId, joinCase, leaveCase]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    const handleNewMessage = (message) => {
      setMessages(prev => [...prev, message]);
      
      // Mark as read if we're the receiver
      if (message.receiver_id === user.id) {
        markAsRead(caseId);
      }
    };

    // Listen for typing indicators with debouncing
    let typingTimeout;
    const handleTypingIndicator = (data) => {
      if (data.userId !== user.id) {
        // Clear existing timeout for this user
        if (typingTimeout) clearTimeout(typingTimeout);
        
        // Debounce typing indicator updates
        typingTimeout = setTimeout(() => {
          setTypingUsers(prev => {
            const filtered = prev.filter(u => u.userId !== data.userId);
            return data.isTyping ? [...filtered, data] : filtered;
          });
        }, 300); // 300ms debounce
      }
    };

    // Listen for messages being read
    const handleMessagesRead = (data) => {
      if (data.userId !== user.id) {
        setMessages(prev => prev.map(msg => 
          msg.sender_id === user.id ? { ...msg, is_read: true } : msg
        ));
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleTypingIndicator);
    socket.on('messages_read', handleMessagesRead);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleTypingIndicator);
      socket.off('messages_read', handleMessagesRead);
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [socket, user.id, caseId, markAsRead]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    console.log('Send message clicked');
    console.log('Message content:', newMessage.trim());
    
    if (!newMessage.trim()) {
      console.log('Empty message - not sending');
      return;
    }

    const messageData = {
      caseId,
      content: newMessage.trim(),
      receiverId
    };

    console.log('Message data:', messageData);

    try {
      // Send via API only (simplified)
      console.log('Sending via API...');
      const response = await chatService.sendMessage(messageData);
      console.log('API response:', response.data);
      
      // Clear input
      setNewMessage('');
      
      // Refresh messages to show the new one
      const messagesResponse = await chatService.getCaseMessages(caseId);
      setMessages(messagesResponse.data);
      
      console.log('Message sent and refreshed successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Show user-friendly error
      alert('Failed to send message. Please try again.');
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    // DISABLED: Typing indicators causing performance issues
    // Only send typing indicator if there's actual text content
    // const hasText = e.target.value.trim().length > 0;
    // 
    // if (hasText && !isTyping) {
    //   setIsTyping(true);
    //   startTyping({ caseId, receiverId });
    // }
    //
    // // Clear existing timeout
    // if (typingTimeoutRef.current) {
    //   clearTimeout(typingTimeoutRef.current);
    // }
    //
    // // Set new timeout to stop typing indicator (longer delay for better performance)
    // typingTimeoutRef.current = setTimeout(() => {
    //   if (isTyping) {
    //     setIsTyping(false);
    //     stopTyping({ caseId, receiverId });
    //   }
    // }, 2000); // 2 seconds instead of 1 second
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOwnMessage = (message) => message.sender_id === user.id;

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-4">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Card className="chat-component h-100">
      <Card.Header className="bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="mb-0">{caseTitle}</h6>
            <small>Chat with {receiverName}</small>
          </div>
          <div className="d-flex align-items-center">
            <Badge bg={connected ? 'success' : 'danger'} className="me-2">
              {connected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
        </div>
      </Card.Header>

      <Card.Body className="p-0">
        <div className="chat-messages" style={{ height: '400px', overflowY: 'auto' }}>
          <div className="p-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message mb-3 ${isOwnMessage(message) ? 'text-end' : 'text-start'}`}
              >
                <div className={`d-inline-block ${isOwnMessage(message) ? '' : ''}`}>
                  <div
                    className={`message-bubble p-2 rounded-2 ${
                      isOwnMessage(message)
                        ? 'bg-primary text-white'
                        : 'bg-light text-dark'
                    }`}
                    style={{ maxWidth: '70%' }}
                  >
                    <div className="message-content">{message.content}</div>
                    <div className={`message-time small ${isOwnMessage(message) ? 'text-white-50' : 'text-muted'}`}>
                      {formatTime(message.created_at)}
                      {isOwnMessage(message) && (
                        <span className="ms-1">
                          {message.is_read ? <Check size={12} /> : <Check size={12} />}
                        </span>
                      )}
                    </div>
                  </div>
                  {!isOwnMessage(message) && (
                    <div className="message-sender small text-muted mt-1">
                      {message.sender_name}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing indicators */}
            {typingUsers.map((user) => (
              <div key={user.userId} className="typing-indicator text-start mb-2">
                <div className="d-inline-block bg-light p-2 rounded-2">
                  <small className="text-muted">{user.userName} is typing...</small>
                </div>
              </div>
            ))}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </Card.Body>

      <Card.Footer className="p-3">
        <Form onSubmit={handleSendMessage}>
          <Row className="g-2">
            <Col>
              <Form.Control
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={handleTyping}
                className="border-0 bg-light"
              />
            </Col>
            <Col xs="auto">
              <Button
                type="submit"
                variant="primary"
                disabled={!newMessage.trim()}
                className="d-flex align-items-center"
              >
                <Send size={16} className="me-1" />
                Send
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Footer>
    </Card>
  );
};

export default ChatComponent;
