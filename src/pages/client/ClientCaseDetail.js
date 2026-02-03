import React, { useState } from 'react';
import { Container, Card, Button, Row, Col, Badge, ListGroup, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaFileAlt, FaPaperclip, FaPaperPlane, FaTrash } from 'react-icons/fa';

const ClientCaseDetail = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  
  // Mock data - replace with actual data fetching
  const caseData = {
    id: caseId,
    title: 'Divorce Proceedings',
    status: 'In Progress',
    category: 'Family Law',
    description: 'Handling divorce proceedings and asset division for the client.',
    lawyer: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@lawfirm.com',
      phone: '(555) 123-4567',
      specialization: 'Family Law Specialist'
    },
    documents: [
      { id: 1, name: 'Initial_Agreement.pdf', date: '2023-10-10', size: '2.1 MB' },
      { id: 2, name: 'Financial_Disclosure.pdf', date: '2023-10-12', size: '1.5 MB' },
    ],
    messages: [
      { id: 1, sender: 'lawyer', text: 'I\'ve reviewed your documents. We need to discuss the settlement terms.', time: '2023-10-15T10:30:00' },
      { id: 2, sender: 'client', text: 'When would be a good time to discuss?', time: '2023-10-15T11:15:00' },
    ]
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // In a real app, this would send the message to the server
      console.log('Message sent:', message);
      setMessage('');
    }
  };

  return (
    <Container className="py-4">
      <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-4">
        ← Back to My Cases
      </Button>
      
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h2>{caseData.title} <small className="text-muted">#{caseData.id}</small></h2>
              <div className="d-flex gap-2 mb-2">
                <Badge bg={caseData.status === 'In Progress' ? 'warning' : 'success'} className="fs-6">
                  {caseData.status}
                </Badge>
                <Badge bg="info" className="fs-6">{caseData.category}</Badge>
              </div>
            </div>
            <Button variant="outline-primary" size="sm" onClick={() => navigate(`/client/cases/${caseId}/edit`)}>
              Edit Case
            </Button>
          </div>
          
          <Card.Text className="mb-4">
            {caseData.description}
          </Card.Text>
          
          <div className="d-flex flex-wrap gap-4">
            <div>
              <h6 className="text-muted mb-1">Assigned Lawyer</h6>
              <div className="fw-medium">{caseData.lawyer.name}</div>
              <small className="text-muted">{caseData.lawyer.specialization}</small>
            </div>
            <div>
              <h6 className="text-muted mb-1">Contact</h6>
              <div>{caseData.lawyer.email}</div>
              <div>{caseData.lawyer.phone}</div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Case Updates</Card.Title>
              <div className="border rounded p-3 mb-3" style={{ height: '300px', overflowY: 'auto' }}>
                {caseData.messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`mb-3 d-flex ${msg.sender === 'client' ? 'justify-content-end' : 'justify-content-start'}`}
                  >
                    <div 
                      className={`p-3 rounded ${msg.sender === 'client' ? 'bg-primary text-white' : 'bg-light'}`}
                      style={{ maxWidth: '70%' }}
                    >
                      <div className="mb-1">{msg.text}</div>
                      <div className={`small ${msg.sender === 'client' ? 'text-white-50' : 'text-muted'}`}>
                        {new Date(msg.time).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Form onSubmit={handleSendMessage} className="mt-3">
                <div className="d-flex gap-2">
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <Button type="submit" variant="primary">
                    <FaPaperPlane />
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Case Documents</Card.Title>
              <ListGroup variant="flush">
                {caseData.documents.map(doc => (
                  <ListGroup.Item key={doc.id} className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <FaFileAlt className="me-2 text-muted" />
                      <div>
                        <div className="text-truncate" style={{ maxWidth: '150px' }} title={doc.name}>
                          {doc.name}
                        </div>
                        <small className="text-muted">{doc.size} • {doc.date}</small>
                      </div>
                    </div>
                    <div className="d-flex gap-1">
                      <Button variant="outline-primary" size="sm">
                        View
                      </Button>
                      <Button variant="outline-secondary" size="sm">
                        <FaPaperclip />
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Button variant="outline-primary" size="sm" className="mt-3 w-100">
                <FaPaperclip className="me-1" /> Upload Document
              </Button>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Body>
              <Card.Title>Quick Actions</Card.Title>
              <div className="d-grid gap-2">
                <Button variant="outline-primary">
                  Schedule Meeting
                </Button>
                <Button variant="outline-secondary">
                  Request Document
                </Button>
                <Button variant="outline-danger">
                  Close Case
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ClientCaseDetail;
