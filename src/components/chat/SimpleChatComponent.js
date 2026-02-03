import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Form, Button, Badge, Spinner } from 'react-bootstrap';
import { Send, Check } from 'lucide-react';
import { chatService } from '../../services/chatService';
import { useAuth } from '../../context/AuthContext';

const SimpleChatComponent = ({ caseId, caseTitle, receiverId, receiverName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  
  const { user } = useAuth();

  // Load initial messages
  useEffect(() => {
    loadMessages();
    startPolling();
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [caseId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await chatService.getCaseMessages(caseId);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Simple polling every 3 seconds to check for new messages
  const startPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await chatService.getCaseMessages(caseId);
        const newMessages = response.data;
        
        // Only update if there are actually new messages
        if (newMessages.length !== messages.length) {
          setMessages(newMessages);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000); // Poll every 3 seconds
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;

    const messageData = {
      caseId: parseInt(caseId), // Ensure caseId is a number
      content: newMessage.trim(),
      receiverId: parseInt(receiverId) // Ensure receiverId is a number
    };

    console.log('Sending message with data:', messageData);
    console.log('User ID:', user.id);
    console.log('User Role:', user.role);

    try {
      setSending(true);
      
      // Send message
      const response = await chatService.sendMessage(messageData);
      console.log('Send response:', response.data);
      
      // Clear input
      setNewMessage('');
      
      // Immediately refresh messages to show the new one
      await loadMessages();
      
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Show more detailed error
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send message';
      alert(`Failed to send message: ${errorMessage}`);
    } finally {
      setSending(false);
    }
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
          <Badge bg="success">
            Connected
          </Badge>
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
                onChange={(e) => setNewMessage(e.target.value)}
                className="border-0 bg-light"
                disabled={sending}
              />
            </Col>
            <Col xs="auto">
              <Button
                type="submit"
                variant="primary"
                disabled={!newMessage.trim() || sending}
                className="d-flex align-items-center"
              >
                {sending ? (
                  <Spinner animation="border" size="sm" className="me-1" />
                ) : (
                  <Send size={16} className="me-1" />
                )}
                {sending ? 'Sending...' : 'Send'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Footer>
    </Card>
  );
};

export default SimpleChatComponent;
