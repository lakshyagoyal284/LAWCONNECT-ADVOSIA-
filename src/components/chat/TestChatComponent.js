import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Form, Button, Badge, Spinner } from 'react-bootstrap';
import { Send, Check } from 'lucide-react';
import { chatService } from '../../services/chatService';
import { useAuth } from '../../context/AuthContext';

const TestChatComponent = ({ caseId, caseTitle, receiverId, receiverName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { user } = useAuth();

  // Load initial messages
  useEffect(() => {
    loadMessages();
  }, [caseId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await chatService.getCaseMessages(caseId);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
      // Show some test messages if API fails
      setMessages([
        {
          id: 1,
          content: 'Welcome to the chat! This is a test message.',
          sender_id: 999,
          sender_name: 'System',
          created_at: new Date().toISOString(),
          is_read: true
        }
      ]);
    } finally {
      setLoading(false);
    }
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

    const messageContent = newMessage.trim();
    
    // Create a temporary message to show immediately
    const tempMessage = {
      id: Date.now(),
      content: messageContent,
      sender_id: user.id,
      sender_name: user.name,
      created_at: new Date().toISOString(),
      is_read: false
    };

    try {
      setSending(true);
      
      // Add message to UI immediately for better UX
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');
      
      // Try to send via API (but don't fail if it doesn't work)
      try {
        const messageData = {
          caseId: parseInt(caseId),
          content: messageContent,
          receiverId: parseInt(receiverId)
        };
        
        console.log('Attempting to send message:', messageData);
        const response = await chatService.sendMessage(messageData);
        console.log('Message sent successfully:', response.data);
        
        // Refresh messages to get the proper server response
        setTimeout(() => loadMessages(), 1000);
        
      } catch (apiError) {
        console.warn('API send failed, but message shown in UI:', apiError);
        // Keep the temporary message since API failed
      }
      
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Something went wrong. Please try again.');
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
          <Badge bg="warning">
            Test Mode
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
        <div className="mt-2 text-center">
          <small className="text-muted">
            Test Mode: Messages appear immediately, API saves in background
          </small>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default TestChatComponent;
